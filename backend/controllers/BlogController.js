const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const slugify = require("slugify");
const BlogModel = require("../models/BlogModel");
const BlogEngagementModel = require("../models/BlogEngagementModel");
const NewsletterSubscriberModel = require("../models/NewsletterSubscriberModel");
const { default: ImageModel } = require("../models/ImageModel");
const CategoryModel = require("../models/common/CategoryModel");
const { updateResourceField } = require("../utils/updateResourceField");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const findBlogBySlug = async (slug) => {
  if (!slug) {
    const error = new Error("Blog slug is required in the request.");
    error.statusCode = 400;
    throw error;
  }

  const blog = await BlogModel.findOne({ slug });

  if (!blog) {
    const error = new Error("Blog not found. Please check the provided slug.");
    error.statusCode = 404;
    throw error;
  }

  return blog;
};

const parseJsonArray = (value, fallback = []) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  return fallback;
};

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, tags, category, metaDescription, visibility, groupId, seoTitle, canonicalUrl, keywords, ogImage, relatedPosts } = req.body;
  const userId = req.user.id;

  const filter = new Filter();
  const fieldsToCheck = [title, tags, category, metaDescription];
  for (const field of fieldsToCheck) {
    if (filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words, and your feedback cannot be posted due to content guidelines.",
      });
    }
  }

  if (!category) {
    return res.status(400).json({ error: "Category is required." });
  }

  // Generate a unique slug for the blog post
  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await BlogModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Handle the uploaded cover image
  if (!req.file) {
    return res.status(400).json({ error: "Image is required." });
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedImageTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid image format. Supported formats: JPEG, PNG." });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: "Image size should not exceed 5 MB." });
  }

  let fileData = {};
  try {
    uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      folder: "Sunil Portfolio/Blog",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Image could not be uploaded");
  }

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    publicId: uploadedFile.public_id,
  };

  // Parse tags if they are sent as a JSON string
  let parsedTags = [];
  if (tags === undefined || tags === null || tags === "") {
    parsedTags = [];
  } else if (typeof tags === "string") {
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      return res.status(400).json({ error: "Invalid tags format. Tags must be a valid JSON array of objects." });
    }
  } else if (Array.isArray(tags)) {
    parsedTags = tags;
  } else {
    return res.status(400).json({ error: "Tags must be an array of objects." });
  }

  // Validate tag format
  const formattedTags = parsedTags.map((tagObj) => {
    if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
      return res.status(400).json({ error: "Each tag must be a valid string inside an object." });
    }
    return { tag: tagObj.tag.trim() };
  });

  const data = await BlogModel.create({
    user: userId,
    title,
    slug,
    description,
    metaDescription,
    category,
    groupId,
    cover: fileData,
    tags: formattedTags,
    visibility: visibility,
    seo: {
      title: String(seoTitle || "").trim(),
      canonicalUrl: String(canonicalUrl || "").trim(),
      keywords: parseJsonArray(keywords).map((keyword) => String(keyword).trim()).filter(Boolean),
      ogImage: String(ogImage || "").trim(),
    },
    relatedPosts: parseJsonArray(relatedPosts).filter(Boolean),
  });

  res.status(201).json({ message: "Blog post created successfully", data });
});

const getAllBlog = asyncHandler(async (req, res) => {
  const Blogs = await BlogModel.find()
    .sort("-createdAt")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "title type",
    });

  if (!Blogs) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json({ total: Blogs?.length, BlogList: Blogs });
});

const getBlog = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Blog slug is required in the request.");
  }

  // Find the blog by slug
  const Blog = await BlogModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "type title",
    })
    .populate({
      path: "relatedPosts",
      select: "title slug metaDescription cover category tags createdAt",
      populate: {
        path: "category",
        select: "title type",
      },
    });

  if (!Blog) {
    res.status(404);
    throw new Error("Blog not found. Please check the provided slug.");
  }

  // Increment the number of views
  Blog.numOfViews = (Blog.numOfViews || 0) + 1;
  await Blog.save();

  res.status(200).json(Blog);
});

const getBlogPrivate = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Blog slug is required in the request.");
  }

  // Get the logged-in user from the request (assuming JWT authentication)
  const loggedInUser = req.user;

  // Find the blog by slug and populate related fields
  const blog = await BlogModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "type title",
    })
    .populate({
      path: "relatedPosts",
      select: "title slug metaDescription cover category tags createdAt",
      populate: {
        path: "category",
        select: "title type",
      },
    });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found. Please check the provided slug.");
  }

  // Check if the logged-in user is the creator or an admin
  const blogOwnerId = blog.user?._id || blog.user;
  if (blogOwnerId.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin" && loggedInUser.role !== "super admin") {
    res.status(403);
    throw new Error("You are not authorized to access this blog.");
  }

  // Extract image URLs from the blog description (assuming HTML content)
  const usedImageUrls = [];
  const descriptionHtml = blog.description || "";
  const imgTagRegex = /<img[^>]+src=["'](.*?)["']/gi;
  let match;
  while ((match = imgTagRegex.exec(descriptionHtml)) !== null) {
    usedImageUrls.push(match[1]); // match[1] is the src value
  }

  // Fetch all images related to the blog by groupId (for unused images)
  const allImagesForBlog = await ImageModel.find({ groupId: blog.groupId }).select("filePath fileName fileType publicId folder createdAt");

  // Fetch used images by filePath, regardless of groupId
  const usedImages = await ImageModel.find({ filePath: { $in: usedImageUrls } }).select("filePath fileName fileType publicId folder createdAt groupId");

  // Filter unused images: images with this blog's groupId but not in the description
  const unusedImages = allImagesForBlog.filter((image) => !usedImageUrls.includes(image.filePath));

  // Combine blog data with used and unused images
  const blogWithImages = {
    ...blog.toObject(), // Convert Mongoose document to plain JS object
    usedImages: usedImages || [], // Images actually used in description, regardless of groupId
    unusedImages: unusedImages || [], // Images uploaded for this blog but not used
  };

  res.status(200).json(blogWithImages);
});

const deleteBlog = asyncHandler(async (req, res) => {
  let BlogId;

  if (req.body && req.body.id) {
    BlogId = req.body.id;
  } else if (req.params && req.params.id) {
    BlogId = req.params.id;
  }

  if (!BlogId) {
    res.status(400);
    throw new Error("Blog ID is required in the request.");
  }

  const blog = await BlogModel.findOne({ _id: BlogId });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found. Please check the provided information.");
  }

  // Delete the cover image from Cloudinary if it exists
  if (blog.cover && blog.cover.publicId) {
    try {
      console.log(`Attempting to delete cover image from Cloudinary with publicId: ${blog.cover.publicId}`);
      const result = await cloudinary.uploader.destroy(blog.cover.publicId);
      if (result.result !== "ok") {
        console.error(`Failed to delete cover image ${blog.cover.publicId} from Cloudinary: ${JSON.stringify(result)}`);
        res.status(500).json({ message: "Error deleting cover image from Cloudinary" });
        return;
      }
      console.log(`Successfully deleted cover image ${blog.cover.publicId} from Cloudinary`);
    } catch (error) {
      console.error(`Error deleting cover image from Cloudinary: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting the cover image from Cloudinary." });
      return;
    }
  }

  // Extract used image URLs from the blog description
  const usedImageUrls = [];
  const descriptionHtml = blog.description || "";
  const imgTagRegex = /<img[^>]+src=["'](.*?)["']/gi;
  let match;
  while ((match = imgTagRegex.exec(descriptionHtml)) !== null) {
    usedImageUrls.push(match[1]); // match[1] is the src value
  }

  // Fetch all images used in this blog's description (by filePath, not just groupId)
  const usedImages = await ImageModel.find({ filePath: { $in: usedImageUrls } });

  // Check if each used image is referenced in any other blog
  const imagesToDelete = [];
  if (usedImages && usedImages.length > 0) {
    try {
      for (const image of usedImages) {
        // Search all other blogs (excluding this one) for the image's filePath
        const otherBlogsUsingImage = await BlogModel.find({
          _id: { $ne: BlogId }, // Exclude the current blog
          description: { $regex: image.filePath, $options: "i" }, // Case-insensitive match
        });

        if (otherBlogsUsingImage.length === 0) {
          // No other blogs use this image, so it can be deleted
          imagesToDelete.push(image);
        } else {
          console.log(`Image ${image.filePath} is used in ${otherBlogsUsingImage.length} other blogs and will not be deleted.`);
        }
      }

      // Delete images from Cloudinary and MongoDB if they are not used elsewhere
      for (const image of imagesToDelete) {
        if (image.publicId) {
          const fullPublicId = `${image.folder}/${image.publicId}`.replace(/^\/+/, ""); // Combine folder and publicId
          console.log(`Attempting to delete image from Cloudinary with publicId: ${fullPublicId}`);
          const result = await cloudinary.uploader.destroy(fullPublicId);
          if (result.result !== "ok") {
            console.error(`Failed to delete image ${fullPublicId} from Cloudinary: ${JSON.stringify(result)}`);
            // Continue with other deletions
          } else {
            console.log(`Successfully deleted image ${fullPublicId} from Cloudinary`);
          }
        }
      }

      // Delete only the images not used elsewhere from MongoDB
      const filePathsToDelete = imagesToDelete.map((image) => image.filePath);
      if (filePathsToDelete.length > 0) {
        console.log(`Deleting images from MongoDB with filePaths: ${filePathsToDelete}`);
        await ImageModel.deleteMany({ filePath: { $in: filePathsToDelete } });
      }
    } catch (error) {
      console.error(`Error deleting images from Cloudinary or MongoDB: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting blog images." });
      return;
    }
  }

  // Delete the blog from MongoDB
  await blog.deleteOne();

  res.status(200).json({ message: "Blog and unused images deleted successfully" });
});

const updateFeaturedStatus = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { featured } = req.body;

  try {
    const updatedBlog = await updateResourceField({
      resourceId: blogId,
      fieldName: "featured",
      fieldValue: featured,
      validateField: (value) => {
        if (typeof value !== "boolean") {
          return "The 'featured' field must be a boolean.";
        }
        return null;
      },
      Model: BlogModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Blog",
    });

    res.status(200).json({
      message: "Blog featured status updated successfully.",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

const updateVisibility = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const { visibility } = req.body;

  try {
    const updatedBlog = await updateResourceField({
      resourceId: blogId,
      fieldName: "visibility",
      fieldValue: visibility,
      validateField: (value) => {
        if (!["public", "private"].includes(value)) {
          return "Visibility must be either 'public' or 'private'.";
        }
        return null;
      },
      Model: BlogModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Blog",
    });

    res.status(200).json({
      message: "Blog visibility updated successfully.",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

const getBlogsByCategoryAndTag = asyncHandler(async (req, res) => {
  const { category, tag } = req.query;

  let query = {};

  // Handle category (search by title and convert to ObjectId)
  if (category) {
    // Find the category by title (case-insensitive)
    const categoryDoc = await CategoryModel.findOne({
      title: { $regex: new RegExp(category, "i") },
    });

    if (!categoryDoc) {
      res.status(404);
      throw new Error(`Category "${category}" not found.`);
    }

    // Use the category's _id in the query
    query["category"] = categoryDoc._id;
  }

  // Handle tag (search within the tags array of objects)
  if (tag) {
    query["tags.tag"] = { $regex: new RegExp(tag, "i") }; // Case-insensitive tag search
  }

  // Require at least one filter
  if (!category && !tag) {
    res.status(400);
    throw new Error("Please provide at least a category or tag to search.");
  }

  // Find blogs matching the query
  const Blogs = await BlogModel.find(query)
    .sort("createdAt")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "title type",
    });

  if (!Blogs || Blogs.length === 0) {
    res.status(404);
    throw new Error("No blogs found matching the provided category or tag.");
  }

  res.status(200).json({ total: Blogs.length, BlogList: Blogs });
});

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email, name = "", source = "blog-detail" } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!emailRegex.test(normalizedEmail)) {
    res.status(400);
    throw new Error("Please enter a valid email address.");
  }

  const subscriber = await NewsletterSubscriberModel.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name: String(name || "").trim(),
        source: String(source || "blog-detail").trim(),
        isActive: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({
    message: "You are subscribed successfully.",
    subscriber: {
      email: subscriber.email,
      name: subscriber.name,
      source: subscriber.source,
    },
  });
});

const submitHelpfulFeedback = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlug(req.params.slug);
  const rawValue = String(req.body?.value || "").trim();
  const isHelpful = ["yes", "helpful", "true"].includes(rawValue.toLowerCase());

  await BlogEngagementModel.create({
    blog: blog._id,
    user: req.user?._id || null,
    eventType: "helpful",
    value: rawValue || (isHelpful ? "Yes" : "Not yet"),
  });

  const analyticsPath = isHelpful ? "analytics.helpfulYes" : "analytics.helpfulNo";
  const updatedBlog = await BlogModel.findByIdAndUpdate(blog._id, { $inc: { [analyticsPath]: 1 } }, { new: true }).select("analytics");

  res.status(200).json({
    message: "Thanks for your feedback.",
    analytics: updatedBlog?.analytics || {},
  });
});

const trackBlogShare = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlug(req.params.slug);
  const platform = String(req.body?.platform || "copy").trim().slice(0, 40);

  await BlogEngagementModel.create({
    blog: blog._id,
    user: req.user?._id || null,
    eventType: "share",
    platform,
    value: platform,
  });

  const updatedBlog = await BlogModel.findByIdAndUpdate(blog._id, { $inc: { "analytics.shares": 1 } }, { new: true }).select("analytics");

  res.status(200).json({
    message: "Share tracked.",
    analytics: updatedBlog?.analytics || {},
  });
});

const submitBlogIssue = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlug(req.params.slug);
  const message = String(req.body?.message || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const name = String(req.body?.name || "").trim();

  if (message.length < 8) {
    res.status(400);
    throw new Error("Please write a little more detail about the issue.");
  }

  if (email && !emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please enter a valid email address.");
  }

  await BlogEngagementModel.create({
    blog: blog._id,
    user: req.user?._id || null,
    eventType: "report",
    value: "suggest-edit",
    message,
    email,
    name,
  });

  await BlogModel.findByIdAndUpdate(blog._id, { $inc: { "analytics.reports": 1 } });

  res.status(201).json({
    message: "Thanks, your suggestion was sent.",
  });
});

const trackReadingHistory = asyncHandler(async (req, res) => {
  const blog = await findBlogBySlug(req.params.slug);
  const progress = Math.max(0, Math.min(100, Number(req.body?.progress || 0)));

  if (!req.user?._id) {
    return res.status(200).json({ message: "Reading progress noted." });
  }

  const existingRead = await BlogEngagementModel.findOne({
    blog: blog._id,
    user: req.user._id,
    eventType: "read",
  });

  const shouldCountCompletedRead = (!existingRead || Number(existingRead.progress || 0) < 80) && progress >= 80;

  await BlogEngagementModel.findOneAndUpdate(
    {
      blog: blog._id,
      user: req.user._id,
      eventType: "read",
    },
    {
      $set: {
        value: "reading-history",
      },
      $max: {
        progress,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  if (shouldCountCompletedRead) {
    await BlogModel.findByIdAndUpdate(blog._id, { $inc: { "analytics.reads": 1 } });
  }

  res.status(200).json({
    message: "Reading history updated.",
    progress,
  });
});

const getBlogEngagementAnalytics = asyncHandler(async (req, res) => {
  const [eventCounts, subscribersCount, totalBlogs, publishedBlogs, totalViewsResult, topBlogs, recentReports] = await Promise.all([
    BlogEngagementModel.aggregate([
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]),
    NewsletterSubscriberModel.countDocuments({ isActive: true }),
    BlogModel.countDocuments(),
    BlogModel.countDocuments({ visibility: "public" }),
    BlogModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$numOfViews" },
          totalShares: { $sum: "$analytics.shares" },
          helpfulYes: { $sum: "$analytics.helpfulYes" },
          helpfulNo: { $sum: "$analytics.helpfulNo" },
          reports: { $sum: "$analytics.reports" },
          completedReads: { $sum: "$analytics.reads" },
          totalLikes: { $sum: { $size: { $ifNull: ["$likes", []] } } },
        },
      },
    ]),
    BlogModel.find()
      .sort({ numOfViews: -1, "analytics.shares": -1, createdAt: -1 })
      .limit(8)
      .select("title slug cover numOfViews likes analytics createdAt")
      .lean(),
    BlogEngagementModel.find({ eventType: "report" })
      .sort("-createdAt")
      .limit(8)
      .populate({ path: "blog", select: "title slug" })
      .populate({ path: "user", select: "name email" })
      .lean(),
  ]);

  const counts = eventCounts.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {});
  const totals = totalViewsResult?.[0] || {};

  res.status(200).json({
    totalBlogs,
    publishedBlogs,
    draftBlogs: Math.max(totalBlogs - publishedBlogs, 0),
    subscribersCount,
    totalViews: totals.totalViews || 0,
    totalShares: totals.totalShares || counts.share || 0,
    helpfulYes: totals.helpfulYes || 0,
    helpfulNo: totals.helpfulNo || 0,
    helpfulVotes: (totals.helpfulYes || 0) + (totals.helpfulNo || 0),
    totalLikes: totals.totalLikes || 0,
    reports: totals.reports || counts.report || 0,
    completedReads: totals.completedReads || counts.read || 0,
    eventCounts: counts,
    topBlogs,
    recentReports,
  });
});

const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriberModel.find().sort("-createdAt").lean();

  res.status(200).json({
    total: subscribers.length,
    subscribers,
  });
});

const getBlogReports = asyncHandler(async (req, res) => {
  const reports = await BlogEngagementModel.find({ eventType: "report" })
    .sort("-createdAt")
    .populate({ path: "blog", select: "title slug cover" })
    .populate({ path: "user", select: "name email avatar" })
    .lean();

  res.status(200).json({
    total: reports.length,
    reports,
  });
});

const updateBlogReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  const allowedStatuses = ["new", "reviewing", "fixed", "ignored"];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid report status.");
  }

  const report = await BlogEngagementModel.findOneAndUpdate({ _id: req.params.id, eventType: "report" }, { status }, { new: true })
    .populate({ path: "blog", select: "title slug" })
    .populate({ path: "user", select: "name email" });

  if (!report) {
    res.status(404);
    throw new Error("Report not found.");
  }

  res.status(200).json({
    message: "Report status updated.",
    report,
  });
});

const getMyBlogReadingHistory = asyncHandler(async (req, res) => {
  const history = await BlogEngagementModel.find({ user: req.user._id, eventType: "read" })
    .sort("-updatedAt")
    .populate({
      path: "blog",
      select: "title slug cover metaDescription category createdAt",
      populate: {
        path: "category",
        select: "title type",
      },
    })
    .lean();

  res.status(200).json({
    total: history.length,
    history,
  });
});

// from here to do
const updateBlog = asyncHandler(async (req, res) => {
  // Normalize req.body keys by trimming whitespace
  const normalizedBody = {};
  for (const key in req.body) {
    normalizedBody[key.trim()] = req.body[key];
  }
  const { title, description, tags, category, metaDescription, seoTitle, canonicalUrl, keywords, ogImage, relatedPosts } = normalizedBody;
  const blogSlug = req.params.slug;
  const userId = req.user.id;

  // Find the existing blog post
  const blog = await BlogModel.findOne({ slug: blogSlug });
  if (!blog) {
    return res.status(404).json({ error: "Blog post not found." });
  }
  blog.seo = blog.seo || {};

  // Check authorization (user is the creator or admin)
  const blogOwnerId = blog.user?._id || blog.user;
  if (blogOwnerId.toString() !== userId && req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(403).json({ error: "You are not authorized to update this blog." });
  }

  // Profanity filter
  const filter = new Filter();
  const fieldsToCheck = [title, description, tags, category, metaDescription].filter(Boolean);
  for (const field of fieldsToCheck) {
    if (filter.isProfane(field)) {
      return res.status(400).json({
        error: "Update failed because the content contains profane words, and your feedback cannot be updated due to content guidelines.",
      });
    }
  }

  // Handle cover image update
  if (req.file) {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid image format. Supported formats: JPEG, PNG." });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image size should not exceed 5 MB." });
    }

    // Delete the previous image from Cloudinary if it exists
    if (blog.cover && blog.cover.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(blog.cover.publicId);
        if (result.result !== "ok") {
          return res.status(500).json({ error: "Failed to delete previous cover image from Cloudinary." });
        }
      } catch (error) {
        return res.status(500).json({ error: "Error deleting previous cover image from Cloudinary." });
      }
    }

    // Upload the new image
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Blog",
      });
      blog.cover = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        publicId: uploadedFile.public_id,
      };
    } catch (error) {
      return res.status(500).json({ error: "Image could not be uploaded." });
    }
  }

  // Generate new slug if title is updated
  if (title && title !== blog.title) {
    const originalSlug = slugify(title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      strict: true,
    });
    let slug = originalSlug;
    let suffix = 1;

    while (await BlogModel.findOne({ slug, _id: { $ne: blog._id } })) {
      slug = `${suffix}-${originalSlug}`;
      suffix++;
    }
    blog.slug = slug;
  }

  // Handle tags update - Aligned with createBlog logic
  if (tags !== undefined) {
    let parsedTags = [];
    // Parse tags if they are sent as a JSON string
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        return res.status(400).json({ error: "Invalid tags format. Tags must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      return res.status(400).json({ error: "Tags must be an array of objects." });
    }

    // Validate tag format and create formatted tags array
    const formattedTags = parsedTags.map((tagObj) => {
      if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
        return res.status(400).json({ error: "Each tag must be a valid string inside an object." });
      }
      return { tag: tagObj.tag.trim() };
    });

    // Replace all existing tags with the new ones (consistent with createBlog behavior)
    blog.tags = formattedTags;
  }

  // Update fields with new values or retain previous values
  if (title !== undefined) blog.title = title;
  if (description !== undefined) blog.description = description;
  if (metaDescription !== undefined) blog.metaDescription = metaDescription;
  if (category !== undefined) blog.category = category;
  if (seoTitle !== undefined) blog.seo.title = String(seoTitle || "").trim();
  if (canonicalUrl !== undefined) blog.seo.canonicalUrl = String(canonicalUrl || "").trim();
  if (keywords !== undefined) blog.seo.keywords = parseJsonArray(keywords).map((keyword) => String(keyword).trim()).filter(Boolean);
  if (ogImage !== undefined) blog.seo.ogImage = String(ogImage || "").trim();
  if (relatedPosts !== undefined) blog.relatedPosts = parseJsonArray(relatedPosts).filter(Boolean);

  // Validate fields against schema constraints
  if (blog.title.length > 250) {
    return res.status(400).json({ error: "Title cannot exceed 250 characters." });
  }
  if (blog.metaDescription && blog.metaDescription.length > 160) {
    return res.status(400).json({ error: "Meta description cannot exceed 160 characters." });
  }

  // Mark fields as modified to ensure Mongoose detects changes
  blog.markModified("title");
  blog.markModified("description");
  blog.markModified("metaDescription");
  blog.markModified("category");
  blog.markModified("tags");
  blog.markModified("cover");
  blog.markModified("slug");
  blog.markModified("seo");
  blog.markModified("relatedPosts");

  // Save the updated blog
  const updatedBlog = await blog.save();
  res.json({ message: "Blog post updated successfully", data: updatedBlog });
});

module.exports = {
  createBlog,
  getAllBlog,
  getBlog,
  getBlogPrivate,
  deleteBlog,
  updateBlog,
  updateFeaturedStatus,
  updateVisibility,
  getBlogsByCategoryAndTag,
  subscribeNewsletter,
  submitHelpfulFeedback,
  trackBlogShare,
  submitBlogIssue,
  trackReadingHistory,
  getBlogEngagementAnalytics,
  getNewsletterSubscribers,
  getBlogReports,
  updateBlogReportStatus,
  getMyBlogReadingHistory,
};

const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const Filter = require("bad-words");
const slugify = require("slugify");
const BlogModel = require("../models/BlogModel");
const { default: ImageModel } = require("../models/ImageModel");
const CategoryModel = require("../models/common/CategoryModel");
const { updateResourceField } = require("../utils/updateResourceField");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, tags, category, metaDescription, visibility, groupId } = req.body;
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
  const Blog = await BlogModel.findOne({ slug }).populate({
    path: "user",
    select: "avatar name email",
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
    });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found. Please check the provided slug.");
  }

  // Check if the logged-in user is the creator or an admin
  if (blog.user.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin" && loggedInUser.role !== "super admin") {
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

// from here to do
const updateBlog = asyncHandler(async (req, res) => {
  // Normalize req.body keys by trimming whitespace
  const normalizedBody = {};
  for (const key in req.body) {
    normalizedBody[key.trim()] = req.body[key];
  }
  const { title, description, tags, category, metaDescription } = normalizedBody;
  const blogSlug = req.params.slug;
  const userId = req.user.id;

  // Find the existing blog post
  const blog = await BlogModel.findOne({ slug: blogSlug });
  if (!blog) {
    return res.status(404).json({ error: "Blog post not found." });
  }

  // Check authorization (user is the creator or admin)
  if (blog.user.toString() !== userId && req.user.role !== "admin") {
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
};

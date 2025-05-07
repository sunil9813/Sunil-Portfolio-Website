const asyncHandler = require("express-async-handler");
const ProjectModel = require("../../models/project/ProjectModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const AssetLimitConfigModel = require("../../models/project/AssetLimitConfigModel");
const Filter = require("bad-words");
const { updateResourceField } = require("../../utils/updateResourceField");
const { default: ImageModel } = require("../../models/ImageModel");

const createProject = asyncHandler(async (req, res) => {
  const { title, description, metaDescription, category, layout, urllink, tags, visibility, groupId, formats, price, discount, discountDate, highlights, resourceFile } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [title, description, category, metaDescription];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words, and your feedback cannot be posted due to content guidelines.",
      });
    }
  }

  // Required fields
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (!category) {
    return res.status(400).json({ error: "Category is required." });
  }

  // Handle thumbnail image
  let thumbnailData = {};
  if (req.files && req.files["thumbnail"] && req.files["thumbnail"][0]) {
    const thumbnailFile = req.files["thumbnail"][0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
      return res.status(400).json({ error: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG." });
    }
    if (thumbnailFile.size > 10 * 1024 * 1024) {
      // Updated to 10MB to match multer
      return res.status(400).json({ error: "Thumbnail size should not exceed 10 MB." });
    }
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project/Thumbnails", resource_type: "image" }, (error, result) => {
          if (error) return reject(new Error("Thumbnail upload failed."));
          thumbnailData = {
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(thumbnailFile.buffer);
      });
    } catch (error) {
      res.status(500);
      throw new Error("Thumbnail could not be uploaded.");
    }
  } else {
    return res.status(400).json({ error: "Thumbnail is required." });
  }

  // Handle slug
  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  let slug = originalSlug;
  let suffix = 1;
  while (await ProjectModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Check asset limit
  const assetLimitConfig = await AssetLimitConfigModel.findOne();
  if (!assetLimitConfig) {
    return res.status(500).json({ message: "Asset limit configuration not found" });
  }
  if (req.files && req.files["assets"] && req.files["assets"].length > assetLimitConfig.assetLimit) {
    return res.status(400).json({ message: `You can only upload ${assetLimitConfig.assetLimit} images.` });
  }

  // Handle assets
  let fileData = [];
  if (req.files && req.files["assets"] && req.files["assets"].length > 0) {
    for (const file of req.files["assets"]) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedImageTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: `Invalid asset format for ${file.originalname}. Supported formats: JPEG, PNG, JPG.` });
      }
      if (file.size > 10 * 1024 * 1024) {
        // Updated to 10MB to match multer
        return res.status(400).json({ error: `Asset ${file.originalname} size should not exceed 10 MB.` });
      }
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project", resource_type: "image" }, (error, result) => {
            if (error) return reject(new Error("Asset upload failed."));
            fileData.push({
              fileName: file.originalname,
              filePath: result.secure_url,
              fileType: file.mimetype,
              publicId: result.public_id,
            });
            resolve();
          });
          uploadStream.end(file.buffer);
        });
      } catch (error) {
        res.status(500);
        throw new Error("One or more images could not be uploaded.");
      }
    }
  }

  // Handle resourceFile
  let resourceFileData = {};
  if (resourceFile) {
    let parsedResourceFile;
    if (typeof resourceFile === "string") {
      try {
        parsedResourceFile = JSON.parse(resourceFile); // Expecting { type: "url", url: "..." } or { type: "file" }
      } catch (error) {
        return res.status(400).json({ error: "Invalid resourceFile format. Must be a valid JSON object." });
      }
    } else {
      parsedResourceFile = resourceFile;
    }
    if (!["url", "file"].includes(parsedResourceFile.type)) {
      return res.status(400).json({ error: "Invalid resourceFile type. Must be 'url' or 'file'." });
    }
    if (parsedResourceFile.type === "url") {
      if (!parsedResourceFile.url || typeof parsedResourceFile.url !== "string") {
        return res.status(400).json({ error: "Resource file URL is required and must be a string." });
      }
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
      if (!urlRegex.test(parsedResourceFile.url)) {
        return res.status(400).json({ error: "Invalid resource file URL format." });
      }
      resourceFileData = { type: "url", url: parsedResourceFile.url };
    } else if (parsedResourceFile.type === "file") {
      if (!req.files || !req.files["resourceFileUpload"] || !req.files["resourceFileUpload"][0]) {
        return res.status(400).json({ error: "Resource file upload is required for type 'file'." });
      }
      const resourceFileUpload = req.files["resourceFileUpload"][0];
      if (resourceFileUpload.size > 100 * 1024 * 1024) {
        return res.status(400).json({ error: "Resource file size should not exceed 100 MB." });
      }
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project/Resources", resource_type: "auto" }, (error, result) => {
            if (error) return reject(new Error("Resource file upload failed."));
            resourceFileData = {
              type: "file",
              file: {
                path: result.secure_url,
                originalName: resourceFileUpload.originalname,
                size: resourceFileUpload.size,
                mimeType: resourceFileUpload.mimetype,
              },
            };
            resolve();
          });
          uploadStream.end(resourceFileUpload.buffer);
        });
      } catch (error) {
        res.status(500);
        throw new Error("Resource file could not be uploaded.");
      }
    }
  }

  // Handle tags
  let tagsArray = [];
  if (tags) {
    let parsedTags = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags); // Expecting [{ tag: 'css' }, { tag: 'js' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid tags format. Tags must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      return res.status(400).json({ error: "Tags must be an array of objects." });
    }
    try {
      tagsArray = parsedTags.map((tagObj) => {
        if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
          throw new Error("Each tag must be a valid non-empty string inside an object.");
        }
        if (tagObj.tag.length > 50) {
          throw new Error("Each tag cannot exceed 50 characters.");
        }
        return { tag: tagObj.tag.trim() };
      });
      // Check for duplicates
      const tagValues = tagsArray.map((t) => t.tag);
      if (new Set(tagValues).size !== tagValues.length) {
        throw new Error("Duplicate tags are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle formats
  let formatsArray = [];
  if (formats) {
    let parsedFormats = [];
    if (typeof formats === "string") {
      try {
        parsedFormats = JSON.parse(formats); // Expecting [{ format: 'html' }, { format: 'json' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid formats format. Formats must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(formats)) {
      parsedFormats = formats;
    } else {
      return res.status(400).json({ error: "Formats must be an array of objects." });
    }
    try {
      formatsArray = parsedFormats.map((formatObj) => {
        if (typeof formatObj.format !== "string" || formatObj.format.trim() === "") {
          throw new Error("Each format must be a valid non-empty string inside an object.");
        }
        if (formatObj.format.length > 50) {
          throw new Error("Each format cannot exceed 50 characters.");
        }
        return { format: formatObj.format.trim() };
      });
      // Check for duplicates
      const formatValues = formatsArray.map((f) => f.format);
      if (new Set(formatValues).size !== formatValues.length) {
        throw new Error("Duplicate formats are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle highlights
  let highlightsArray = [];
  if (highlights) {
    let parsedHighlights = [];
    if (typeof highlights === "string") {
      try {
        parsedHighlights = JSON.parse(highlights); // Expecting [{ highlight: 'feature1' }, { highlight: 'feature2' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid highlights format. Highlights must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(highlights)) {
      parsedHighlights = highlights;
    } else {
      return res.status(400).json({ error: "Highlights must be an array of objects." });
    }
    try {
      highlightsArray = parsedHighlights.map((highlightObj) => {
        if (typeof highlightObj.highlight !== "string" || highlightObj.highlight.trim() === "") {
          throw new Error("Each highlight must be a valid non-empty string inside an object.");
        }
        if (highlightObj.highlight.length > 100) {
          throw new Error("Each highlight cannot exceed 100 characters.");
        }
        return { highlight: highlightObj.highlight.trim() };
      });
      // Check for duplicates
      const highlightValues = highlightsArray.map((h) => h.highlight);
      if (new Set(highlightValues).size !== highlightValues.length) {
        throw new Error("Duplicate highlights are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle price and discount
  let finalPrice = price ? parseFloat(price) : 0;
  let finalDiscount = discount ? parseFloat(discount) : 0;
  let finalDiscountDate = discountDate ? new Date(discountDate) : null;
  let finalDiscountShow = false;

  if (finalDiscount > 0) {
    if (!discountDate) {
      return res.status(400).json({ error: "Discount date is required when a discount is provided." });
    }
    if (isNaN(finalDiscountDate) || finalDiscountDate <= new Date()) {
      return res.status(400).json({ error: "Discount date must be a valid future date." });
    }
    if (finalDiscount >= finalPrice) {
      return res.status(400).json({ error: "Discount cannot be greater than or equal to the price." });
    }
    finalDiscountShow = true;
  } else {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Check if discountDate is in the past
  if (finalDiscountDate && finalDiscountDate <= new Date()) {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Create project
  const data = await ProjectModel.create({
    user: userId,
    title,
    slug,
    description,
    metaDescription,
    category,
    visibility,
    layout,
    urllink,
    groupId,
    price: finalPrice,
    discount: finalDiscount,
    discountDate: finalDiscountDate,
    discountShow: finalDiscountShow,
    assets: fileData,
    tags: tagsArray,
    formats: formatsArray,
    highlights: highlightsArray,
    thumbnail: thumbnailData,
    resourceFile: resourceFileData,
  });

  console.log("====================================");
  console.log(data);
  console.log("====================================");

  res.status(201).json({ message: "Project created successfully", data });
});

const getallProjectofUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await ProjectModel.find({ user: userId })
      .populate("user")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .populate("category");
    res.status(200).json({ total: posts.length, posts });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching user's posts." });
  }
});

const getProjectPrivate = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Project slug is required in the request.");
  }

  // Get the logged-in user from the request (assuming JWT authentication)
  const loggedInUser = req.user;

  // Find the project by slug and populate related fields
  const project = await ProjectModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "type title",
    });

  if (!project) {
    res.status(404);
    throw new Error("Project not found. Please check the provided slug.");
  }

  // Check if the logged-in user is the creator or an admin
  if (project.user.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin" && loggedInUser.role !== "super admin") {
    res.status(403);
    throw new Error("You are not authorized to access this project.");
  }

  // Extract image URLs from the project description (assuming HTML content)
  const usedImageUrls = [];
  const descriptionHtml = project.description || "";
  const imgTagRegex = /<img[^>]+src=["'](.*?)["']/gi;
  let match;
  while ((match = imgTagRegex.exec(descriptionHtml)) !== null) {
    usedImageUrls.push(match[1]); // match[1] is the src value
  }

  // Fetch all images related to the project by groupId (for unused images)
  const allImagesForBlog = await ImageModel.find({ groupId: project.groupId }).select("filePath fileName fileType publicId folder createdAt");

  // Fetch used images by filePath, regardless of groupId
  const usedImages = await ImageModel.find({ filePath: { $in: usedImageUrls } }).select("filePath fileName fileType publicId folder createdAt groupId");

  // Filter unused images: images with this blog's groupId but not in the description
  const unusedImages = allImagesForBlog.filter((image) => !usedImageUrls.includes(image.filePath));

  // Combine blog data with used and unused images
  const projectWithImages = {
    ...project.toObject(), // Convert Mongoose document to plain JS object
    usedImages: usedImages || [], // Images actually used in description, regardless of groupId
    unusedImages: unusedImages || [], // Images uploaded for this blog but not used
  };

  res.status(200).json(projectWithImages);
});

// remove it
const getallProject = asyncHandler(async (req, res) => {
  const posts = await ProjectModel.find({})
    .populate("user")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "likes",
      select: "avatar name email",
    })
    .populate("category")
    .sort("-createdAt");
  res.status(201).json({ total: posts.length, posts });
});

// with pagination
const getallProjects = asyncHandler(async (req, res) => {
  let filter = {};

  // Check if there's a category filter in the query parameters
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Check if there's a title search in the query parameters
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: "i" };
  }

  // Pagination configuration
  const perPage = 5; // Number of posts per page
  const page = parseInt(req.query.page) || 1; // Current page number

  const totalPosts = await ProjectModel.countDocuments(filter);
  const totalPages = Math.ceil(totalPosts / perPage);

  const skip = (page - 1) * perPage;

  const posts = await ProjectModel.find(filter).skip(skip).limit(perPage);

  res.status(200).json({
    totalPosts,
    totalPages,
    currentPage: page,
    posts,
  });
});

const getProject = asyncHandler(async (req, res) => {
  const post = await ProjectModel.findOne({ slug: req.params.slug })
    .populate("user")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate("category");
  if (!post) {
    res.status(404);
    throw new Error("Posts not found");
  }
  post.numOfViews += 1;
  await post.save();

  res.status(200).json(post);
});

const deleteProject = asyncHandler(async (req, res) => {
  let postId;

  // Retrieve post ID from body or params
  if (req.body && req.body.id) {
    postId = req.body.id;
  } else if (req.params && req.params.id) {
    postId = req.params.id;
  }

  if (!postId) {
    res.status(400);
    throw new Error("Project ID is required in the request.");
  }

  // Find the project
  const project = await ProjectModel.findOne({ _id: postId });
  if (!project) {
    res.status(404);
    throw new Error("Project not found. Please check the provided information.");
  }

  // Check authorization
  if (project.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to delete this project.");
  }

  // Delete thumbnail from Cloudinary if it exists
  if (project.thumbnail && project.thumbnail.publicId) {
    try {
      // console.log(`Attempting to delete thumbnail from Cloudinary with publicId: ${project.thumbnail.publicId}`);
      const result = await cloudinary.uploader.destroy(project.thumbnail.publicId);
      if (result.result !== "ok") {
        // console.error(`Failed to delete thumbnail ${project.thumbnail.publicId} from Cloudinary: ${JSON.stringify(result)}`);
        res.status(500).json({ message: "Error deleting thumbnail from Cloudinary" });
        return;
      }
      //console.log(`Successfully deleted thumbnail ${project.thumbnail.publicId} from Cloudinary`);
    } catch (error) {
      // console.error(`Error deleting thumbnail from Cloudinary: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting the thumbnail from Cloudinary." });
      return;
    }
  }

  // Delete assets from Cloudinary
  const imagePublicIds = project.assets.map((asset) => asset.publicId).filter(Boolean);
  if (imagePublicIds.length > 0) {
    try {
      for (const publicId of imagePublicIds) {
        //console.log(`Attempting to delete asset from Cloudinary with publicId: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== "ok") {
          res.status(500).json({ message: "Error deleting asset from Cloudinary" });
          return;
          // console.error(`Failed to delete asset ${publicId} from Cloudinary: ${JSON.stringify(result)}`);
          // Continue with other deletions
        }
      }
    } catch (error) {
      //console.error(`Error deleting assets from Cloudinary: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting project assets from Cloudinary." });
      return;
    }
  }

  // Delete the project from MongoDB
  await project.deleteOne();
  res.status(200).json({ message: "Project and associated images deleted successfully" });
});

const updateProject = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { title, description, updatedAssets } = req.body;

  try {
    const post = await ProjectModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the user is the owner of the post and admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this post." });
    }

    // Update post fields
    post.title = title || post.title;
    post.description = description || post.description;
    const originalSlug = slugify(post.title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      strict: true,
    });

    let slug = originalSlug;
    let suffix = 1;

    while (await ProjectModel.findOne({ slug })) {
      slug = `${suffix}-${originalSlug}`;
      suffix++;
    }

    post.slug = slug;

    // Handle image updates
    if (updatedAssets && updatedAssets.length > 0) {
      const assetLimitConfig = await AssetLimitConfigModel.findOne();

      if (!assetLimitConfig) {
        return res.status(500).json({ message: "Asset limit configuration not found." });
      }

      // Check if the number of updated assets exceeds the asset limit
      if (updatedAssets.length > assetLimitConfig.assetLimit) {
        return res.status(400).json({ message: `You can only update ${assetLimitConfig.assetLimit} assets.` });
      }

      // Delete the previous images from Cloudinary for the specified updatedAssets
      for (const updatedAssetIndex of updatedAssets) {
        if (post.assets[updatedAssetIndex]) {
          await cloudinary.uploader.destroy(post.assets[updatedAssetIndex].publicId);
          // Remove the asset from the post's assets array
          post.assets.splice(updatedAssetIndex, 1);
        }
      }

      // Upload new images to Cloudinary
      const fileData = [];

      for (const file of req.files) {
        try {
          const uploadedFile = await cloudinary.uploader.upload(file.path, {
            folder: "Photo Idol/Posts",
            resource_type: "image",
          });

          fileData.push({
            fileName: file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: file.mimetype,
            publicId: uploadedFile.public_id,
          });
        } catch (error) {
          return res.status(500).json({ message: "One or more images could not be uploaded." });
        }
      }

      // Add the new assets to the post's assets array
      for (const updatedAssetIndex of updatedAssets) {
        post.assets.splice(updatedAssetIndex, 0, fileData.shift());
      }
    }

    // Save the updated post
    await post.save();

    res.status(200).json({ message: "Post updated successfully", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the post." });
  }
});

const updateProjectFeaturedStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { featured } = req.body;

  try {
    const updatedProject = await updateResourceField({
      resourceId: projectId,
      fieldName: "featured",
      fieldValue: featured,
      validateField: (value) => {
        if (typeof value !== "boolean") {
          return "The 'featured' field must be a boolean.";
        }
        return null;
      },
      Model: ProjectModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Project",
    });

    res.status(200).json({
      message: "Project featured status updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

const updateProjectVisibility = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { visibility } = req.body;

  try {
    const updatedProject = await updateResourceField({
      resourceId: projectId,
      fieldName: "visibility",
      fieldValue: visibility,
      validateField: (value) => {
        if (!["public", "private"].includes(value)) {
          return "Visibility must be either 'public' or 'private'.";
        }
        return null;
      },
      Model: ProjectModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Project",
    });

    res.status(200).json({
      message: "Project visibility updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

module.exports = {
  createProject,
  getallProjectofUser,
  getallProject,
  getallProjects,
  getProject,
  deleteProject,
  updateProject,
  updateProjectFeaturedStatus,
  updateProjectVisibility,
  getProjectPrivate,
};

const asyncHandler = require("express-async-handler");
const PostsModel = require("../../models/posts/PostsModel");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const AssetLimitConfigModel = require("../../models/posts/AssetLimitConfigModel");
const Filter = require("bad-words");

const createPosts = asyncHandler(async (req, res) => {
  const { title, description, category, visibility, layout, addTofeature, tagsToAdd } = req.body;
  const userId = req.user.id;

  const filter = new Filter();
  const fieldsToCheck = [title, description, category, addTofeature, tagsToAdd];
  for (const field of fieldsToCheck) {
    if (filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words, and your feedback cannot be posted due to content guidelines.",
      });
    }
  }

  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await PostsModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  const assetLimitConfig = await AssetLimitConfigModel.findOne();
  if (!assetLimitConfig) {
    return res.status(500).json({ message: "Asset limit configuration not found" });
  }

  // Check if the user is allowed to upload this number of images
  if (req.files && req.files.length > assetLimitConfig.assetLimit) {
    res.status(400).json({ message: `You can only upload ${assetLimitConfig.assetLimit} images.` });
    return;
  }

  let fileData = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      try {
        const uploadedFile = await cloudinary.uploader.upload(file.path, {
          folder: "Sunil Portfolio/Project",
          resource_type: "image",
        });

        fileData.push({
          fileName: file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: file.mimetype,
          publicId: uploadedFile.public_id,
        });
      } catch (error) {
        res.status(500);
        throw new Error("One or more images could not be uploaded.");
      }
    }
  }

  let tags = [];
  if (tagsToAdd && Array.isArray(tagsToAdd)) {
    tags = tagsToAdd.map((tag) => ({ tag }));
  }
  let features = [];
  if (addTofeature && Array.isArray(addTofeature)) {
    features = addTofeature.map((feature) => ({ feature }));
  }

  const data = await PostsModel.create({
    user: userId,
    title,
    slug: slug,
    description,
    category,
    visibility,
    layout,
    assets: fileData,
    tags: tags,
    features: features,
  });
  res.status(201).json({ message: "Posts created successfully", data });
});

const getallPostofUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await PostsModel.find({ user: userId })
      .populate("user")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .populate("category");
    res.status(200).json({ total: posts.length, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching user's posts." });
  }
});

const getallPost = asyncHandler(async (req, res) => {
  const posts = await PostsModel.find({})
    .populate("user")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "likes",
      select: "avatar name email",
    })
    .populate("category");
  res.status(201).json({ total: posts.length, posts });
});

const getallPosts = asyncHandler(async (req, res) => {
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

  const totalPosts = await PostsModel.countDocuments(filter);
  const totalPages = Math.ceil(totalPosts / perPage);

  const skip = (page - 1) * perPage;

  const posts = await PostsModel.find(filter).skip(skip).limit(perPage);

  res.status(200).json({
    totalPosts,
    totalPages,
    currentPage: page,
    posts,
  });
});

const getPost = asyncHandler(async (req, res) => {
  const post = await PostsModel.findOne({ slug: req.params.slug })
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

const deletePosts = asyncHandler(async (req, res) => {
  let postId;

  if (req.body && req.body.id) {
    postId = req.body.id;
  } else if (req.params && req.params.id) {
    postId = req.params.id;
  }

  if (!postId) {
    res.status(400);
    throw new Error("Post not found. Please ensure you've provided the correct post ID information.");
  }
  const post = await PostsModel.findOne({ _id: postId });
  if (!post) {
    res.status(404);
    throw new Error("Post not found. Please ensure you've provided the correct post information.");
  }

  if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to delete this post.");
  }

  // Delete the cover from Cloudinary
  const imagePublicIds = post.assets.map((asset) => asset.publicId);

  for (const publicId of imagePublicIds) {
    await cloudinary.uploader.destroy(publicId);
  }

  await post.deleteOne();
  res.status(200).json({ message: "The post has been successfully deleted." });
});

const updatePosts = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { title, description, updatedAssets } = req.body;

  try {
    const post = await PostsModel.findById(postId);

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

    while (await PostsModel.findOne({ slug })) {
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

module.exports = { createPosts, getallPostofUser, getallPosts, getallPost, getPost, deletePosts, updatePosts };

const asyncHandler = require("express-async-handler");
const CoursesModel = require("../../models/notes/CoursesModel");
const PostsModel = require("../../models/posts/PostsModel");
const { ChapterModel } = require("../../models/notes/AcademicComponentsModel");
const BlogModel = require("../../models/BlogModel");

const updateTags = async (req, res, Model) => {
  try {
    const entityId = req.params.id;
    const { tagsToAdd } = req.body;

    const entity = await Model.findById(entityId);
    if (!entity) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }

    // Function to check for duplicate tags by tag name within the same entity
    const checkForDuplicateTags = (existingTags, newTags) => {
      const existingTagNames = new Set(existingTags.map((tag) => tag.tag));
      const duplicates = newTags.filter((tag) => existingTagNames.has(tag.tag));
      return duplicates;
    };

    // Check if tagsToAdd is an array of tag objects
    if (!Array.isArray(tagsToAdd) || tagsToAdd.length === 0) {
      return res.status(400).json({ error: "Invalid tagsToAdd array" });
    }

    // Check for duplicates by name within the same entity before adding tags
    const duplicateTagsWithinEntity = checkForDuplicateTags(entity.tags, tagsToAdd);
    console.log(duplicateTagsWithinEntity);
    if (duplicateTagsWithinEntity.length > 0) {
      return res.status(400).json({ error: "Duplicate tags found within the entity: " + duplicateTagsWithinEntity.map((tag) => tag.tag).join(", ") });
    }

    // Calculate the total character length of existing tags
    const existingTagsLength = entity.tags.reduce((acc, tag) => acc + tag.tag.length, 0);

    // Calculate the total character length of the new tags to be added
    const newTagsLength = tagsToAdd.reduce((acc, tag) => acc + tag.tag.length, 0);

    // Calculate the total character length of the tags after the update
    const totalTagsLength = existingTagsLength + newTagsLength;

    // Check if the total character length exceeds 250
    if (totalTagsLength > 250) {
      return res.status(400).json({ error: "Total tag length should not exceed 250 characters." });
    }

    // Add new tags to the entity
    entity.tags = [...entity.tags, ...tagsToAdd];

    // Save the entity with updated tags
    await entity.save();

    // Store the total character length and the current new tags in the database
    entity.totalTagsLength = totalTagsLength;
    entity.newTags = tagsToAdd;
    await entity.save();

    return res.status(200).json({ message: `Tags added to ${Model.modelName} successfully`, entity });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Handle duplicate key error (E11000) here
      return res.status(400).json({ error: "Duplicate tags found in the request." });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteTags = async (req, res, Model) => {
  try {
    const entityId = req.params.id;
    const { tagsToDelete } = req.body;

    const entity = await Model.findById(entityId);
    if (!entity) {
      return res.status(404).json({ error: `${Model.modelName} not found` });
    }

    // Function to remove specified tags by name
    const removeTagsByName = (existingTags, tagsToDelete) => {
      return existingTags.filter((tag) => !tagsToDelete.includes(tag.tag));
    };

    // Check if tagsToDelete is an array of tag names
    if (!Array.isArray(tagsToDelete) || tagsToDelete.length === 0) {
      return res.status(400).json({ error: "Invalid tagsToDelete array" });
    }

    // Remove specified tags by name from the entity's tags array
    entity.tags = removeTagsByName(entity.tags, tagsToDelete);

    // Save the entity with updated tags
    await entity.save();

    return res.status(200).json({ message: `Tags deleted from ${Model.modelName} successfully`, entity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getItemsByTag = async (req, res, model) => {
  const { tag } = req.params;

  try {
    const items = await model.find({ "tags.tag": tag }).exec();

    if (!items || items.length === 0) {
      return res.status(404).json({ message: `No items found with the specified tag for ${model.modelName}` });
    }

    res.status(200).json({ totalItems: items.length, ItemList: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `An error occurred while fetching items by tag for ${model.modelName}` });
  }
};

const getRelatedPostByTags = async (req, res, model) => {
  const { id } = req.params;

  try {
    // Find the specific blog post by its ID
    const blog = await model.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Extract tags from the specific blog post
    const tags = blog.tags.map((tag) => tag.tag);

    // Find the 5 most matching blog posts that have at least one of the tags from the specific blog
    const relatedBlogs = await BlogModel.find({ "tags.tag": { $in: tags }, _id: { $ne: id } })
      .limit(5)
      .exec();

    res.status(200).json({ message: "Related blog posts by tags", BlogList: relatedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching related blog posts" });
  }
};

// To Update tags
exports.updatePostTags = asyncHandler(async (req, res) => {
  await updateTags(req, res, PostsModel);
});
exports.updateCourseTags = asyncHandler(async (req, res) => {
  await updateTags(req, res, CoursesModel);
});
exports.updateChapterTags = asyncHandler(async (req, res) => {
  await updateTags(req, res, ChapterModel);
});
exports.updateBlogTags = asyncHandler(async (req, res) => {
  await updateTags(req, res, BlogModel);
});

// To Delete tags
exports.DeletePostTags = asyncHandler(async (req, res) => {
  await deleteTags(req, res, PostsModel);
});
exports.DeleteCourseTags = asyncHandler(async (req, res) => {
  await deleteTags(req, res, CoursesModel);
});
exports.DeleteChapterTags = asyncHandler(async (req, res) => {
  await deleteTags(req, res, ChapterModel);
});
exports.DeleteBlogTags = asyncHandler(async (req, res) => {
  await deleteTags(req, res, BlogModel);
});

//  Get Post by tags
exports.getItemsByTagOfPosts = asyncHandler(async (req, res) => {
  await getItemsByTag(req, res, PostsModel);
});
exports.getItemsByTagOfCourses = asyncHandler(async (req, res) => {
  await getItemsByTag(req, res, CoursesModel);
});
exports.getItemsByTagOfChapter = asyncHandler(async (req, res) => {
  await getItemsByTag(req, res, ChapterModel);
});
exports.getItemsByTagOfBlog = asyncHandler(async (req, res) => {
  await getItemsByTag(req, res, BlogModel);
});

//  Get Post mosts match tags
exports.getPostsofMostMatchTagsPost = asyncHandler(async (req, res) => {
  await getRelatedPostByTags(req, res, PostsModel);
});
exports.getPostsofMostMatchTagsCourses = asyncHandler(async (req, res) => {
  await getRelatedPostByTags(req, res, CoursesModel);
});
exports.getPostsofMostMatchTagsChapter = asyncHandler(async (req, res) => {
  await getRelatedPostByTags(req, res, ChapterModel);
});
exports.getPostsofMostMatchTagsBlog = asyncHandler(async (req, res) => {
  await getRelatedPostByTags(req, res, BlogModel);
});

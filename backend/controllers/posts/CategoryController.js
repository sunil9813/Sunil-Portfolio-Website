const asyncHandler = require("express-async-handler");
const CategoryModel = require("../../models/posts/CategoryModel");
const cloudinary = require("cloudinary").v2;

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const isTitleExits = await CategoryModel.findOne({ title });
  if (isTitleExits) {
    res.status(400);
    throw new Error("Category with the same title already exists.");
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Category",
        resource_type: "image",
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
  }

  const categoryData = await CategoryModel.create({
    user: req.user._id,
    title: title,
    cover: fileData,
  });
  res.status(201).json({
    message: "Category created successfully.",
    category: categoryData,
  });
});

const getAllCategory = asyncHandler(async (req, res) => {
  const categorys = await CategoryModel.find().sort("-createdAt").populate({
    path: "user",
    select: "avatar name email",
  });

  if (!categorys) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json({ total: categorys?.length, categoryList: categorys });
});

const getCategory = asyncHandler(async (req, res) => {
  let categoryId;

  if (req.body && req.body.id) {
    categoryId = req.body.id;
  } else if (req.params && req.params.id) {
    categoryId = req.params.id;
  }

  if (!categoryId) {
    res.status(400);
    throw new Error("Category ID is required in the request.");
  }

  const category = await CategoryModel.findOne({ _id: categoryId }).populate("user");

  if (!category) {
    res.status(404);
    throw new Error("Category not found. Please check the provided information.");
  }

  res.status(200).json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
  let categoryId;

  if (req.body && req.body.id) {
    categoryId = req.body.id;
  } else if (req.params && req.params.id) {
    categoryId = req.params.id;
  }

  if (!categoryId) {
    res.status(400);
    throw new Error("Category ID is required in the request.");
  }
  const category = await CategoryModel.findOne({ _id: categoryId });

  if (!category) {
    res.status(404);
    throw new Error("Category not found. Please check the provided information.");
  }

  if (category.cover && category.cover.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(category.cover.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting cover from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the cover image from Cloudinary." });
      return;
    }
  }

  await category.deleteOne();
  res.status(200).json({ message: "Category deleted successfully" });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.id;

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Category",
        resource_type: "image",
      });
    } catch (error) {
      return res.status(500).json({ message: "Image could not be uploaded." });
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      publicId: uploadedFile.public_id,
    };
  }

  try {
    const categoryToUpdate = await CategoryModel.findById(id);

    if (!categoryToUpdate) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Create an object to store the updated fields
    const updatedFields = {
      user: userId,
      ...(title && { title }),
    };

    // Check if a new cover image is provided
    if (fileData) {
      // Delete the previous cover image if it exists
      if (categoryToUpdate.cover && categoryToUpdate.cover.publicId) {
        try {
          await cloudinary.uploader.destroy(categoryToUpdate.cover.publicId);
        } catch (error) {
          return res.status(500).json({ message: "Error deleting previous cover from Cloudinary." });
        }
      }
      // Update the cover image
      updatedFields.cover = fileData;
    } else if (!fileData && categoryToUpdate.cover) {
      // Keep the previous cover image if no new file is provided
      updatedFields.cover = categoryToUpdate.cover;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedCategory) {
      res.status(404).json({ message: "Category not found." });
      return;
    }

    res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the Category." });
  }
});

module.exports = {
  createCategory,
  getAllCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};

const asyncHandler = require("express-async-handler");
const { HomeSlider, HomeFeature, ContactInfo } = require("../../models/settings/SettingModel");
const { isValidObjectId } = require("mongoose");
const PostsModel = require("../../models/posts/PostsModel");
const cloudinary = require("cloudinary").v2;

const createHomeSlider = asyncHandler(async (req, res) => {
  const { title, subtitle, description, category } = req.body;

  const isTitleExists = await HomeSlider.findOne({ title, category });
  if (isTitleExists) {
    res.status(400);
    throw new Error("A home content feature with the same title and category already exists.");
  }

  const totalDocumentsWithCategory = await HomeSlider.countDocuments({ category });
  if (totalDocumentsWithCategory >= 6) {
    res.status(400);
    throw new Error("There are already 6 or more content with the same category.");
  }

  if (!req.file) {
    return res.status(400).json({ error: "Cover image is required" });
  }

  const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!acceptedImageTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Cover image must be in PNG, JPEG, or JPG format" });
  }

  let fileData = {};

  if (req.file) {
    try {
      // Check if the category is "Creatives" and the image size is 550x550
      if (category === "Creatives") {
        const imageDimensions = await getImageDimensions(req.file.path);

        if (imageDimensions.width > 550 || imageDimensions.height > 550) {
          return res.status(400).json({ error: "Image dimensions must not exceed 550x550 pixels" });
        }
      }

      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Photo Idol/Settings/Home Slider",
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

  const homeSliderData = await HomeSlider.create({
    user: req.user._id,
    title: title,
    subtitle: subtitle,
    description: description,
    category: category,
    cover: fileData,
  });
  res.status(201).json({
    message: "Home Slider created successfully.",
    homeSlider: homeSliderData,
  });
});

const getImageDimensions = (filePath) => {
  const sizeOf = require("image-size");
  return new Promise((resolve, reject) => {
    sizeOf(filePath, (error, dimensions) => {
      if (error) {
        reject(error);
      } else {
        resolve(dimensions);
      }
    });
  });
};

const gethomeSlider = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const homeSliders = await HomeSlider.findById(id);

  if (!homeSliders) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json(homeSliders);
});

const getAllhomeSlider = asyncHandler(async (req, res) => {
  const homeSliders = await HomeSlider.find().sort("createdAt").populate({
    path: "user",
    select: "avatar name email",
  });

  if (!homeSliders) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json(homeSliders);
});

const deletehomeSlider = asyncHandler(async (req, res) => {
  let homeSliderId;

  if (req.body && req.body.id) {
    homeSliderId = req.body.id;
  } else if (req.params && req.params.id) {
    homeSliderId = req.params.id;
  }

  if (!homeSliderId) {
    res.status(400);
    throw new Error("Home Slider ID is required in the request.");
  }
  const homeSlider = await HomeSlider.findOne({ _id: homeSliderId });

  if (!homeSlider) {
    res.status(404);
    throw new Error("Home Slider not found. Please check the provided information.");
  }

  if (homeSlider.cover && homeSlider.cover.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(homeSlider.cover.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting cover from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the cover image from Cloudinary." });
      return;
    }
  }

  await homeSlider.deleteOne();
  res.status(200).json({ message: "Home Slider deleted successfully" });
});

const updatehomeSlider = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description } = req.body;
  const userId = req.user.id;
  console.log(id);
  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Photo Idol/Settings/Home Slider",
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
    const homeSliderToUpdate = await HomeSlider.findById(id);

    if (!homeSliderToUpdate) {
      return res.status(404).json({ message: "Home Slider not found." });
    }

    if (homeSliderToUpdate.cover && homeSliderToUpdate.cover.publicId) {
      try {
        await cloudinary.uploader.destroy(homeSliderToUpdate.cover.publicId);
      } catch (error) {
        return res.status(500).json({ message: "Error deleting previous cover from Cloudinary." });
      }
    }

    const updateFields = {
      user: userId,
      ...(title && { title }),
      ...(description && { description }),
      ...(subtitle && { subtitle }),
      ...(fileData && { cover: fileData }),
    };

    const updatedHomeSlider = await HomeSlider.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedHomeSlider) {
      res.status(404).json({ message: "HomeSlider not found." });
      return;
    }

    res.status(200).json({ message: "HomeSlider updated successfully", data: updatedHomeSlider });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the HomeSlider." });
  }
});

/* ======================== Features Posts List in Home Page =============================== */
// Add or remove a post to/from the home feature
const toggleHomeFeature = asyncHandler(async (req, res) => {
  const resourceId = req.body.resourceId;
  let status = "added";

  if (!isValidObjectId(resourceId)) return res.status(422).json({ error: "Post id is invalid!" });

  const resource = await PostsModel.findById(resourceId);
  if (!resource) return res.status(404).json({ error: "Post not found!" });

  // resource is already in fav
  const alreadyExists = await HomeFeature.findOne({
    owner: req.user.id,
    items: resourceId,
  });

  if (alreadyExists) {
    // we want to remove from old lists
    await HomeFeature.updateOne(
      { owner: req.user.id },
      {
        $pull: { items: resourceId },
      }
    );

    status = "removed";
  } else {
    const feature = await HomeFeature.findOne({ owner: req.user.id });
    if (feature) {
      // trying to add new resource to the old list
      await HomeFeature.updateOne(
        { owner: req.user.id },
        {
          $addToSet: { items: resourceId },
        }
      );
    } else {
      // trying to create fresh fav list
      await HomeFeature.create({ owner: req.user.id, items: [resourceId] });
    }
  }

  res.json({ status });
});

const getFeaturesLists = asyncHandler(async (req, res) => {
  const featuresLists = await HomeFeature.find().populate({
    path: "items",
    populate: {
      path: "user",
      select: "avatar name email",
    },
  });

  if (!featuresLists || featuresLists.length === 0) {
    return res.json([]);
  }

  res.json(featuresLists);
});

/* ======================== Features Posts List in Home Page =============================== */

/* ======================== Contact Info =============================== */
// Create or update contact information
const createOrUpdateContactInfo = async (req, res) => {
  const { phone, email, address, socialMedia } = req.body;
  const owner = req.user._id;

  try {
    let contactInfo = await ContactInfo.findOne({ owner });

    if (!contactInfo) {
      // If contactInfo doesn't exist, create a new one
      contactInfo = new ContactInfo({
        owner,
        phone,
        email,
        address,
        socialMedia,
      });
    } else {
      if (phone) {
        contactInfo.phone = phone;
      }
      if (email) {
        contactInfo.email = email;
      }
      if (address) {
        contactInfo.address = address;
      }
      if (socialMedia) {
        contactInfo.socialMedia = socialMedia;
      }
    }

    await contactInfo.save();

    res.status(200).json({ message: "Contact information updated successfully", data: contactInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne({});
    if (!contactInfo) {
      return res.status(404).json({ message: "Contact information not found" });
    }
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
/* ======================== Contact Info =============================== */
module.exports = {
  createHomeSlider,
  getAllhomeSlider,
  gethomeSlider,
  deletehomeSlider,
  updatehomeSlider,
  toggleHomeFeature,
  getFeaturesLists,
  createOrUpdateContactInfo,
  getContactInfo,
};

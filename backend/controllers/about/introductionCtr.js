const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const IntroductionModel = require("../../models/about/IntroductionModel");

const createIntro = asyncHandler(async (req, res) => {
  const { name, linkToAdd, description, position, email, phone, address } = req.body;
  const userId = req.user.id;

  // Check if an introduction already exists for the user
  let existingIntro = await IntroductionModel.findOne({ user: userId });

  if (existingIntro) {
    if (req.file) {
      try {
        // Delete the previous avatar if it exists
        if (existingIntro.avatar && existingIntro.avatar.publicId) {
          await cloudinary.uploader.destroy(existingIntro.avatar.publicId);
        }

        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Sunil Portfolio/About/Introduction",
        });

        existingIntro.avatar = {
          url: uploadedFile.secure_url,
          publicId: uploadedFile.public_id,
        };
      } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }
    }

    await existingIntro.save();
    res.status(200).json({ message: "Introduction updated successfully", data: existingIntro });
  } else {
    let fileData = {};
    if (req.file) {
      try {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Sunil Portfolio/About/Introduction",
        });

        fileData = {
          url: uploadedFile.secure_url,
          publicId: uploadedFile.public_id,
        };
      } catch (error) {
        res.status(500);
        throw new Error("Image could not be uploaded");
      }
    }

    let links = [];
    if (linkToAdd && Array.isArray(linkToAdd)) {
      links = linkToAdd.map((link) => ({ link }));
    }

    const data = await IntroductionModel.create({
      user: userId,
      name,
      links: links,
      description,
      position,
      email,
      phone,
      address,
      avatar: fileData,
    });

    res.status(201).json({ message: "Introduction created successfully", data });
  }
});

const getIntro = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const introduction = await IntroductionModel.findById(id);

  if (!introduction) {
    res.status(404);
    throw new Error("Introduction not found for this user");
  }

  res.status(200).json(introduction);
});

module.exports = {
  createIntro,
  getIntro,
};

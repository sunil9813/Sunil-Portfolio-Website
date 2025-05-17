const asyncHandler = require("express-async-handler");
const { UniversityModel } = require("../../models/educationModel/universityModel");
const cloudinary = require("cloudinary").v2;

const createUniversity = asyncHandler(async (req, res) => {
  const { name, description, edate, location, website } = req.body;
  // Check if uni with the same name already exists
  const isTitleExists = await UniversityModel.findOne({ name });
  if (isTitleExists) {
    res.status(400);
    throw new Error(`A university with the same name :  "${title}" already exists.`);
  }
  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/university",
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
  const universityData = await UniversityModel.create({
    user: req.user._id,
    name: name,
    description: description,
    edate: edate,
    location: location,
    website: website,
    logo: fileData,
  });
  res.status(201).json({
    message: "University created successfully.",
    university: universityData,
  });
});

module.exports = {
  createUniversity,
};

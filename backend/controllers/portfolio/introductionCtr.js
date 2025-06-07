const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const IntroductionModel = require("../../models/portfolio/IntroductionModel");
const Filter = require("bad-words");
const { default: mongoose } = require("mongoose");

const createIntro = asyncHandler(async (req, res) => {
  const { bio, description, fullname, position, emails, phones, languages, country, address, socialslinks } = req.body;

  // Check if introduction already exists for this user
  const existingIntro = await IntroductionModel.findOne({ user: req.user._id });
  if (existingIntro) {
    return res.status(400).json({ error: "Introduction already exists for this user." });
  }

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [bio, description, fullname, position];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains inappropriate language.",
      });
    }
  }

  // Required fields validation
  if (!fullname) return res.status(400).json({ error: "Full name is required." });
  if (!position) return res.status(400).json({ error: "Position is required." });

  // Validate bio length
  if (bio && (bio.length > 250 || bio.length < 5)) {
    return res.status(400).json({ error: "Bio must be between 5 and 250 characters." });
  }

  // Validate and process emails if provided
  let validatedEmails = [];
  if (emails !== undefined) {
    try {
      const emailsArray = typeof emails === "string" ? JSON.parse(emails) : emails;
      if (!Array.isArray(emailsArray)) {
        throw new Error("Emails must be an array");
      }

      validatedEmails = emailsArray.map((emailObj) => {
        if (!emailObj.email || !/^\S+@\S+\.\S+$/.test(emailObj.email)) {
          throw new Error(`Invalid email format: ${emailObj.email || "missing email"}`);
        }
        return { email: emailObj.email.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid emails format: ${error.message}` });
    }
  }

  // Validate and process phones if provided
  let validatedPhones = [];
  if (phones !== undefined) {
    try {
      const phonesArray = typeof phones === "string" ? JSON.parse(phones) : phones;
      if (!Array.isArray(phonesArray)) {
        throw new Error("Phones must be an array");
      }

      validatedPhones = phonesArray.map((phoneObj) => {
        if (!phoneObj.phone || !/^\+?[0-9]{7,15}$/.test(phoneObj.phone.trim().replace(/\s/g, ""))) {
          throw new Error(`Invalid phone number format: ${phoneObj.phone || "missing phone"}`);
        }
        return { phone: phoneObj.phone.trim().replace(/\s/g, "") };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid phones format: ${error.message}` });
    }
  }

  // Validate and process languages if provided
  let validatedLanguages = [];
  if (languages !== undefined) {
    try {
      const languagesArray = typeof languages === "string" ? JSON.parse(languages) : languages;
      if (!Array.isArray(languagesArray)) {
        throw new Error("Languages must be an array");
      }

      validatedLanguages = languagesArray.map((langObj) => {
        if (!langObj.language) {
          throw new Error("Each language object must have a 'language' property");
        }
        return { language: langObj.language.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid languages format: ${error.message}` });
    }
  }

  // Validate social links
  let validatedSocialLinks = [];
  if (socialslinks !== undefined) {
    try {
      const linksArray = typeof socialslinks === "string" ? JSON.parse(socialslinks) : socialslinks;
      if (!Array.isArray(linksArray)) {
        throw new Error("Social links must be an array");
      }
      validatedSocialLinks = linksArray.map((linkObj) => {
        if (!linkObj.link || !/^https?:\/\/.+/.test(linkObj.link)) {
          throw new Error(`Invalid URL format: ${linkObj.link || "missing link"}`);
        }
        return { link: linkObj.link.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid social links format: ${error.message}` });
    }
  }

  // Handle avatar upload
  let avatarData = {};
  if (!req.files || !req.files["avatar"] || !req.files["avatar"][0]) {
    return res.status(400).json({ error: "Avatar is required for new introductions." });
  }
  const avatarFile = req.files["avatar"][0];
  try {
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Portfolio/Intro/Avatar", resource_type: "image" }, (error, result) => {
        if (error) return reject(new Error("Avatar upload failed: " + error.message));
        avatarData = {
          fileName: avatarFile.originalname,
          filePath: result.secure_url,
          fileType: avatarFile.mimetype,
          publicId: result.public_id,
        };
        resolve();
      });
      uploadStream.end(avatarFile.buffer);
    });
  } catch (error) {
    return res.status(500).json({ error: "Avatar could not be uploaded: " + error.message });
  }

  // Handle CV upload
  let cvData = {};
  if (req.files && req.files["cv"] && req.files["cv"][0]) {
    const cvFile = req.files["cv"][0];
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Portfolio/Intro/CVs", resource_type: "raw" }, (error, result) => {
          if (error) return reject(new Error("CV upload failed: " + error.message));
          cvData = {
            fileName: cvFile.originalname,
            filePath: result.secure_url,
            fileType: cvFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(cvFile.buffer);
      });
    } catch (error) {
      // Clean up avatar if CV upload fails
      if (avatarData.publicId) {
        await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "CV could not be uploaded: " + error.message });
    }
  }

  // Create the introduction
  try {
    const introduction = await IntroductionModel.create({
      user: req.user._id,
      bio,
      description,
      fullname,
      position,
      emails: validatedEmails,
      phones: validatedPhones,
      languages: validatedLanguages, // Fixed: Changed 'language' to 'languages'
      country,
      address,
      socialslinks: validatedSocialLinks,
      avatar: avatarData,
      cv: cvData,
      downloadCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Introduction created successfully",
      data: introduction,
    });
  } catch (error) {
    // Clean up uploaded files if creation fails
    if (avatarData.publicId) {
      await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
    }
    if (cvData.publicId) {
      await cloudinary.uploader.destroy(cvData.publicId, { resource_type: "raw" });
    }
    console.error("Introduction creation error:", error);
    res.status(500).json({
      error: "Failed to create introduction",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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

const deleteIntro = asyncHandler(async (req, res) => {
  const introId = req.params.id || req.body.id;

  if (!introId) {
    return res.status(400).json({ error: "Introduction ID is required." });
  }

  const intro = await IntroductionModel.findById(introId);

  if (!intro) {
    return res.status(404).json({ error: "Introduction not found." });
  }

  // Delete avatar from Cloudinary if exists
  if (intro.avatar && intro.avatar.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(intro.avatar.publicId, { resource_type: "image" });
      if (result.result !== "ok") {
        return res.status(500).json({ error: "Error deleting avatar from Cloudinary." });
      }
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while deleting avatar from Cloudinary: " + error.message });
    }
  }

  // Delete CV from Cloudinary if exists
  if (intro.cv && intro.cv.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(intro.cv.publicId, { resource_type: "raw" });
      if (result.result !== "ok") {
        return res.status(500).json({ error: "Error deleting CV from Cloudinary." });
      }
    } catch (error) {
      return res.status(500).json({ error: "An error occurred while deleting CV from Cloudinary: " + error.message });
    }
  }

  // Delete the introduction document
  await IntroductionModel.deleteOne({ _id: introId });

  res.status(200).json({ message: "Introduction deleted successfully." });
});

const updateIntro = asyncHandler(async (req, res) => {
  console.log("req.body:", JSON.stringify(req.body, null, 2));

  // Validate user authentication
  if (!req.user || !req.user._id) {
    return res.status(401).json({ error: "Unauthorized: User not authenticated." });
  }

  // Validate id parameter
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid or missing introduction ID." });
  }

  // Check if introduction exists and belongs to the user
  const existingIntro = await IntroductionModel.findById(id);
  if (!existingIntro) {
    return res.status(404).json({ error: "Introduction not found." });
  }
  if (existingIntro.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "Unauthorized: You can only update your own introduction." });
  }

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [req.body.bio, req.body.description, req.body.fullname, req.body.position];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Update failed because the content contains inappropriate language.",
      });
    }
  }

  // Validate bio length
  if (req.body.bio && (req.body.bio.length > 250 || req.body.bio.length < 5)) {
    return res.status(400).json({ error: "Bio must be between 5 and 250 characters." });
  }

  // Process emails - handle both JSON and form-data formats
  let validatedEmails = existingIntro.emails || [];
  if (req.body.emails) {
    try {
      // Handle both array of objects and array of strings
      const emailsInput = Array.isArray(req.body.emails) ? req.body.emails : [];
      validatedEmails = emailsInput.map((item) => {
        const email = typeof item === "string" ? item : item.email;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
          throw new Error(`Invalid email format: ${email || "missing email"}`);
        }
        return { email: email.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid emails format: ${error.message}` });
    }
  }

  // Process phones - handle both JSON and form-data formats
  let validatedPhones = existingIntro.phones || [];
  if (req.body.phones) {
    try {
      // Handle both array of objects and array of strings
      const phonesInput = Array.isArray(req.body.phones) ? req.body.phones : [];
      validatedPhones = phonesInput.map((item) => {
        const phone = typeof item === "string" ? item : item.phone;
        if (!phone || !/^\+?[0-9]{7,15}$/.test(phone.trim().replace(/\s/g, ""))) {
          throw new Error(`Invalid phone number format: ${phone || "missing phone"}`);
        }
        return { phone: phone.trim().replace(/\s/g, "") };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid phones format: ${error.message}` });
    }
  }

  // Process languages - handle both JSON and form-data formats
  let validatedLanguages = existingIntro.languages || [];
  if (req.body.languages) {
    try {
      // Handle both array of objects and array of strings
      const languagesInput = Array.isArray(req.body.languages) ? req.body.languages : [];
      validatedLanguages = languagesInput.map((item) => {
        const language = typeof item === "string" ? item : item.language;
        if (!language) {
          throw new Error("Each language must have a value");
        }
        return { language: language.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid languages format: ${error.message}` });
    }
  }

  // Process social links - handle both JSON and form-data formats
  let validatedSocialLinks = existingIntro.socialslinks || [];
  if (req.body.socialslinks) {
    try {
      // Handle both array of objects and array of strings
      const linksInput = Array.isArray(req.body.socialslinks) ? req.body.socialslinks : [];
      validatedSocialLinks = linksInput.map((item) => {
        const link = typeof item === "string" ? item : item.link;
        if (!link || !/^https?:\/\/.+/.test(link)) {
          throw new Error(`Invalid URL format: ${link || "missing link"}`);
        }
        return { link: link.trim() };
      });
    } catch (error) {
      return res.status(400).json({ error: `Invalid social links format: ${error.message}` });
    }
  }

  // Handle avatar upload
  let avatarData = existingIntro.avatar || {};
  if (req.files && req.files["avatar"] && req.files["avatar"][0]) {
    const avatarFile = req.files["avatar"][0];
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Portfolio/Intro/Avatar", resource_type: "image" }, (error, result) => {
          if (error) return reject(new Error("Avatar upload failed: " + error.message));
          avatarData = {
            fileName: avatarFile.originalname,
            filePath: result.secure_url,
            fileType: avatarFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(avatarFile.buffer);
      });
      // Delete previous avatar if it exists
      if (existingIntro.avatar && existingIntro.avatar.publicId) {
        await cloudinary.uploader.destroy(existingIntro.avatar.publicId, { resource_type: "image" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Avatar could not be uploaded: " + error.message });
    }
  }

  // Handle CV upload
  let cvData = existingIntro.cv || {};
  if (req.files && req.files["cv"] && req.files["cv"][0]) {
    const cvFile = req.files["cv"][0];
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Portfolio/Intro/CVs", resource_type: "raw" }, (error, result) => {
          if (error) return reject(new Error("CV upload failed: " + error.message));
          cvData = {
            fileName: cvFile.originalname,
            filePath: result.secure_url,
            fileType: cvFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(cvFile.buffer);
      });
      // Delete previous CV if it exists
      if (existingIntro.cv && existingIntro.cv.publicId) {
        await cloudinary.uploader.destroy(existingIntro.cv.publicId, { resource_type: "raw" });
      }
    } catch (error) {
      // Clean up new avatar if CV upload fails
      if (avatarData.publicId && avatarData !== existingIntro.avatar) {
        await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
      }
      return res.status(500).json({ error: "CV could not be uploaded: " + error.message });
    }
  }

  // Prepare update data
  const updateData = {
    bio: req.body.bio !== undefined ? req.body.bio : existingIntro.bio,
    description: req.body.description !== undefined ? req.body.description : existingIntro.description,
    fullname: req.body.fullname !== undefined ? req.body.fullname : existingIntro.fullname,
    position: req.body.position !== undefined ? req.body.position : existingIntro.position,
    emails: validatedEmails,
    phones: validatedPhones,
    languages: validatedLanguages,
    country: req.body.country !== undefined ? req.body.country : existingIntro.country,
    address: req.body.address !== undefined ? req.body.address : existingIntro.address,
    socialslinks: validatedSocialLinks,
    downloadCount: existingIntro.downloadCount,
    avatar: avatarData,
    cv: cvData,
  };

  // Add avatar data if it was updated
  if (req.files && req.files["avatar"] && req.files["avatar"][0]) {
    updateData.avatar = avatarData;
  } else if (req.body.avatar === null) {
    // Handle avatar removal if needed
    updateData.avatar = null;
  }

  // Add cv data if it was updated
  if (req.files && req.files["cv"] && req.files["cv"][0]) {
    updateData.cv = cvData;
  } else if (req.body.cv === null) {
    // Handle cv removal if needed
    updateData.cv = null;
  }

  // Update the introduction
  try {
    const introduction = await IntroductionModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: "Introduction updated successfully",
      data: introduction,
    });
  } catch (error) {
    // Clean up new uploads if update fails
    if (avatarData?.publicId && avatarData !== existingIntro.avatar) {
      await cloudinary.uploader.destroy(avatarData.publicId, { resource_type: "image" });
    }
    if (cvData?.publicId && cvData !== existingIntro.cv) {
      await cloudinary.uploader.destroy(cvData.publicId, { resource_type: "raw" });
    }
    res.status(500).json({
      error: "Failed to update introduction",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

const downloadCV = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid introduction ID" });
  }

  try {
    // Find the introduction and increment download count
    const intro = await IntroductionModel.findByIdAndUpdate(
      id,
      { $inc: { downloadCount: 1 } }, // Increment by 1
      { new: true }
    );

    if (!intro || !intro.cv || !intro.cv.filePath) {
      return res.status(404).json({ error: "CV not found" });
    }

    // Get the CV file from Cloudinary
    const cvUrl = intro.cv.filePath;

    // Redirect to the Cloudinary URL
    res.redirect(cvUrl);

    // Alternative: Download directly (if you have the file buffer)
    // res.setHeader('Content-Type', intro.cv.fileType);
    // res.setHeader('Content-Disposition', `attachment; filename="${intro.cv.fileName}"`);
    // res.send(cvBuffer);
  } catch (error) {
    res.status(500).json({
      error: "Failed to download CV",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// only access to admin
const getAllIntro = asyncHandler(async (req, res) => {
  const intros = await IntroductionModel.find({}).sort("-createdAt").populate({
    path: "user",
    select: "avatar name email",
  });

  if (!intros) {
    res.status(500);
    throw new Error("An unexpected error occurred. Please try again later or contact our support team for assistance.");
  }

  res.status(200).json({ total: intros?.length, introList: intros });
});
module.exports = {
  createIntro,
  getIntro,
  deleteIntro,
  updateIntro,
  getAllIntro,
  downloadCV,
};

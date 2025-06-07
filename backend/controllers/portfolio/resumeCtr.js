const asyncHandler = require("express-async-handler");
const UserModel = require("../../models/users/UserModel");
const Resume = require("../../models/portfolio/resumeModel");
const { default: mongoose } = require("mongoose");

const createResume = asyncHandler(async (req, res) => {
  // Validate authentication
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Unauthorized: User not authenticated");
  }

  const { userId, education, experience, skills, achievements, training, award, reference } = req.body;
  const isAdmin = req.user.role === "admin";

  // Determine target user ID
  let targetUserId = req.user._id.toString();
  if (isAdmin && userId) {
    // Admins can specify a userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
    }
    // Verify user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      res.status(404);
      throw new Error("Target user not found");
    }
    targetUserId = userId;
  } else if (userId && !isAdmin) {
    // Non-admins cannot specify a userId
    res.status(403);
    throw new Error("Unauthorized: You can only create a resume for yourself");
  }

  // Check if resume already exists for non-admins
  if (!isAdmin) {
    const existingResume = await Resume.findOne({ user: targetUserId });
    if (existingResume) {
      res.status(400);
      throw new Error("Resume already exists for this user");
    }
  }

  // Validate input data
  const resumeData = {
    user: targetUserId,
    education: Array.isArray(education) ? education : [],
    experience: Array.isArray(experience) ? experience : [],
    skills: Array.isArray(skills) ? skills : [],
    achievements: Array.isArray(achievements) ? achievements : [],
    training: Array.isArray(training) ? training : [],
    award: Array.isArray(award) ? award : [],
    reference: Array.isArray(reference) ? reference : [],
  };

  // Basic validation for array fields
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);

  // Validate references
  if (resumeData.reference.length > 0) {
    for (const ref of resumeData.reference) {
      if (ref.email && !validateEmail(ref.email)) {
        res.status(400);
        throw new Error(`Invalid email format in reference: ${ref.email}`);
      }
      if (ref.phone && !validatePhone(ref.phone)) {
        res.status(400);
        throw new Error(`Invalid phone format in reference: ${ref.phone}`);
      }
      if (ref.website && !/^https?:\/\/.+/.test(ref.website)) {
        res.status(400);
        throw new Error(`Invalid website URL in reference: ${ref.website}`);
      }
    }
  }

  // Validate skills progress
  if (resumeData.skills.length > 0) {
    for (const skill of resumeData.skills) {
      if (skill.progress && (skill.progress < 0 || skill.progress > 100)) {
        res.status(400);
        throw new Error(`Invalid progress value for skill ${skill.name}: must be between 0 and 100`);
      }
    }
  }

  // Validate dates (ensure startDate < endDate where applicable)
  const validateDates = (items, itemType) => {
    for (const item of items) {
      if (item.startDate && item.endDate && new Date(item.startDate) > new Date(item.endDate)) {
        res.status(400);
        throw new Error(`Invalid dates in ${itemType}: startDate must be before endDate`);
      }
    }
  };
  validateDates(resumeData.education, "education");
  validateDates(resumeData.experience, "experience");
  validateDates(resumeData.training, "training");

  // Create resume
  try {
    const resume = await Resume.create(resumeData);
    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      data: resume,
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Failed to create resume: ${error.message}`);
  }
});

const getResume = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findById(id).populate("user");

    if (!resume) {
      res.status(404).json({ message: "Resume not found for this user" });
    } else {
      res.status(200).json(resume);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getAllResume = asyncHandler(async (req, res) => {
  try {
    const resume = await Resume.find({}).populate("user");

    if (!resume) {
      res.status(404).json({ message: "Resume not found for this user" });
    } else {
      res.status(200).json(resume);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteResume = asyncHandler(async (req, res) => {
  const resumeId = req.body.id || req.params.id;

  if (!resumeId) {
    res.status(400);
    throw new Error("Resume ID is required");
  }

  const resume = await Resume.findById(resumeId);

  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  // Check if the requesting user is the owner
  if (resume.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this resume");
  }

  await resume.deleteOne();
  res.status(200).json({ message: "Resume deleted successfully" });
});

const updateResume = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Unauthorized: User not authenticated");
  }

  const { id } = req.params;
  const { education, experience, skills, achievements, training, award, reference, deletedIds } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid or missing resume ID");
  }

  const existingResume = await Resume.findById(id);
  if (!existingResume) {
    res.status(404);
    throw new Error("Resume not found");
  }

  if (existingResume.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Unauthorized: You can only update your own resume");
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[0-9]{7,15}$/.test(phone);
  const validateUrl = (url) => /^https?:\/\/.+/.test(url);
  const validateDates = (startDate, endDate, field) => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      throw new Error(`Invalid dates in ${field}: startDate must be before endDate`);
    }
  };

  // Process deletions
  const processDeletions = async () => {
    if (!deletedIds || typeof deletedIds !== "object") return;

    const fields = ["education", "experience", "skills", "achievements", "training", "award", "reference"];
    for (const field of fields) {
      if (Array.isArray(deletedIds[field])) {
        const validIds = deletedIds[field].filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (validIds.length > 0) {
          await Resume.updateOne({ _id: id }, { $pull: { [field]: { _id: { $in: validIds.map((id) => new mongoose.Types.ObjectId(id)) } } } });
        }
      }
    }
  };

  // Process array fields for updates and additions
  const processArrayField = async (fieldName, inputData, existingData, validationFn) => {
    // Handle empty arrays
    if (!inputData || inputData.length === 0) {
      await Resume.updateOne({ _id: id }, { $set: { [fieldName]: [] } });
      return;
    }
    if (!Array.isArray(inputData)) {
      throw new Error(`Invalid input for ${fieldName}: Expected an array`);
    }

    const validatedData = validationFn(inputData);
    const updates = [];
    const newEntries = [];

    for (const item of validatedData) {
      if (item._id && mongoose.Types.ObjectId.isValid(item._id)) {
        updates.push({ _id: item._id, data: item });
      } else {
        newEntries.push(item);
      }
    }

    // Update existing entries
    for (const update of updates) {
      const updatePath = `${fieldName}.$[elem]`;
      const arrayFilters = [{ "elem._id": new mongoose.Types.ObjectId(update._id) }];
      const updateFields = {};
      Object.entries(update.data).forEach(([key, value]) => {
        if (key !== "_id") {
          updateFields[`${updatePath}.${key}`] = value;
        }
      });
      await Resume.updateOne({ _id: id, [`${fieldName}._id`]: new mongoose.Types.ObjectId(update._id) }, { $set: updateFields }, { arrayFilters });
    }

    // Add new entries
    if (newEntries.length > 0) {
      await Resume.updateOne({ _id: id }, { $push: { [fieldName]: { $each: newEntries } } });
    }
  };

  // Validation functions for each field
  const validateEducation = (data) =>
    data.map((edu) => {
      if (edu.startDate && edu.endDate) validateDates(edu.startDate, edu.endDate, "education");
      return {
        _id: edu._id,
        school: edu.school?.trim(),
        degree: edu.degree?.trim(),
        university: edu.university?.trim(),
        city: edu.city?.trim(),
        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
        description: edu.description?.trim(),
      };
    });

  const validateExperience = (data) =>
    data.map((exp) => {
      if (exp.startDate && exp.endDate) validateDates(exp.startDate, exp.endDate, "experience");
      return {
        _id: exp._id,
        company: exp.company?.trim(),
        position: exp.position?.trim(),
        city: exp.city?.trim(),
        description: exp.description?.trim(),
        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      };
    });

  const validateSkills = (data) =>
    data.map((skill) => {
      if (skill.progress && (skill.progress < 0 || skill.progress > 100)) {
        throw new Error(`Invalid progress for skill ${skill.name}: must be between 0 and 100`);
      }
      return {
        _id: skill._id,
        name: skill.name?.trim(),
        progress: skill.progress ?? 0,
      };
    });

  const validateAchievements = (data) =>
    data.map((ach) => ({
      _id: ach._id,
      title: ach.title?.trim(),
      description: ach.description?.trim(),
    }));

  const validateTraining = (data) =>
    data.map((trn) => {
      if (trn.startDate && trn.endDate) validateDates(trn.startDate, trn.endDate, "training");
      return {
        _id: trn._id,
        title: trn.title?.trim(),
        company: trn.company?.trim(),
        city: trn.city?.trim(),
        description: trn.description?.trim(),
        startDate: trn.startDate ? new Date(trn.startDate) : undefined,
        endDate: trn.endDate ? new Date(trn.endDate) : undefined,
      };
    });

  const validateAward = (data) =>
    data.map((awd) => ({
      _id: awd._id,
      title: awd.title?.trim(),
      company: awd.company?.trim(),
      city: awd.city?.trim(),
      description: awd.description?.trim(),
      recievedYear: awd.recievedYear ? new Date(awd.recievedYear) : undefined,
    }));

  const validateReference = (data) =>
    data.map((ref) => {
      if (ref.email && !validateEmail(ref.email)) throw new Error(`Invalid email: ${ref.email}`);
      if (ref.phone && !validatePhone(ref.phone)) throw new Error(`Invalid phone: ${ref.phone}`);
      if (ref.website && !validateUrl(ref.website)) throw new Error(`Invalid website: ${ref.website}`);
      return {
        _id: ref._id,
        fullname: ref.fullname?.trim(),
        company: ref.company?.trim(),
        designation: ref.designation?.trim(),
        phone: ref.phone?.trim(),
        email: ref.email?.trim(),
        website: ref.website?.trim(),
      };
    });

  try {
    // Process deletions first
    await processDeletions();

    // Process array fields for updates and additions
    await processArrayField("education", education, existingResume.education, validateEducation);
    await processArrayField("experience", experience, existingResume.experience, validateExperience);
    await processArrayField("skills", skills, existingResume.skills, validateSkills);
    await processArrayField("achievements", achievements, existingResume.achievements, validateAchievements);
    await processArrayField("training", training, existingResume.training, validateTraining);
    await processArrayField("award", award, existingResume.award, validateAward);
    await processArrayField("reference", reference, existingResume.reference, validateReference);

    // Fetch the updated resume
    const updatedResume = await Resume.findById(id);
    if (!updatedResume) {
      res.status(404);
      throw new Error("Resume not found after update");
    }

    console.log("Updated resume:", JSON.stringify(updatedResume, null, 2));

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400);
    throw new Error(`Failed to update resume: ${error.message}`);
  }
});

const deleteResumeFields = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's resume
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { deleteEducation, deleteExperience, deleteSkills } = req.body;

    if (deleteEducation) {
      // Delete the specified education entry by _id
      const educationIdToDelete = deleteEducation._id;

      resume.education = resume.education.filter((edu) => edu._id.toString() !== educationIdToDelete);
    }

    if (deleteExperience) {
      // Delete the specified experience entry by _id
      const experienceIdToDelete = deleteExperience._id;

      resume.experience = resume.experience.filter((exp) => exp._id.toString() !== experienceIdToDelete);
    }

    if (deleteSkills) {
      // Delete the specified skill entry by _id
      const skillIdToDelete = deleteSkills._id;

      resume.skills = resume.skills.filter((skill) => skill._id.toString() !== skillIdToDelete);
    }

    await resume.save();

    res.status(200).json({ message: "Resume fields deleted successfully", updatedResume: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { createResume, getResume, getAllResume, updateResume, deleteResumeFields, deleteResume };

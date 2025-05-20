const Resume = require("../../models/about/resumeModel");
const asyncHandler = require("express-async-handler");

const createOrUpdateResume = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if the user already has a resume
    const existingResume = await Resume.findOne({ user: userId });

    if (existingResume) {
      // User already has a resume, so update it
      const { education, experience, skills } = req.body;

      existingResume.education = education;
      existingResume.experience = experience;
      existingResume.skills = skills;

      await existingResume.save();

      res.status(200).json({ message: "Resume updated successfully", updatedResume: existingResume });
    } else {
      // User doesn't have a resume, create a new one
      const { education, experience, skills } = req.body;

      const newResume = new Resume({
        user: userId,
        education,
        experience,
        skills,
      });

      await newResume.save();

      res.status(201).json({ message: "Resume created successfully", newResume });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getResume = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const resume = await Resume.findById(id).populate(user);

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
    const resume = await Resume.find().populate("user");

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

const updateResumeFields = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's resume
    const resume = await Resume.findOne({ user: userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { updatedEducation, updatedExperience, updatedSkills } = req.body;

    if (updatedEducation) {
      // Update the specified education entry by _id
      const educationIdToUpdate = updatedEducation._id;

      const educationEntryToUpdate = resume.education.find((edu) => edu._id.toString() === educationIdToUpdate);

      if (!educationEntryToUpdate) {
        return res.status(404).json({ message: "Education entry not found" });
      }

      // Update specific fields within the education entry
      const { schoolName, degree, university, address, startDate, endDate } = updatedEducation;

      educationEntryToUpdate.schoolName = schoolName;
      educationEntryToUpdate.degree = degree;
      educationEntryToUpdate.university = university;
      educationEntryToUpdate.address = address;
      educationEntryToUpdate.startDate = startDate;
      educationEntryToUpdate.endDate = endDate;
    }

    if (updatedExperience) {
      // Update the specified experience entry by _id
      const experienceIdToUpdate = updatedExperience._id;

      const experienceEntryToUpdate = resume.experience.find((exp) => exp._id.toString() === experienceIdToUpdate);

      if (!experienceEntryToUpdate) {
        return res.status(404).json({ message: "Experience entry not found" });
      }

      // Update specific fields within the experience entry
      const { companyName, position, address, description, startDate, endDate } = updatedExperience;

      experienceEntryToUpdate.companyName = companyName;
      experienceEntryToUpdate.position = position;
      experienceEntryToUpdate.address = address;
      experienceEntryToUpdate.description = description;
      experienceEntryToUpdate.startDate = startDate;
      experienceEntryToUpdate.endDate = endDate;
    }

    if (updatedSkills) {
      // Update the specified skill entry by _id
      const skillIdToUpdate = updatedSkills._id;

      const skillToUpdate = resume.skills.find((skill) => skill._id.toString() === skillIdToUpdate);

      if (!skillToUpdate) {
        return res.status(404).json({ message: "Skill entry not found" });
      }

      // Update specific fields within the skill entry
      const { name, progress } = updatedSkills;

      skillToUpdate.name = name;
      skillToUpdate.progress = progress;
    }

    await resume.save();

    res.status(200).json({ message: "Resume fields updated successfully", updatedResume: resume });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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

module.exports = { createOrUpdateResume, getResume, getAllResume, updateResumeFields, deleteResumeFields };

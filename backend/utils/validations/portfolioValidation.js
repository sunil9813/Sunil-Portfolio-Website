const yup = require("yup");

const introductionValidation = yup.object().shape({
  description: yup.string().trim().min(10, "Description must be at least 10 characters."),
  fullname: yup.string().trim().required("Full name is required.").min(2, "Name must be at least 2 characters."),
  position: yup.string().trim().required("Position is required.").min(2, "Position must be at least 2 characters."),
  emails: yup.string().trim().email("Invalid email format.").required("Email is required."),
  phones: yup
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-()]/g, ""))
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number format.")
    .required("Phone number is required."),
  bio: yup.string().trim().min(5, "Bio must be at least 5 characters.").max(250, "Bio must be at most 250 characters.").required("Bio is required."),
  address: yup.string().trim().required("Address is required."),
});

const educationValidation = yup.object().shape({
  school: yup.string().trim().required("School name is required."),
  degree: yup.string().trim().required("Degree is required."),
  university: yup.string().trim().required("University is required."),
  city: yup.string().trim().required("City is required."),
  startDate: yup.date().required("Start date is required."),
  endDate: yup.date().when("startDate", (startDate, schema) => startDate && schema.min(startDate, "End date must be after start date")),
  description: yup.string().trim().max(500, "Description must be at most 500 characters."),
});

const experienceValidation = yup.object().shape({
  company: yup.string().trim().required("Company name is required."),
  position: yup.string().trim().required("Position is required."),
  city: yup.string().trim().required("City is required."),
  description: yup.string().trim().max(500, "Description must be at most 500 characters."),
  startDate: yup.date().required("Start date is required."),
  endDate: yup.date().when("startDate", (startDate, schema) => startDate && schema.min(startDate, "End date must be after start date")),
});

const skillValidation = yup.object().shape({
  name: yup.string().trim().required("Skill name is required."),
  progress: yup.number().required("Progress is required.").min(0, "Progress must be at least 0%.").max(100, "Progress must be at most 100%."),
});

const achievementValidation = yup.object().shape({
  title: yup.string().trim().required("Title is required."),
  description: yup.string().trim().max(500, "Description must be at most 500 characters."),
});

const trainingValidation = yup.object().shape({
  title: yup.string().trim().required("Training title is required."),
  company: yup.string().trim().required("Company name is required."),
  city: yup.string().trim().required("City is required."),
  description: yup.string().trim().max(500, "Description must be at most 500 characters."),
  startDate: yup.date().required("Start date is required."),
  endDate: yup.date().when("startDate", (startDate, schema) => startDate && schema.min(startDate, "End date must be after start date")),
});

const awardValidation = yup.object().shape({
  title: yup.string().trim().required("Award title is required."),
  company: yup.string().trim().required("Company name is required."),
  city: yup.string().trim().required("City is required."),
  description: yup.string().trim().max(500, "Description must be at most 500 characters."),
  recievedYear: yup.date().required("Received year is required."),
});

const referenceValidation = yup.object().shape({
  fullname: yup.string().trim().required("Full name is required."),
  company: yup.string().trim().required("Company name is required."),
  city: yup.string().trim().required("City is required."),
  designation: yup.string().trim().required("Designation is required."),
  phone: yup
    .string()
    .trim()
    .transform((value) => value.replace(/[\s-()]/g, ""))
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number format.")
    .required("Phone number is required."),
  email: yup.string().trim().email("Invalid email format.").required("Email is required."),
  website: yup.string().trim().url("Invalid website URL format."),
});

const resumeValidation = yup.object().shape({
  user: yup.string().required("User ID is required."),
  education: yup.array().of(educationValidation),
  experience: yup.array().of(experienceValidation),
  skills: yup.array().of(skillValidation),
  achievements: yup.array().of(achievementValidation),
  training: yup.array().of(trainingValidation),
  award: yup.array().of(awardValidation),
  reference: yup.array().of(referenceValidation),
});

module.exports = {
  introductionValidation,
  resumeValidation,
};

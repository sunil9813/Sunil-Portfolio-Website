const yup = require("yup");

const createUniversityValidation = yup.object().shape({
  name: yup.string().trim().required("University name is required.").min(3, "Name must be at least 3 characters long."),
  description: yup.string().trim().required("Description is required."),
  edate: yup.string().trim().required("Establishment date is required."),
  location: yup.string().trim().required("Location is required."),
  website: yup.string().trim().url("Invalid website URL format."),
});

module.exports = {
  createUniversityValidation,
};

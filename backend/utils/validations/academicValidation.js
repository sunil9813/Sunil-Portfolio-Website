const yup = require("yup");

const createUniversityValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("University name is required.")
    .min(3, "Name must be at least 3 characters long.")
    .test("is-unique", "University name already exists.", async (value) => {
      const exists = await UniversityModel.exists({ name: value });
      return !exists;
    }),
  description: yup.string().trim().required("Description is required."),
  edate: yup
    .string()
    .required("Establishment date is required.")
    .test(
      "is-valid-date",
      "Invalid date format (expected YYYY-MM-DD).",
      (value) => !isNaN(Date.parse(value)) // Basic date validation
    ),
  location: yup.string().trim().required("Location is required."),
  website: yup.string().trim().url("Invalid website URL format.").notRequired(),
});

module.exports = {
  createUniversityValidation,
};

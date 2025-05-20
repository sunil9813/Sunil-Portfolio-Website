const yup = require("yup");

const createProjectValidation = yup.object().shape({
  title: yup.string().trim().required("Title is required. Please provide a title.").min(10, "Title must be at least 10 characters long."),
  description: yup.string().trim().required("Description is required. Please provide a description.").min(10, "Description must be at least 10 characters long."),
  category: yup.string().trim().required("Category is required. Please provide a category."),
  layout: yup.string().trim().required("Layout is required. Please provide a layout."),
});

const createCategoryValidation = yup.object().shape({
  title: yup.string().trim().required("Title is required. Please provide a title.").min(3, "Title must be at least 3 characters long."),
});

const createNoteBookValidation = yup.object().shape({
  title: yup.string().trim().required("Title is required. Please provide a title.").min(3, "Title must be at least 3 characters long."),
  description: yup.string().trim().required("Description is required. Please provide a description.").min(10, "Description must be at least 10 characters long."),
});
const createBlogValidation = yup.object().shape({
  title: yup.string().trim().required("Title is required. Please provide a title.").min(3, "Title must be at least 3 characters long."),
  description: yup.string().trim().required("Description is required. Please provide a description.").min(10, "Description must be at least 10 characters long."),
});

module.exports = { createProjectValidation, createCategoryValidation, createNoteBookValidation, createBlogValidation };

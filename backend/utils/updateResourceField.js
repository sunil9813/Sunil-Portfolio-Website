const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

/**
 * Updates a single field in a MongoDB document with validation and authorization.
 * @param {Object} params - Parameters for the update operation.
 * @param {string} params.resourceId - The ID of the resource to update.
 * @param {string} params.fieldName - The name of the field to update (e.g., 'featured', 'visibility').
 * @param {any} params.fieldValue - The new value for the field.
 * @param {Function} params.validateField - Function to validate the field value, returns error message if invalid.
 * @param {Model} params.Model - Mongoose model for the resource (e.g., BlogModel, ProjectModel).
 * @param {Object} params.user - The authenticated user (req.user).
 * @param {string} params.userIdField - Field in the model that stores the creator's ID (e.g., 'userId', 'user').
 * @param {string} params.resourceName - Name of the resource for error messages (e.g., 'Blog', 'Project').
 * @returns {Object} Updated document or throws an error.
 */
const updateResourceField = asyncHandler(async ({ resourceId, fieldName, fieldValue, validateField, Model, user, userIdField, resourceName }) => {
  // Validate the resourceId
  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    throw new Error(`Invalid ${resourceName} ID.`);
  }

  // Validate the field value
  const validationError = validateField(fieldValue);
  if (validationError) {
    throw new Error(validationError);
  }

  // Find the resource
  const resource = await Model.findById(resourceId);
  if (!resource) {
    throw new Error(`${resourceName} not found.`);
  }

  // Check if the user field exists
  if (!resource[userIdField]) {
    throw new Error(`${resourceName} is missing the ${userIdField} field.`);
  }

  // Check authorization
  if (user.id !== resource[userIdField].toString() && user.role !== "admin") {
    throw new Error(`You are not authorized to update this ${resourceName.toLowerCase()}.`);
  }

  // Update the resource
  const updatedResource = await Model.findByIdAndUpdate(resourceId, { [fieldName]: fieldValue }, { new: true });

  return updatedResource;
});

module.exports = { updateResourceField };

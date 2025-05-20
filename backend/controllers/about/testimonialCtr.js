const expressAsyncHandler = require("express-async-handler");
const Testimonial = require("../../models/about/testimonialModel");
const Filter = require("bad-words");
const cloudinary = require("cloudinary").v2;

const createTestimonial = async (req, res) => {
  try {
    const { author, position, company, location, content, email, phone, rating, link, cost } = req.body;

    const filter = new Filter();
    const fieldsToCheck = [author, position, company, location, content, email, phone, link, cost];

    // Loop through each field and check for profanity
    for (const field of fieldsToCheck) {
      if (filter.isProfane(field)) {
        return res.status(400).json({
          error:
            "Creation failed because the content contains profane words, and your feedback cannot be posted due to content guidelines.",
        });
      }
    }

    // Check if avatar field exists
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        error: "The avatar field is required.",
      });
    }

    // Handle file uploads for avatar field
    const avatarFile = req.files.avatar[0];

    // Validate avatar file type
    const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!acceptedImageTypes.includes(avatarFile.mimetype)) {
      return res.status(400).json({
        error: "Avatar image must be in PNG, JPEG, or JPG format",
      });
    }

    let projectDocData = {};

    // Check if projectDoc field exists
    if (req.files && req.files.projectDoc) {
      // Handle file upload for projectDoc field
      const projectDocFile = req.files.projectDoc[0];

      // Validate projectDoc file type
      const acceptedProjectDocTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!acceptedProjectDocTypes.includes(projectDocFile.mimetype)) {
        return res.status(400).json({
          error: "Project document must be in Pdf, PNG, JPEG, or JPG format",
        });
      }

      // Handle cloudinary upload for projectDoc file (similar to your original code)
      try {
        const uploadedProjectDoc = await cloudinary.uploader.upload(projectDocFile.path, {
          folder: "Sunil Portfolio/About/Testimonial/Project Documentation",
        });

        projectDocData = {
          fileName: projectDocFile.originalname,
          filePath: uploadedProjectDoc.secure_url,
          fileType: projectDocFile.mimetype,
          publicId: uploadedProjectDoc.public_id,
        };
      } catch (error) {
        console.error("Error uploading project document:", error);
        return res.status(500).json({ error: "Project document could not be uploaded" });
      }
    }

    // Handle cloudinary upload for avatar file (similar to your original code)
    let avatarData = {};
    try {
      const uploadedAvatar = await cloudinary.uploader.upload(avatarFile.path, {
        folder: "Sunil Portfolio/About/Testimonial/Avatar",
      });

      avatarData = {
        fileName: avatarFile.originalname,
        filePath: uploadedAvatar.secure_url,
        fileType: avatarFile.mimetype,
        publicId: uploadedAvatar.public_id,
      };
    } catch (error) {
      console.error("Error uploading avatar image:", error);
      return res.status(500).json({ error: "Avatar image could not be uploaded" });
    }

    // Create a new Testimonial document with the uploaded file data
    const newTestimonial = new Testimonial({
      author,
      position,
      company,
      location,
      content,
      email,
      phone,
      rating,
      link,
      cost,
      avatar: avatarData,
      projectDoc: projectDocData,
    });

    await newTestimonial.save();
    res.status(201).json({ message: "Feedback submitted successfully", testimonial: newTestimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTestimonials = async (req, res) => {
  try {
    const testimonialId = req.params.id; // Assuming you pass the ID as a route parameter

    // Check if the testimonial with the given ID exists
    const existingTestimonial = await Testimonial.findById(testimonialId);

    if (!existingTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Capture the existing avatar publicId for deletion
    let prevAvatarPublicId = null;
    if (existingTestimonial.avatar && existingTestimonial.avatar.publicId) {
      prevAvatarPublicId = existingTestimonial.avatar.publicId;
    }

    // Update the testimonial fields with the new data from the request body
    const { author, position, company, location, content, email, phone, rating, link, cost } = req.body;

    // Ensure that required fields are provided; otherwise, use the previous data
    const updatedData = {
      author: author || existingTestimonial.author,
      position: position || existingTestimonial.position,
      company: company || existingTestimonial.company,
      location: location || existingTestimonial.location,
      content: content || existingTestimonial.content,
      email: email || existingTestimonial.email,
      phone: phone || existingTestimonial.phone,
      rating: rating || existingTestimonial.rating,
      link: link || existingTestimonial.link,
      cost: cost || existingTestimonial.cost,
    };

    // Update the testimonial fields
    existingTestimonial.set(updatedData);

    // Handle avatar update (if provided)
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar[0];

      // Validate avatar file type
      const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!acceptedImageTypes.includes(avatarFile.mimetype)) {
        return res.status(400).json({
          error: "Avatar image must be in PNG, JPEG, or JPG format",
        });
      }

      // Handle cloudinary upload for avatar file (similar to your original code)
      try {
        const uploadedAvatar = await cloudinary.uploader.upload(avatarFile.path, {
          folder: "Sunil Portfolio/About/Testimonial/Avatar",
        });

        // Set the new avatar data
        existingTestimonial.avatar = {
          fileName: avatarFile.originalname,
          filePath: uploadedAvatar.secure_url,
          fileType: avatarFile.mimetype,
          publicId: uploadedAvatar.public_id,
        };

        // Delete the previous avatar (if it exists)
        if (prevAvatarPublicId) {
          await cloudinary.uploader.destroy(prevAvatarPublicId);
        }
      } catch (error) {
        console.error("Error uploading avatar image:", error);
        return res.status(500).json({ error: "Avatar image could not be uploaded" });
      }
    }

    // Save the updated testimonial to the database

    // Save the updated post
    const updateTes = await Testimonial.findByIdAndUpdate(testimonialId, existingTestimonial, { new: true });

    res.status(200).json({ message: "Testimonial updated successfully", testimonial: updateTes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { author, position, company, location, content, email, phone, rating, link, cost } = req.body;
    const testimonialId = req.params.id; // Assuming you have the ID of the testimonial to update

    // Find the existing testimonial document by ID
    const existingTestimonial = await Testimonial.findById(testimonialId);

    if (!existingTestimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Check if the user provided a new avatar image
    let avatarData = {};
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar[0];

      // Validate avatar file type
      const acceptedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!acceptedImageTypes.includes(avatarFile.mimetype)) {
        return res.status(400).json({ error: "Avatar image must be in PNG, JPEG, or JPG format" });
      }

      // Handle cloudinary upload for avatar file
      try {
        const uploadedAvatar = await cloudinary.uploader.upload(avatarFile.path, {
          folder: "Sunil Portfolio/About/Testimonial/Avatar",
        });

        avatarData = {
          fileName: avatarFile.originalname,
          filePath: uploadedAvatar.secure_url,
          fileType: avatarFile.mimetype,
          publicId: uploadedAvatar.public_id,
        };
      } catch (error) {
        console.error("Error uploading avatar image:", error);
        return res.status(500).json({ error: "Avatar image could not be uploaded" });
      }
    } else {
      // If no new avatar provided, retain the existing avatar data
      avatarData = existingTestimonial.avatar;
    }

    // Create an object with updated testimonial data
    const updatedTestimonialData = {
      author,
      position,
      company,
      location,
      content,
      email,
      phone,
      rating,
      link,
      cost,
      avatar: avatarData, // Use the new or existing avatar data
      projectDoc: existingTestimonial.projectDoc, // Retain the existing project documentation data
    };

    // Update the testimonial document with the new data
    await existingTestimonial.updateOne(updatedTestimonialData);

    // Find the updated testimonial to send it in the response
    const updatedTestimonial = await Testimonial.findById(testimonialId);

    res.status(200).json({ message: "Testimonial updated successfully", testimonial: updatedTestimonial });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a testimonial by ID
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await Testimonial.findByIdAndRemove(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    // Check if the deleted testimonial has an associated avatar
    if (deletedTestimonial.avatar && deletedTestimonial.avatar.publicId) {
      const avatarPublicId = deletedTestimonial.avatar.publicId;

      // Delete the avatar image from cloudinary
      await cloudinary.uploader.destroy(avatarPublicId);
    }

    // Check if the deleted testimonial has an associated projectDoc
    if (deletedTestimonial.projectDoc && deletedTestimonial.projectDoc.publicId) {
      const projectDocPublicId = deletedTestimonial.projectDoc.publicId;

      // Delete the projectDoc image from cloudinary
      await cloudinary.uploader.destroy(projectDocPublicId);
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    const sendData = testimonials.map((send) => {
      return {
        author: send.author,
        position: send.position,
        company: send.company,
        content: send.content,
        avatar: send.avatar.filePath,
        rating: send.rating,
        link: send.link,
      };
    });
    res.status(200).json(sendData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTestimonialsByAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    const testimonialsWithProjectDoc = testimonials.filter((testimonial) => testimonial.projectDoc);

    res.status(200).json({
      totalTestimonials: testimonials?.length,
      totalTestimonialsWithProjectDoc: testimonialsWithProjectDoc?.length,
      testimonials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getAllTestimonialsByAdmin,
};

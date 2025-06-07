const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");
const ServiceModel = require("../../models/portfolio/ServiceModel");

const createService = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  // Generate a unique slug for the blog post
  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  let slug = originalSlug;
  let suffix = 1;

  while (await ServiceModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/Portfolio/Service",
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

  const data = await ServiceModel.create({
    user: userId,
    title,
    slug: slug,
    description,
    cover: fileData,
  });
  res.status(201).json({ message: "Service Upload successfully", data });
});

const getallService = asyncHandler(async (req, res) => {
  const services = await ServiceModel.find().sort("-createdAt").populate({
    path: "user",
    select: "avatar name email",
  });
  res.status(200).json({
    totalServices: services?.length,
    services,
  });
});

const getService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.findOne({ slug: req.params.slug }).populate({
    path: "user",
    select: "avatar name email",
  });
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.status(200).json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const service = await ServiceModel.findById(id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found. Please ensure you've provided the correct Service information.");
  }

  if (service.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to delete this Service.");
  }

  // Delete the cover from Cloudinary
  if (service.cover && service.cover.publicId) {
    try {
      const result = await cloudinary.uploader.destroy(service.cover.publicId);
      if (result.result !== "ok") {
        res.status(500).json({ message: "Error deleting cover from Cloudinary" });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while deleting the cover image from Cloudinary." });
      return;
    }
  }

  // Delete the cover file from the local device
  /*  if (Service.cover && Service.cover.fileName) {
    const fileName = Service.cover.fileName;
    console.log(fileName);
    const localFilePath = `uploads/${fileName}`;

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    } else {
      return res.status(404).json({ message: "The cover image file does not exist on the local device." });
    }
  }
 */
  await service.deleteOne();
  res.status(200).json({ message: "The Service has been successfully deleted." });
});

const updateService = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  try {
    // Find the existing service
    const service = await ServiceModel.findOne({ slug });

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    let fileData = {};
    let newSlug = service.slug; // Default to existing slug

    // Handle file upload if new file was provided
    if (req.file) {
      // First delete old image if it exists
      if (service.cover && service.cover.publicId) {
        try {
          await cloudinary.uploader.destroy(service.cover.publicId);
        } catch (error) {
          console.error("Error deleting old image:", error);
          // Continue even if deletion fails
        }
      }

      // Upload new image
      try {
        const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
          folder: "Sunil Portfolio/Portfolio/Service",
          resource_type: "image",
        });

        fileData = {
          fileName: req.file.originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.file.mimetype,
          publicId: uploadedFile.public_id,
        };
      } catch (error) {
        return res.status(500).json({ message: "Image could not be uploaded." });
      }
    }

    // Generate new slug only if title was changed
    if (title && title !== service.title) {
      const originalSlug = slugify(title, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
      });

      newSlug = originalSlug;
      let suffix = 1;

      // Check for slug uniqueness
      while (await ServiceModel.findOne({ slug: newSlug, _id: { $ne: service._id } })) {
        newSlug = `${originalSlug}-${suffix}`;
        suffix++;
      }
    }

    // Prepare update data
    const updateData = {
      user: userId,
      title: title || service.title,
      description: description || service.description,
      slug: newSlug,
      ...(Object.keys(fileData).length > 0 && { cover: fileData }),
    };

    // Update the service
    const updatedService = await ServiceModel.findByIdAndUpdate(service._id, updateData, { new: true, runValidators: true });

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "An error occurred while updating the Service.",
      error: error.message,
    });
  }
});

module.exports = {
  createService,
  getallService,
  getService,
  deleteService,
  updateService,
};

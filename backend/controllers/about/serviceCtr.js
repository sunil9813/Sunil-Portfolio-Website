const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");
const ServiceModel = require("../../models/about/ServiceModel");

const createService = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

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
        folder: "Sunil Portfolio/About/Service",
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
  const services = await ServiceModel.find();
  res.status(200).json({
    totalServices: services?.length,
    services,
  });
});

const getService = asyncHandler(async (req, res) => {
  const service = await ServiceModel.findOne({ slug: req.params.slug });
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
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.id;

  let fileData = {};

  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Sunil Portfolio/About/Service",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500).json({ message: "Image could not be uploaded." });
      return;
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      publicId: uploadedFile.public_id,
    };
  }

  try {
    const noteBooktoUpdate = await ServiceModel.findById(id);

    if (!noteBooktoUpdate) {
      res.status(404).json({ message: "Service not found." });
      return;
    }

    // Delete the previous image from Cloudinary if it exists
    if (noteBooktoUpdate.cover && noteBooktoUpdate.cover.publicId) {
      try {
        await cloudinary.uploader.destroy(noteBooktoUpdate.cover.publicId);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting previous cover from Cloudinary." });
        return;
      }
    }

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

    const updateNote = await ServiceModel.findByIdAndUpdate(
      id,
      {
        user: userId,
        slug,
        title,
        description,
        ...(fileData && { cover: fileData }),
      },
      { new: true }
    );

    if (!updateNote) {
      res.status(404).json({ message: "Service not found." });
      return;
    }

    res.status(200).json({ message: "Service updated successfully", data: updateNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while updating the Service." });
  }
});

module.exports = {
  createService,
  getallService,
  getService,
  deleteService,
  updateService,
};

const asyncHandler = require("express-async-handler");
const ProjectModel = require("../../models/project/ProjectModel");
const ProjectIssueModel = require("../../models/project/ProjectIssueModel");
const ProjectDownloadLogModel = require("../../models/project/ProjectDownloadLogModel");
const ProjectLicenseModel = require("../../models/project/ProjectLicenseModel");
const OrderModel = require("../../models/order/OrderModel");
const NotificationModel = require("../../models/product/NotificationModel");
const { CommentModel, RatingModel } = require("../../models/common/CommentsModel");
const crypto = require("crypto");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const AssetLimitConfigModel = require("../../models/project/AssetLimitConfigModel");
const Filter = require("bad-words");
const { updateResourceField } = require("../../utils/updateResourceField");
const { default: ImageModel } = require("../../models/ImageModel");
const { sendAutomatedEmailTrs } = require("../../utils/helpers/mail");

const parseJsonField = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "string") return JSON.parse(value);
  return value;
};

const normalizeIncludedFiles = (value) => {
  const files = parseJsonField(value, []);
  if (!Array.isArray(files)) return [];

  return files
    .map((file) => ({
      title: String(file?.title || "").trim(),
      text: String(file?.text || "").trim(),
    }))
    .filter((file) => file.title || file.text);
};

const normalizeChangelog = (value) => {
  const logs = parseJsonField(value, []);
  if (!Array.isArray(logs)) return [];

  return logs
    .map((log) => ({
      version: String(log?.version || "").trim(),
      title: String(log?.title || "").trim(),
      text: String(log?.text || "").trim(),
      date: log?.date ? new Date(log.date) : undefined,
    }))
    .filter((log) => log.version || log.title || log.text);
};

const normalizeDemoCredentials = (value) => {
  const credentials = parseJsonField(value, {});
  if (!credentials || typeof credentials !== "object") return {};

  return {
    adminEmail: String(credentials.adminEmail || credentials.admin?.email || "").trim(),
    adminPassword: String(credentials.adminPassword || credentials.admin?.password || "").trim(),
    userEmail: String(credentials.userEmail || credentials.user?.email || "").trim(),
    userPassword: String(credentials.userPassword || credentials.user?.password || "").trim(),
  };
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return Boolean(value);
};

const getProjectResourceUrl = (project) => {
  if (project?.resourceFile?.type === "url") return project.resourceFile.url;

  const file = project?.resourceFile?.file || {};
  return file.path || file.filePath || file.url || "";
};

const getProjectResourceLabel = (project) => {
  if (project?.resourceFile?.type === "url") return "External project resource";

  const file = project?.resourceFile?.file || {};
  return file.originalName || file.fileName || project?.title || "Project resource";
};

const getRequestIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip || "").split(",")[0].trim();

const sendSafeProjectEmail = async (options) => {
  try {
    if (!options?.email) return;
    await sendAutomatedEmailTrs(options);
  } catch (error) {
    // Email delivery must never break project purchase, license, or update flows.
  }
};

const getProjectHealth = (project) => {
  const checks = [
    { key: "thumbnail", label: "Thumbnail added", passed: Boolean(project?.thumbnail?.filePath || project?.thumbnail?.url) },
    { key: "assets", label: "Gallery previews added", passed: Array.isArray(project?.assets) ? project.assets.length > 0 : Boolean(project?.assets && Object.keys(project.assets || {}).length) },
    { key: "resource", label: "Download resource attached", passed: Boolean(getProjectResourceUrl(project)) },
    { key: "demo", label: "Live preview URL added", passed: Boolean(project?.urllink) },
    { key: "demoHealth", label: "Demo link not marked broken", passed: !project?.urllink || !["broken", "timeout"].includes(project?.demoStatus?.status) },
    { key: "seo", label: "SEO metadata added", passed: Boolean(project?.seoTitle && project?.seoDescription) },
    { key: "license", label: "License policy added", passed: Boolean(project?.license) },
    { key: "refund", label: "Refund policy added", passed: Boolean(project?.refundPolicy) },
    { key: "delivery", label: "Version and support details added", passed: Boolean(project?.version && project?.supportEmail) },
  ];
  const passed = checks.filter((item) => item.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  const status = score >= 90 ? "Ready" : score >= 65 ? "Needs polish" : "Needs setup";

  return {
    score,
    status,
    checks,
    missing: checks.filter((item) => !item.passed).map((item) => item.label),
  };
};

const getProjectFinalPrice = (project) => {
  const price = Number(project?.price || 0);
  const discount = Number(project?.discount || 0);
  const discountDate = project?.discountDate ? new Date(project.discountDate) : null;
  const hasActiveDiscount = project?.discountShow && discount > 0 && discountDate && discountDate > new Date();

  return Math.max(0, hasActiveDiscount ? price - discount : price);
};

const hasProjectPurchaseAccess = async (project, user) => {
  if (!project || !user?._id) return false;

  if (getProjectFinalPrice(project) <= 0) return true;

  const order = await OrderModel.exists({
    user: user._id,
    status: "paid",
    expiresAt: { $gte: new Date() },
    orderItems: {
      $elemMatch: {
        product: project._id,
        productModel: "Project",
      },
    },
  });

  return Boolean(order);
};

const findProjectPurchaseOrder = async (project, user) => {
  if (!project || !user?._id || getProjectFinalPrice(project) <= 0) return null;

  return OrderModel.findOne({
    user: user._id,
    status: "paid",
    expiresAt: { $gte: new Date() },
    orderItems: {
      $elemMatch: {
        product: project._id,
        productModel: "Project",
      },
    },
  })
    .sort("-paidAt -createdAt")
    .select("_id paidAt createdAt amount orderItems")
    .lean();
};

const createLicenseId = () => `GPL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

const getOrCreateProjectLicense = async ({ project, user, order }) => {
  if (!project?._id || !user?._id || !order?._id || getProjectFinalPrice(project) <= 0) return null;

  let license = await ProjectLicenseModel.findOne({
    project: project._id,
    user: user._id,
    order: order._id,
  });

  if (license) return license;

  let licenseId = createLicenseId();
  while (await ProjectLicenseModel.exists({ licenseId })) {
    licenseId = createLicenseId();
  }

  license = await ProjectLicenseModel.create({
    licenseId,
    project: project._id,
    user: user._id,
    order: order._id,
    usageTerms: project.license,
  });

  await sendSafeProjectEmail({
    email: user.email,
    name: user.name || "there",
    subject: "Your Gorkcoder project license is ready",
    title: "Project license unlocked",
    message: `Your license for <b>${project.title}</b> is ready. License ID: <b>${license.licenseId}</b>. Keep this ID for verification and support.`,
    btnTitle: license.licenseId,
  });

  return license;
};

const getProjectUserDownloadCount = (projectId, userId) => ProjectDownloadLogModel.countDocuments({ project: projectId, user: userId });

const getProjectBuyerOrders = (projectId) =>
  OrderModel.find({
    status: "paid",
    orderItems: {
      $elemMatch: {
        product: projectId,
        productModel: "Project",
      },
    },
  })
    .populate("user", "name email avatar")
    .sort("-paidAt -createdAt")
    .lean();

const notifyProjectBuyers = async ({ project, previousVersion }) => {
  if (!project?._id || !project.notifyBuyersOnUpdate || !previousVersion || previousVersion === project.version) {
    return 0;
  }

  const orders = await getProjectBuyerOrders(project._id);
  const buyerMap = new Map();
  orders.forEach((order) => {
    const userId = String(order.user?._id || order.user || "");
    if (!userId) return;
    buyerMap.set(userId, order.user);
  });
  const buyerIds = [...buyerMap.keys()];

  if (!buyerIds.length) return 0;

  await NotificationModel.insertMany(
    buyerIds.map((userId) => ({
      user: userId,
      type: "info",
      title: "Project updated",
      message: `${project.title} was updated from ${previousVersion} to ${project.version}. You can open the project page to view the latest files and notes.`,
      link: `/project-details/${project.slug}`,
    })),
  );

  await Promise.allSettled(
    [...buyerMap.values()].map((buyer) =>
      sendSafeProjectEmail({
        email: buyer?.email,
        name: buyer?.name || "there",
        subject: `${project.title} has been updated`,
        title: "Project update available",
        message: `<b>${project.title}</b> was updated from <b>${previousVersion}</b> to <b>${project.version}</b>. Open your account or the project page to review the latest notes and files.`,
        btnTitle: "Open project",
      }),
    ),
  );

  return buyerIds.length;
};

const checkUrlReachability = async (url) => {
  if (!url || !/^https?:\/\//i.test(url)) {
    return {
      status: "broken",
      statusCode: 0,
      message: "Missing or invalid URL.",
      checkedAt: new Date(),
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    let response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
    }

    return {
      status: response.ok ? "online" : "broken",
      statusCode: response.status,
      message: response.ok ? "Demo link is reachable." : `Demo returned HTTP ${response.status}.`,
      checkedAt: new Date(),
    };
  } catch (error) {
    return {
      status: error?.name === "AbortError" ? "timeout" : "broken",
      statusCode: 0,
      message: error?.name === "AbortError" ? "Demo check timed out." : error?.message || "Demo link could not be checked.",
      checkedAt: new Date(),
    };
  } finally {
    clearTimeout(timeout);
  }
};

const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    metaDescription,
    category,
    layout,
    urllink,
    tags,
    visibility,
    groupId,
    formats,
    price,
    discount,
    discountDate,
    highlights,
    resourceFile,
    version,
    supportEmail,
    previewVideoUrl,
    maxDownloadsPerUser,
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogImage,
    license,
    refundPolicy,
    notifyBuyersOnUpdate,
    includedFiles,
    demoCredentials,
    showDemoCredentials,
    changelog,
  } = req.body;
  const userId = req.user.id;

  // Profanity check
  const filter = new Filter();
  const fieldsToCheck = [title, description, category, metaDescription];
  for (const field of fieldsToCheck) {
    if (field && filter.isProfane(field)) {
      return res.status(400).json({
        error: "Creation failed because the content contains profane words, and your feedback cannot be posted due to content guidelines.",
      });
    }
  }

  // Required fields
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  if (!category) {
    return res.status(400).json({ error: "Category is required." });
  }

  // Handle thumbnail image
  let thumbnailData = {};
  if (req.files && req.files["thumbnail"] && req.files["thumbnail"][0]) {
    const thumbnailFile = req.files["thumbnail"][0];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(thumbnailFile.mimetype)) {
      return res.status(400).json({ error: "Invalid thumbnail format. Supported formats: JPEG, PNG, JPG." });
    }
    if (thumbnailFile.size > 10 * 1024 * 1024) {
      // Updated to 10MB to match multer
      return res.status(400).json({ error: "Thumbnail size should not exceed 10 MB." });
    }
    try {
      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project/Thumbnails", resource_type: "image" }, (error, result) => {
          if (error) return reject(new Error("Thumbnail upload failed."));
          thumbnailData = {
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          };
          resolve();
        });
        uploadStream.end(thumbnailFile.buffer);
      });
    } catch (error) {
      res.status(500);
      throw new Error("Thumbnail could not be uploaded.");
    }
  } else {
    return res.status(400).json({ error: "Thumbnail is required." });
  }

  // Handle slug
  const originalSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
  let slug = originalSlug;
  let suffix = 1;
  while (await ProjectModel.findOne({ slug })) {
    slug = `${suffix}-${originalSlug}`;
    suffix++;
  }

  // Check asset limit
  const assetLimitConfig = await AssetLimitConfigModel.findOne();
  if (!assetLimitConfig) {
    return res.status(500).json({ message: "Asset limit configuration not found" });
  }
  if (req.files && req.files["assets"] && req.files["assets"].length > assetLimitConfig.assetLimit) {
    return res.status(400).json({ message: `You can only upload ${assetLimitConfig.assetLimit} images.` });
  }

  // Handle assets
  let fileData = [];
  if (req.files && req.files["assets"] && req.files["assets"].length > 0) {
    for (const file of req.files["assets"]) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedImageTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: `Invalid asset format for ${file.originalname}. Supported formats: JPEG, PNG, JPG.` });
      }
      if (file.size > 10 * 1024 * 1024) {
        // Updated to 10MB to match multer
        return res.status(400).json({ error: `Asset ${file.originalname} size should not exceed 10 MB.` });
      }
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project", resource_type: "image" }, (error, result) => {
            if (error) return reject(new Error("Asset upload failed."));
            fileData.push({
              fileName: file.originalname,
              filePath: result.secure_url,
              fileType: file.mimetype,
              publicId: result.public_id,
            });
            resolve();
          });
          uploadStream.end(file.buffer);
        });
      } catch (error) {
        res.status(500);
        throw new Error("One or more images could not be uploaded.");
      }
    }
  }

  // Handle resourceFile
  let resourceFileData = {};
  if (resourceFile) {
    let parsedResourceFile;
    if (typeof resourceFile === "string") {
      try {
        parsedResourceFile = JSON.parse(resourceFile); // Expecting { type: "url", url: "..." } or { type: "file" }
      } catch (error) {
        return res.status(400).json({ error: "Invalid resourceFile format. Must be a valid JSON object." });
      }
    } else {
      parsedResourceFile = resourceFile;
    }
    if (!["url", "file"].includes(parsedResourceFile.type)) {
      return res.status(400).json({ error: "Invalid resourceFile type. Must be 'url' or 'file'." });
    }
    if (parsedResourceFile.type === "url") {
      if (!parsedResourceFile.url || typeof parsedResourceFile.url !== "string") {
        return res.status(400).json({ error: "Resource file URL is required and must be a string." });
      }
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
      if (!urlRegex.test(parsedResourceFile.url)) {
        return res.status(400).json({ error: "Invalid resource file URL format." });
      }
      resourceFileData = { type: "url", url: parsedResourceFile.url };
    } else if (parsedResourceFile.type === "file") {
      if (!req.files || !req.files["resourceFileUpload"] || !req.files["resourceFileUpload"][0]) {
        return res.status(400).json({ error: "Resource file upload is required for type 'file'." });
      }
      const resourceFileUpload = req.files["resourceFileUpload"][0];
      if (resourceFileUpload.size > 100 * 1024 * 1024) {
        return res.status(400).json({ error: "Resource file size should not exceed 100 MB." });
      }
      try {
        await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: "Sunil Portfolio/Project/Resources", resource_type: "auto" }, (error, result) => {
            if (error) return reject(new Error("Resource file upload failed."));
            resourceFileData = {
              type: "file",
              file: {
                path: result.secure_url,
                originalName: resourceFileUpload.originalname,
                size: resourceFileUpload.size,
                mimeType: resourceFileUpload.mimetype,
              },
            };
            resolve();
          });
          uploadStream.end(resourceFileUpload.buffer);
        });
      } catch (error) {
        res.status(500);
        throw new Error("Resource file could not be uploaded.");
      }
    }
  }

  // Handle tags
  let tagsArray = [];
  if (tags) {
    let parsedTags = [];
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags); // Expecting [{ tag: 'css' }, { tag: 'js' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid tags format. Tags must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(tags)) {
      parsedTags = tags;
    } else {
      return res.status(400).json({ error: "Tags must be an array of objects." });
    }
    try {
      tagsArray = parsedTags.map((tagObj) => {
        if (typeof tagObj.tag !== "string" || tagObj.tag.trim() === "") {
          throw new Error("Each tag must be a valid non-empty string inside an object.");
        }
        if (tagObj.tag.length > 50) {
          throw new Error("Each tag cannot exceed 50 characters.");
        }
        return { tag: tagObj.tag.trim() };
      });
      // Check for duplicates
      const tagValues = tagsArray.map((t) => t.tag);
      if (new Set(tagValues).size !== tagValues.length) {
        throw new Error("Duplicate tags are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle formats
  let formatsArray = [];
  if (formats) {
    let parsedFormats = [];
    if (typeof formats === "string") {
      try {
        parsedFormats = JSON.parse(formats); // Expecting [{ format: 'html' }, { format: 'json' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid formats format. Formats must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(formats)) {
      parsedFormats = formats;
    } else {
      return res.status(400).json({ error: "Formats must be an array of objects." });
    }
    try {
      formatsArray = parsedFormats.map((formatObj) => {
        if (typeof formatObj.format !== "string" || formatObj.format.trim() === "") {
          throw new Error("Each format must be a valid non-empty string inside an object.");
        }
        if (formatObj.format.length > 50) {
          throw new Error("Each format cannot exceed 50 characters.");
        }
        return { format: formatObj.format.trim() };
      });
      // Check for duplicates
      const formatValues = formatsArray.map((f) => f.format);
      if (new Set(formatValues).size !== formatValues.length) {
        throw new Error("Duplicate formats are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle highlights
  let highlightsArray = [];
  if (highlights) {
    let parsedHighlights = [];
    if (typeof highlights === "string") {
      try {
        parsedHighlights = JSON.parse(highlights); // Expecting [{ highlight: 'feature1' }, { highlight: 'feature2' }]
      } catch (error) {
        return res.status(400).json({ error: "Invalid highlights format. Highlights must be a valid JSON array of objects." });
      }
    } else if (Array.isArray(highlights)) {
      parsedHighlights = highlights;
    } else {
      return res.status(400).json({ error: "Highlights must be an array of objects." });
    }
    try {
      highlightsArray = parsedHighlights.map((highlightObj) => {
        if (typeof highlightObj.highlight !== "string" || highlightObj.highlight.trim() === "") {
          throw new Error("Each highlight must be a valid non-empty string inside an object.");
        }
        if (highlightObj.highlight.length > 100) {
          throw new Error("Each highlight cannot exceed 100 characters.");
        }
        return { highlight: highlightObj.highlight.trim() };
      });
      // Check for duplicates
      const highlightValues = highlightsArray.map((h) => h.highlight);
      if (new Set(highlightValues).size !== highlightValues.length) {
        throw new Error("Duplicate highlights are not allowed.");
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Handle price and discount
  let finalPrice = price ? parseFloat(price) : 0;
  let finalDiscount = discount ? parseFloat(discount) : 0;
  let finalDiscountDate = discountDate ? new Date(discountDate) : null;
  let finalDiscountShow = false;

  if (finalDiscount > 0) {
    if (!discountDate) {
      return res.status(400).json({ error: "Discount date is required when a discount is provided." });
    }
    if (isNaN(finalDiscountDate) || finalDiscountDate <= new Date()) {
      return res.status(400).json({ error: "Discount date must be a valid future date." });
    }
    if (finalDiscount >= finalPrice) {
      return res.status(400).json({ error: "Discount cannot be greater than or equal to the price." });
    }
    finalDiscountShow = true;
  } else {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Check if discountDate is in the past
  if (finalDiscountDate && finalDiscountDate <= new Date()) {
    finalDiscount = 0;
    finalDiscountDate = null;
    finalDiscountShow = false;
  }

  // Create project
  const data = await ProjectModel.create({
    user: userId,
    title,
    slug,
    description,
    metaDescription,
    category,
    visibility,
    layout,
    urllink,
    groupId,
    price: finalPrice,
    discount: finalDiscount,
    discountDate: finalDiscountDate,
    discountShow: finalDiscountShow,
    assets: fileData,
    tags: tagsArray,
    formats: formatsArray,
    highlights: highlightsArray,
    version: version || "v1.0",
    supportEmail,
    previewVideoUrl,
    maxDownloadsPerUser: Number(maxDownloadsPerUser || 20),
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogImage,
    license,
    refundPolicy,
    notifyBuyersOnUpdate: normalizeBoolean(notifyBuyersOnUpdate),
    includedFiles: normalizeIncludedFiles(includedFiles),
    demoCredentials: normalizeDemoCredentials(demoCredentials),
    showDemoCredentials: normalizeBoolean(showDemoCredentials),
    changelog: normalizeChangelog(changelog),
    thumbnail: thumbnailData,
    resourceFile: resourceFileData,
  });
  console.log(data);

  res.status(201).json({ message: "Project created successfully", data });
});

const getallProjectofUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const posts = await ProjectModel.find({ user: userId })
      .populate("user")
      .populate({
        path: "user",
        select: "avatar name email",
      })
      .populate("category");
    res.status(200).json({ total: posts.length, posts });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching user's posts." });
  }
});

const getProjectPrivate = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400);
    throw new Error("Project slug is required in the request.");
  }

  // Get the logged-in user from the request (assuming JWT authentication)
  const loggedInUser = req.user;

  // Find the project by slug and populate related fields
  const project = await ProjectModel.findOne({ slug })
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "category",
      select: "type title",
    });

  if (!project) {
    res.status(404);
    throw new Error("Project not found. Please check the provided slug.");
  }

  // Check if the logged-in user is the creator or an admin
  if (project.user.toString() !== loggedInUser._id.toString() && loggedInUser.role !== "admin" && loggedInUser.role !== "super admin") {
    res.status(403);
    throw new Error("You are not authorized to access this project.");
  }

  // Extract image URLs from the project description (assuming HTML content)
  const usedImageUrls = [];
  const descriptionHtml = project.description || "";
  const imgTagRegex = /<img[^>]+src=["'](.*?)["']/gi;
  let match;
  while ((match = imgTagRegex.exec(descriptionHtml)) !== null) {
    usedImageUrls.push(match[1]); // match[1] is the src value
  }

  // Fetch all images related to the project by groupId (for unused images)
  const allImagesForBlog = await ImageModel.find({ groupId: project.groupId }).select("filePath fileName fileType publicId folder createdAt");

  // Fetch used images by filePath, regardless of groupId
  const usedImages = await ImageModel.find({ filePath: { $in: usedImageUrls } }).select("filePath fileName fileType publicId folder createdAt groupId");

  // Filter unused images: images with this blog's groupId but not in the description
  const unusedImages = allImagesForBlog.filter((image) => !usedImageUrls.includes(image.filePath));

  // Combine blog data with used and unused images
  const projectWithImages = {
    ...project.toObject(), // Convert Mongoose document to plain JS object
    usedImages: usedImages || [], // Images actually used in description, regardless of groupId
    unusedImages: unusedImages || [], // Images uploaded for this blog but not used
  };

  res.status(200).json(projectWithImages);
});

// remove it
const getallProject = asyncHandler(async (req, res) => {
  const posts = await ProjectModel.find({})
    .populate("user")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate({
      path: "likes",
      select: "avatar name email",
    })
    .populate("category")
    .sort("-createdAt");
  res.status(201).json({ total: posts.length, posts });
});

// with pagination
const getallProjects = asyncHandler(async (req, res) => {
  let filter = {};

  // Check if there's a category filter in the query parameters
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Check if there's a title search in the query parameters
  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: "i" };
  }

  // Pagination configuration
  const perPage = 5; // Number of posts per page
  const page = parseInt(req.query.page) || 1; // Current page number

  const totalPosts = await ProjectModel.countDocuments(filter);
  const totalPages = Math.ceil(totalPosts / perPage);

  const skip = (page - 1) * perPage;

  const posts = await ProjectModel.find(filter).skip(skip).limit(perPage);

  res.status(200).json({
    totalPosts,
    totalPages,
    currentPage: page,
    posts,
  });
});

const getProject = asyncHandler(async (req, res) => {
  const post = await ProjectModel.findOne({ slug: req.params.slug })
    .populate("user")
    .populate({
      path: "user",
      select: "avatar name email",
    })
    .populate("category");
  if (!post) {
    res.status(404);
    throw new Error("Posts not found");
  }
  post.numOfViews += 1;
  await post.save();

  res.status(200).json(post);
});

const deleteProject = asyncHandler(async (req, res) => {
  let postId;

  // Retrieve post ID from body or params
  if (req.body && req.body.id) {
    postId = req.body.id;
  } else if (req.params && req.params.id) {
    postId = req.params.id;
  }

  if (!postId) {
    res.status(400);
    throw new Error("Project ID is required in the request.");
  }

  // Find the project
  const project = await ProjectModel.findOne({ _id: postId });
  if (!project) {
    res.status(404);
    throw new Error("Project not found. Please check the provided information.");
  }

  // Check authorization
  if (project.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to delete this project.");
  }

  // Delete thumbnail from Cloudinary if it exists
  if (project.thumbnail && project.thumbnail.publicId) {
    try {
      // console.log(`Attempting to delete thumbnail from Cloudinary with publicId: ${project.thumbnail.publicId}`);
      const result = await cloudinary.uploader.destroy(project.thumbnail.publicId);
      if (result.result !== "ok") {
        // console.error(`Failed to delete thumbnail ${project.thumbnail.publicId} from Cloudinary: ${JSON.stringify(result)}`);
        res.status(500).json({ message: "Error deleting thumbnail from Cloudinary" });
        return;
      }
      //console.log(`Successfully deleted thumbnail ${project.thumbnail.publicId} from Cloudinary`);
    } catch (error) {
      // console.error(`Error deleting thumbnail from Cloudinary: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting the thumbnail from Cloudinary." });
      return;
    }
  }

  // Delete assets from Cloudinary
  const imagePublicIds = project.assets.map((asset) => asset.publicId).filter(Boolean);
  if (imagePublicIds.length > 0) {
    try {
      for (const publicId of imagePublicIds) {
        //console.log(`Attempting to delete asset from Cloudinary with publicId: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== "ok") {
          res.status(500).json({ message: "Error deleting asset from Cloudinary" });
          return;
          // console.error(`Failed to delete asset ${publicId} from Cloudinary: ${JSON.stringify(result)}`);
          // Continue with other deletions
        }
      }
    } catch (error) {
      //console.error(`Error deleting assets from Cloudinary: ${error.message}`);
      res.status(500).json({ message: "An error occurred while deleting project assets from Cloudinary." });
      return;
    }
  }

  // Delete the project from MongoDB
  await project.deleteOne();
  res.status(200).json({ message: "Project and associated images deleted successfully" });
});
const updateProject = asyncHandler(async (req, res) => {
  const projectSlug = req.params.slug;

  const {
    title,
    description,
    metaDescription,
    category,
    layout,
    urllink,
    tags,
    visibility,
    groupId,
    formats,
    price,
    discount,
    discountDate,
    highlights,
    resourceFile,
    existingAssets,
    version,
    supportEmail,
    previewVideoUrl,
    maxDownloadsPerUser,
    seoTitle,
    seoDescription,
    canonicalUrl,
    ogImage,
    license,
    refundPolicy,
    notifyBuyersOnUpdate,
    includedFiles,
    demoCredentials,
    showDemoCredentials,
    changelog,
  } = req.body;

  const post = await ProjectModel.findOne({ slug: projectSlug });

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  const previousVersion = post.version || "v1.0";
  const previousDemoUrl = post.urllink || "";

  if (post.user.toString() !== req.user._id.toString() && req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(403).json({ message: "You are not authorized to update this post." });
  }

  if (title && title !== post.title) {
    const originalSlug = slugify(title, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
      strict: true,
    });

    let newSlug = originalSlug;
    let suffix = 1;

    while (await ProjectModel.findOne({ slug: newSlug, _id: { $ne: post._id } })) {
      newSlug = `${suffix}-${originalSlug}`;
      suffix++;
    }

    post.slug = newSlug;
  }

  if (req.files?.thumbnail?.[0]) {
    const thumbnailFile = req.files.thumbnail[0];

    if (post.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(post.thumbnail.publicId);
    }

    const thumbnailData = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Sunil Portfolio/Project/Thumbnails",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);

          resolve({
            fileName: thumbnailFile.originalname,
            filePath: result.secure_url,
            fileType: thumbnailFile.mimetype,
            publicId: result.public_id,
          });
        },
      );

      uploadStream.end(thumbnailFile.buffer);
    });

    post.thumbnail = thumbnailData;
  }

  let keptAssets = Array.isArray(post.assets) ? post.assets : [];

  if (existingAssets !== undefined) {
    keptAssets = typeof existingAssets === "string" ? JSON.parse(existingAssets || "[]") : existingAssets;
  }

  const oldAssets = Array.isArray(post.assets) ? post.assets : [];
  const keptPublicIds = keptAssets.map((asset) => asset.publicId).filter(Boolean);
  const removedAssets = oldAssets.filter((asset) => asset.publicId && !keptPublicIds.includes(asset.publicId));

  for (const asset of removedAssets) {
    await cloudinary.uploader.destroy(asset.publicId);
  }

  const newAssets = [];

  if (req.files?.assets?.length > 0) {
    const assetLimitConfig = await AssetLimitConfigModel.findOne();
    const maxAssets = assetLimitConfig?.assetLimit || 5;

    if (keptAssets.length + req.files.assets.length > maxAssets) {
      return res.status(400).json({ message: `You can only upload ${maxAssets} images.` });
    }

    for (const file of req.files.assets) {
      const assetData = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Sunil Portfolio/Project",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);

            resolve({
              fileName: file.originalname,
              filePath: result.secure_url,
              fileType: file.mimetype,
              publicId: result.public_id,
            });
          },
        );

        uploadStream.end(file.buffer);
      });

      newAssets.push(assetData);
    }
  }

  post.assets = [...keptAssets, ...newAssets];

  if (resourceFile !== undefined) {
    const parsedResourceFile = typeof resourceFile === "string" ? JSON.parse(resourceFile) : resourceFile;

    if (parsedResourceFile?.type === "url") {
      post.resourceFile = {
        type: "url",
        url: parsedResourceFile.url,
      };
    }

    if (parsedResourceFile?.type === "file" && req.files?.resourceFileUpload?.[0]) {
      const resourceUpload = req.files.resourceFileUpload[0];

      const resourceFileData = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Sunil Portfolio/Project/Resources",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);

            resolve({
              type: "file",
              file: {
                path: result.secure_url,
                publicId: result.public_id,
                originalName: resourceUpload.originalname,
                size: resourceUpload.size,
                mimeType: resourceUpload.mimetype,
              },
            });
          },
        );

        uploadStream.end(resourceUpload.buffer);
      });

      post.resourceFile = resourceFileData;
    }
  }

  if (tags !== undefined) {
    const parsedTags = typeof tags === "string" ? JSON.parse(tags || "[]") : tags;
    post.tags = parsedTags.map((item) => ({ tag: String(item.tag).trim() }));
  }

  if (formats !== undefined) {
    const parsedFormats = typeof formats === "string" ? JSON.parse(formats || "[]") : formats;
    post.formats = parsedFormats.map((item) => ({ format: String(item.format).trim() }));
  }

  if (highlights !== undefined) {
    const parsedHighlights = typeof highlights === "string" ? JSON.parse(highlights || "[]") : highlights;
    post.highlights = parsedHighlights.map((item) => ({ highlight: String(item.highlight).trim() }));
  }

  if (title !== undefined) post.title = title;
  if (description !== undefined) post.description = description;
  if (metaDescription !== undefined) post.metaDescription = metaDescription;
  if (category !== undefined) post.category = category;
  if (layout !== undefined) post.layout = layout;
  if (urllink !== undefined) {
    post.urllink = urllink;
    if (String(previousDemoUrl || "") !== String(urllink || "")) {
      post.demoStatus = {
        status: "unknown",
        statusCode: 0,
        message: "Demo URL changed. Please run a fresh check.",
        checkedAt: null,
      };
    }
  }
  if (visibility !== undefined) post.visibility = visibility;
  if (groupId !== undefined) post.groupId = groupId;
  if (version !== undefined) post.version = version || "v1.0";
  if (supportEmail !== undefined) post.supportEmail = supportEmail;
  if (previewVideoUrl !== undefined) post.previewVideoUrl = previewVideoUrl;
  if (maxDownloadsPerUser !== undefined) post.maxDownloadsPerUser = Math.max(1, Number(maxDownloadsPerUser || 20));
  if (seoTitle !== undefined) post.seoTitle = seoTitle;
  if (seoDescription !== undefined) post.seoDescription = seoDescription;
  if (canonicalUrl !== undefined) post.canonicalUrl = canonicalUrl;
  if (ogImage !== undefined) post.ogImage = ogImage;
  if (license !== undefined) post.license = license;
  if (refundPolicy !== undefined) post.refundPolicy = refundPolicy;
  if (notifyBuyersOnUpdate !== undefined) post.notifyBuyersOnUpdate = normalizeBoolean(notifyBuyersOnUpdate);
  if (includedFiles !== undefined) post.includedFiles = normalizeIncludedFiles(includedFiles);
  if (demoCredentials !== undefined) post.demoCredentials = normalizeDemoCredentials(demoCredentials);
  if (showDemoCredentials !== undefined) post.showDemoCredentials = normalizeBoolean(showDemoCredentials);
  if (changelog !== undefined) post.changelog = normalizeChangelog(changelog);

  if (price !== undefined) post.price = parseFloat(price) || 0;

  if (discount !== undefined) {
    const finalDiscount = parseFloat(discount) || 0;
    post.discount = finalDiscount;

    if (finalDiscount > 0) {
      if (!discountDate) {
        return res.status(400).json({ message: "Discount date is required." });
      }

      post.discountDate = new Date(discountDate);
      post.discountShow = true;
    } else {
      post.discountDate = null;
      post.discountShow = false;
    }
  }

  post.markModified("thumbnail");
  post.markModified("assets");
  post.markModified("resourceFile");
  post.markModified("tags");
  post.markModified("formats");
  post.markModified("highlights");
  post.markModified("includedFiles");
  post.markModified("demoCredentials");
  post.markModified("changelog");
  post.markModified("demoStatus");

  const updatedProject = await post.save();
  const notifiedBuyers = await notifyProjectBuyers({ project: updatedProject, previousVersion });

  res.status(200).json({
    message: "Project updated successfully",
    data: updatedProject,
    notifiedBuyers,
  });
});

const downloadProjectResource = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const hasAccess = await hasProjectPurchaseAccess(project, req.user);

  if (!hasAccess) {
    res.status(getProjectFinalPrice(project) > 0 ? 402 : 401);
    throw new Error(getProjectFinalPrice(project) > 0 ? "Please purchase this project to download its resources." : "Please login to download this resource.");
  }

  if ((project.downloadAccessRevokedUsers || []).some((userId) => String(userId) === String(req.user._id))) {
    res.status(403);
    throw new Error("Your download access for this project has been revoked. Please contact support.");
  }

  const downloadCountForUser = await getProjectUserDownloadCount(project._id, req.user._id);
  const maxDownloads = Math.max(1, Number(project.maxDownloadsPerUser || 20));

  if (downloadCountForUser >= maxDownloads) {
    res.status(429);
    throw new Error(`Download limit reached for this project. Please contact support if you need another download.`);
  }

  const url = getProjectResourceUrl(project);

  if (!url) {
    res.status(404);
    throw new Error("No downloadable resource is attached to this project.");
  }

  project.downloadCount = Number(project.downloadCount || 0) + 1;
  await project.save();

  const order = await findProjectPurchaseOrder(project, req.user);
  const license = await getOrCreateProjectLicense({ project, user: req.user, order });
  await ProjectDownloadLogModel.create({
    project: project._id,
    user: req.user._id,
    order: order?._id,
    resourceType: project?.resourceFile?.type || "unknown",
    resourceLabel: getProjectResourceLabel(project),
    ipAddress: getRequestIp(req),
    userAgent: req.headers["user-agent"],
  });

  res.status(200).json({
    success: true,
    url,
    resourceFile: project.resourceFile,
    downloadCount: project.downloadCount,
    userDownloadCount: downloadCountForUser + 1,
    remainingDownloads: Math.max(0, maxDownloads - downloadCountForUser - 1),
    license,
  });
});

const getProjectAccess = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).select("title slug thumbnail price discount discountShow discountDate resourceFile license refundPolicy version supportEmail maxDownloadsPerUser downloadAccessRevokedUsers").lean();

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const price = getProjectFinalPrice(project);
  const order = await findProjectPurchaseOrder(project, req.user);
  const isFree = price <= 0;
  const isRevoked = (project.downloadAccessRevokedUsers || []).some((userId) => String(userId) === String(req.user._id));
  const hasAccess = !isRevoked && (isFree || Boolean(order));
  const userDownloadCount = await getProjectUserDownloadCount(project._id, req.user._id);
  const maxDownloads = Math.max(1, Number(project.maxDownloadsPerUser || 20));
  const license = hasAccess && order ? await getOrCreateProjectLicense({ project, user: req.user, order }) : null;

  res.status(200).json({
    success: true,
    project: {
      _id: project._id,
      title: project.title,
      slug: project.slug,
      thumbnail: project.thumbnail,
      price,
      version: project.version,
      supportEmail: project.supportEmail,
      licenseText: project.license,
      refundPolicy: project.refundPolicy,
    },
    hasAccess,
    isFree,
    isRevoked,
    purchase: order
      ? {
          orderId: order._id,
          paidAt: order.paidAt || order.createdAt,
          amount: order.amount,
        }
      : null,
    license,
    downloads: {
      used: userDownloadCount,
      limit: maxDownloads,
      remaining: Math.max(0, maxDownloads - userDownloadCount),
    },
  });
});

const verifyProjectLicense = asyncHandler(async (req, res) => {
  const license = await ProjectLicenseModel.findOne({ licenseId: req.params.licenseId }).populate("project", "title slug thumbnail").populate("user", "name email").populate("order", "paidAt amount status").lean();

  if (!license) {
    res.status(404);
    throw new Error("Project license not found.");
  }

  res.status(200).json({
    success: true,
    license,
  });
});

const reportProjectIssue = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const message = String(req.body?.message || "").trim();
  const issueType = ["broken-link", "wrong-files", "payment-access", "other"].includes(req.body?.issueType) ? req.body.issueType : "other";

  if (!message) {
    res.status(400);
    throw new Error("Please write the issue before submitting.");
  }

  const issue = await ProjectIssueModel.create({
    project: project._id,
    user: req.user?._id,
    issueType,
    message,
    pageUrl: req.body?.pageUrl,
  });

  res.status(201).json({
    success: true,
    message: "Thanks, your project issue was submitted.",
    issue,
  });
});

const getProjectReports = asyncHandler(async (req, res) => {
  const reports = await ProjectIssueModel.find({})
    .populate("project", "title slug thumbnail price discount discountShow discountDate")
    .populate("user", "name email avatar")
    .sort("-createdAt");

  res.status(200).json({
    total: reports.length,
    reports,
  });
});

const updateProjectReportStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = ["pending", "resolved", "dismissed"];
  const status = allowedStatuses.includes(req.body?.status) ? req.body.status : "";

  if (!status) {
    res.status(400);
    throw new Error("Invalid report status.");
  }

  const report = await ProjectIssueModel.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate("project", "title slug thumbnail price discount discountShow discountDate")
    .populate("user", "name email avatar");

  if (!report) {
    res.status(404);
    throw new Error("Project report not found.");
  }

  res.status(200).json({
    success: true,
    report,
  });
});

const getProjectAdminAnalytics = asyncHandler(async (req, res) => {
  const [projects, commentStats, ratingStats, reportStats, paidOrders] = await Promise.all([
    ProjectModel.find({})
      .populate("category", "title")
      .select("title slug thumbnail assets category price discount discountShow discountDate numOfViews downloadCount likes reviews createdAt urllink demoStatus resourceFile seoTitle seoDescription license refundPolicy version supportEmail")
      .sort("-numOfViews -downloadCount -createdAt")
      .lean(),
    CommentModel.aggregate([{ $match: { resourceType: "Project" } }, { $group: { _id: "$resourceId", count: { $sum: 1 } } }]),
    RatingModel.aggregate([{ $match: { resourceType: "Project" } }, { $group: { _id: "$resourceId", averageRating: { $avg: "$rating" }, ratingCount: { $sum: 1 } } }]),
    ProjectIssueModel.aggregate([{ $group: { _id: "$project", count: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } } } }]),
    OrderModel.find({ status: "paid", "orderItems.productModel": "Project" }).select("orderItems amount createdAt").lean(),
  ]);

  const commentMap = new Map(commentStats.map((item) => [String(item._id), item.count]));
  const ratingMap = new Map(ratingStats.map((item) => [String(item._id), item]));
  const reportMap = new Map(reportStats.map((item) => [String(item._id), item]));
  const purchaseMap = new Map();

  paidOrders.forEach((order) => {
    (order.orderItems || []).forEach((item) => {
      if (item.productModel !== "Project") return;
      const key = String(item.product);
      const current = purchaseMap.get(key) || { purchases: 0, revenue: 0 };
      current.purchases += Number(item.quantity || 1);
      current.revenue += Number(item.price || 0) * Number(item.quantity || 1);
      purchaseMap.set(key, current);
    });
  });

  const rows = projects.map((project) => {
    const id = String(project._id);
    const purchases = purchaseMap.get(id)?.purchases || 0;
    const views = Number(project.numOfViews || 0);

    return {
      ...project,
      commentsCount: commentMap.get(id) || 0,
      averageRating: Number((ratingMap.get(id)?.averageRating || 0).toFixed(1)),
      ratingCount: ratingMap.get(id)?.ratingCount || 0,
      reportsCount: reportMap.get(id)?.count || 0,
      pendingReports: reportMap.get(id)?.pending || 0,
      purchases,
      revenue: purchaseMap.get(id)?.revenue || 0,
      conversionRate: views > 0 ? Number(((purchases / views) * 100).toFixed(1)) : 0,
      likesCount: Array.isArray(project.likes) ? project.likes.length : 0,
      health: getProjectHealth(project),
    };
  });

  res.status(200).json({
    total: rows.length,
    totals: {
      views: rows.reduce((sum, item) => sum + Number(item.numOfViews || 0), 0),
      downloads: rows.reduce((sum, item) => sum + Number(item.downloadCount || 0), 0),
      comments: rows.reduce((sum, item) => sum + Number(item.commentsCount || 0), 0),
      purchases: rows.reduce((sum, item) => sum + Number(item.purchases || 0), 0),
      revenue: rows.reduce((sum, item) => sum + Number(item.revenue || 0), 0),
      pendingReports: rows.reduce((sum, item) => sum + Number(item.pendingReports || 0), 0),
    },
    projects: rows,
  });
});

const checkProjectDemoLink = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  if (!project.urllink) {
    res.status(400);
    throw new Error("This project does not have a live preview URL.");
  }

  const demoStatus = await checkUrlReachability(project.urllink);
  project.demoStatus = demoStatus;
  await project.save();

  res.status(200).json({
    success: true,
    message: demoStatus.message,
    demoStatus,
    health: getProjectHealth(project),
    project: {
      _id: project._id,
      title: project.title,
      slug: project.slug,
      demoStatus,
      health: getProjectHealth(project),
    },
  });
});

const getProjectPendingReportCount = asyncHandler(async (req, res) => {
  const pendingReports = await ProjectIssueModel.countDocuments({ status: "pending" });

  res.status(200).json({
    success: true,
    pendingReports,
  });
});

const getProjectBuyers = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).select("title slug downloadAccessRevokedUsers").lean();

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const orders = await getProjectBuyerOrders(project._id);
  const buyers = orders.map((order) => {
    const orderItem = (order.orderItems || []).find((item) => String(item.product) === String(project._id) && item.productModel === "Project");

    return {
      orderId: order._id,
      user: order.user,
      paidAt: order.paidAt || order.createdAt,
      amount: order.amount,
      itemPrice: orderItem?.price || 0,
      quantity: orderItem?.quantity || 1,
      accessRevoked: (project.downloadAccessRevokedUsers || []).some((userId) => String(userId) === String(order.user?._id || order.user)),
    };
  });

  res.status(200).json({
    success: true,
    project,
    total: buyers.length,
    buyers,
  });
});

const getProjectDownloadLogs = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).select("title slug").lean();

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const logs = await ProjectDownloadLogModel.find({ project: project._id }).populate("user", "name email avatar").populate("order", "amount paidAt status").sort("-createdAt").limit(100).lean();

  res.status(200).json({
    success: true,
    project,
    total: logs.length,
    logs,
  });
});

const updateProjectDownloadAccess = asyncHandler(async (req, res) => {
  const revoked = normalizeBoolean(req.body?.revoked);
  const project = await ProjectModel.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found.");
  }

  const update = revoked
    ? { $addToSet: { downloadAccessRevokedUsers: req.params.userId } }
    : { $pull: { downloadAccessRevokedUsers: req.params.userId } };

  const updatedProject = await ProjectModel.findByIdAndUpdate(project._id, update, { new: true }).select("title downloadAccessRevokedUsers");

  await ProjectLicenseModel.updateMany(
    {
      project: project._id,
      user: req.params.userId,
    },
    revoked
      ? {
          status: "revoked",
          revokedAt: new Date(),
          revokedReason: req.body?.reason || "Download access revoked by admin.",
        }
      : {
          status: "active",
          revokedAt: null,
          revokedReason: "",
        },
  );

  res.status(200).json({
    success: true,
    project: updatedProject,
    revoked,
  });
});
const updateProjectFeaturedStatus = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { featured } = req.body;

  try {
    const updatedProject = await updateResourceField({
      resourceId: projectId,
      fieldName: "featured",
      fieldValue: featured,
      validateField: (value) => {
        if (typeof value !== "boolean") {
          return "The 'featured' field must be a boolean.";
        }
        return null;
      },
      Model: ProjectModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Project",
    });

    res.status(200).json({
      message: "Project featured status updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

const updateProjectVisibility = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { visibility } = req.body;

  try {
    const updatedProject = await updateResourceField({
      resourceId: projectId,
      fieldName: "visibility",
      fieldValue: visibility,
      validateField: (value) => {
        if (!["public", "private"].includes(value)) {
          return "Visibility must be either 'public' or 'private'.";
        }
        return null;
      },
      Model: ProjectModel,
      user: req.user,
      userIdField: "user",
      resourceName: "Project",
    });

    res.status(200).json({
      message: "Project visibility updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    res.status(error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 403).json({
      error: error.message,
    });
  }
});

module.exports = {
  createProject,
  getallProjectofUser,
  getallProject,
  getallProjects,
  getProject,
  deleteProject,
  updateProject,
  updateProjectFeaturedStatus,
  updateProjectVisibility,
  getProjectPrivate,
  downloadProjectResource,
  reportProjectIssue,
  getProjectReports,
  updateProjectReportStatus,
  getProjectAdminAnalytics,
  getProjectPendingReportCount,
  getProjectBuyers,
  getProjectDownloadLogs,
  getProjectAccess,
  verifyProjectLicense,
  updateProjectDownloadAccess,
  checkProjectDemoLink,
};

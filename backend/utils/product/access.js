const path = require("path");
const OrderModel = require("../../models/order/OrderModel");
const SubjectModel = require("../../models/educationModel/SubjectModel");
const ProjectModel = require("../../models/project/ProjectModel");

const PRODUCT_CONFIG = {
  course: { name: "Subject", model: SubjectModel },
  courses: { name: "Subject", model: SubjectModel },
  subject: { name: "Subject", model: SubjectModel },
  project: { name: "Project", model: ProjectModel },
};

const normalizeProductType = (type = "") => PRODUCT_CONFIG[String(type).toLowerCase()] || null;

const getResourceUrl = (product, productModel) => {
  if (!product) return "";

  if (productModel === "Project") {
    if (product.resourceFile?.type === "url") return product.resourceFile.url || "";
    return product.resourceFile?.file?.filePath || product.resourceFile?.file?.url || "";
  }

  const firstResource = product.resourceFiles?.[0];
  return firstResource?.filePath || firstResource?.url || product.resourceFile?.filePath || product.resourceFile?.url || "";
};

const userOwnsProduct = async ({ userId, productId, productModel }) => {
  if (!userId || !productId || !productModel) return false;

  const order = await OrderModel.findOne({
    user: userId,
    status: "paid",
    expiresAt: { $gte: new Date() },
    "orderItems.product": productId,
    "orderItems.productModel": productModel,
  }).select("_id");

  return Boolean(order);
};

const isSafeLocalUploadPath = (fileUrl = "") => {
  if (!fileUrl || /^https?:\/\//i.test(fileUrl)) return false;

  const normalized = fileUrl.replace(/\\/g, "/");
  return normalized.startsWith("/uploads/") || normalized.startsWith("uploads/");
};

const resolveUploadPath = (fileUrl = "") => {
  const relativePath = fileUrl.replace(/\\/g, "/").replace(/^\/+/, "");
  const uploadsRoot = path.resolve(__dirname, "../../uploads");
  const resolvedPath = path.resolve(__dirname, "../../", relativePath);

  if (!resolvedPath.startsWith(uploadsRoot)) {
    return "";
  }

  return resolvedPath;
};

module.exports = {
  normalizeProductType,
  getResourceUrl,
  userOwnsProduct,
  isSafeLocalUploadPath,
  resolveUploadPath,
};

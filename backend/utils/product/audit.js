const AuditLogModel = require("../../models/product/AuditLogModel");

const writeAuditLog = async ({ req, action, entityType = "", entityId = null, message = "", metadata = {} }) => {
  try {
    await AuditLogModel.create({
      actor: req?.user?._id || null,
      action,
      entityType,
      entityId,
      message,
      metadata,
      ip: req?.ip || "",
    });
  } catch (error) {
    // Audit logging should never break the main user/admin action.
  }
};

module.exports = { writeAuditLog };

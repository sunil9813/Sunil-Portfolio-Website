const express = require("express");
const { admin, protect } = require("../../middleware/authMiddleware");
const {
  adminCreateNotification,
  adminAnswerQuestion,
  adminListAuditLogs,
  adminListAbandonedCarts,
  adminListBundles,
  adminListDownloads,
  adminListPaymentEvents,
  adminListPlans,
  adminListQuestions,
  adminListReviews,
  adminListTickets,
  adminListRefundRequests,
  adminUpdateReview,
  adminUpdateRefundRequest,
  adminUpdateTicket,
  adminUpsertBundle,
  adminUpsertPlan,
  createProductReview,
  createProductQuestion,
  createRefundRequest,
  createSecureDownloadLink,
  createSupportTicket,
  downloadWithToken,
  exportOrdersCsv,
  exportPaymentEventsCsv,
  exportUsersCsv,
  getAdminAnalytics,
  getCourseProgress,
  getCertificateDocument,
  getInvoiceDocument,
  verifyInvoice,
  searchInvoice,
  resendInvoiceEmail,
  getMyAbandonedCart,
  getMyCertificates,
  getMyDownloads,
  getMyRefundRequests,
  getMyNotifications,
  getMySupportTickets,
  getProductReviews,
  getProductQuestions,
  getPublicBusiness,
  verifyCertificate,
  markNotificationRead,
  previewEmailTemplate,
  replySupportTicket,
  saveCartAbandonment,
  secureDownload,
  updateCourseProgress,
} = require("../../controllers/product/BusinessController");

const router = express.Router();

router.get("/public", getPublicBusiness);

router.get("/notifications", protect, getMyNotifications);
router.patch("/notifications/:id/read", protect, markNotificationRead);

router.get("/reviews/:productType/:productId", getProductReviews);
router.post("/reviews/:productType/:productId", protect, createProductReview);

router.get("/questions/:productType/:productId", getProductQuestions);
router.post("/questions/:productType/:productId", protect, createProductQuestion);

router.get("/progress/:subjectId", protect, getCourseProgress);
router.patch("/progress/:subjectId", protect, updateCourseProgress);

router.get("/download/:productType/:productId", protect, secureDownload);
router.get("/download-link/:productType/:productId", protect, createSecureDownloadLink);
router.get("/download-token/:token", downloadWithToken);
router.get("/invoice/search", searchInvoice);
router.get("/invoice/verify/:orderId", verifyInvoice);
router.get("/invoice/:orderId", protect, getInvoiceDocument);
router.post("/invoice/:orderId/resend", protect, resendInvoiceEmail);
router.get("/certificate/verify/:certificateId", verifyCertificate);
router.get("/certificate/:subjectId", protect, getCertificateDocument);
router.get("/certificates/me", protect, getMyCertificates);
router.get("/downloads/me", protect, getMyDownloads);

router.get("/cart/abandonment/me", protect, getMyAbandonedCart);
router.post("/cart/abandonment", protect, saveCartAbandonment);

router.get("/refunds/me", protect, getMyRefundRequests);
router.post("/refunds/:orderId", protect, createRefundRequest);

router.get("/support/me", protect, getMySupportTickets);
router.post("/support", protect, createSupportTicket);
router.post("/support/:id/reply", protect, replySupportTicket);

router.get("/admin/analytics", protect, admin, getAdminAnalytics);
router.get("/admin/reviews", protect, admin, adminListReviews);
router.patch("/admin/reviews/:id", protect, admin, adminUpdateReview);
router.get("/admin/questions", protect, admin, adminListQuestions);
router.patch("/admin/questions/:id", protect, admin, adminAnswerQuestion);
router.get("/admin/tickets", protect, admin, adminListTickets);
router.patch("/admin/tickets/:id", protect, admin, adminUpdateTicket);
router.get("/admin/refunds", protect, admin, adminListRefundRequests);
router.patch("/admin/refunds/:id", protect, admin, adminUpdateRefundRequest);
router.post("/admin/notifications", protect, admin, adminCreateNotification);
router.get("/admin/plans", protect, admin, adminListPlans);
router.post("/admin/plans", protect, admin, adminUpsertPlan);
router.put("/admin/plans/:id", protect, admin, adminUpsertPlan);
router.get("/admin/bundles", protect, admin, adminListBundles);
router.post("/admin/bundles", protect, admin, adminUpsertBundle);
router.put("/admin/bundles/:id", protect, admin, adminUpsertBundle);
router.get("/admin/audit-logs", protect, admin, adminListAuditLogs);
router.get("/admin/downloads", protect, admin, adminListDownloads);
router.get("/admin/payment-events", protect, admin, adminListPaymentEvents);
router.get("/admin/email-preview/:template", protect, admin, previewEmailTemplate);
router.get("/admin/abandoned-carts", protect, admin, adminListAbandonedCarts);
router.get("/admin/export/orders.csv", protect, admin, exportOrdersCsv);
router.get("/admin/export/payment-events.csv", protect, admin, exportPaymentEventsCsv);
router.get("/admin/export/users.csv", protect, admin, exportUsersCsv);

module.exports = router;

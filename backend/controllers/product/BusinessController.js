const asyncHandler = require("express-async-handler");
const fs = require("fs");
const QRCode = require("qrcode");
const OrderModel = require("../../models/order/OrderModel");
const ChapterModel = require("../../models/educationModel/ChapterModel");
const NotificationModel = require("../../models/product/NotificationModel");
const ReviewModel = require("../../models/product/ReviewModel");
const LearningProgressModel = require("../../models/product/LearningProgressModel");
const SupportTicketModel = require("../../models/product/SupportTicketModel");
const MembershipPlanModel = require("../../models/product/MembershipPlanModel");
const BundleModel = require("../../models/product/BundleModel");
const DownloadLogModel = require("../../models/product/DownloadLogModel");
const AuditLogModel = require("../../models/product/AuditLogModel");
const ProductQuestionModel = require("../../models/product/ProductQuestionModel");
const CartAbandonmentModel = require("../../models/product/CartAbandonmentModel");
const RefundRequestModel = require("../../models/product/RefundRequestModel");
const CertificateModel = require("../../models/product/CertificateModel");
const PaymentEventModel = require("../../models/payment/PaymentEventModel");
const { getResourceUrl, isSafeLocalUploadPath, normalizeProductType, resolveUploadPath, userOwnsProduct } = require("../../utils/product/access");
const { writeAuditLog } = require("../../utils/product/audit");
const { createSignedToken, verifySignedToken } = require("../../utils/product/signedToken");
const { createCertificatePdf, createInvoicePdf, createSimplePdf } = require("../../utils/product/simplePdf");
const { sendAutomatedEmailTrs } = require("../../utils/helpers/mail");
const generateEmailTemplate = require("../../mail/template");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatCurrency = (amount = 0) => `Rs. ${Number(amount || 0).toLocaleString()}`;
const formatDate = (date) => (date ? new Date(date).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }) : "-");
const csvEscape = (value = "") => `"${String(value ?? "").replace(/"/g, '""')}"`;

const toSvgDataUri = (svg = "") => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
const emailPreviewLogo = toSvgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="42" fill="#0f1720"/><circle cx="80" cy="80" r="46" fill="#14b8a6" opacity=".25"/><text x="80" y="91" text-anchor="middle" font-size="44" font-family="Arial" font-weight="800" fill="#e2e8f0">GC</text></svg>`,
);
const emailPreviewBanner = toSvgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="360" viewBox="0 0 760 360"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0f766e"/><stop offset=".55" stop-color="#334155"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs><rect width="760" height="360" rx="38" fill="url(#g)"/><circle cx="190" cy="120" r="110" fill="#67e8f9" opacity=".16"/><circle cx="610" cy="230" r="150" fill="#f0abfc" opacity=".14"/><text x="80" y="155" font-size="44" font-family="Arial" font-weight="800" fill="#fff">Gorkcoder</text><text x="82" y="205" font-size="22" font-family="Arial" fill="#cbd5e1">Secure digital receipt preview</text></svg>`,
);

const buildMiniQrMarkup = (seed = "") => {
  let hash = 0;
  String(seed || "invoice").split("").forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  });

  return Array.from({ length: 49 })
    .map((_, index) => {
      const row = Math.floor(index / 7);
      const col = index % 7;
      const finder = (row <= 1 && col <= 1) || (row <= 1 && col >= 5) || (row >= 5 && col <= 1);
      const active = finder || (row * 13 + col * 17 + hash) % 4 !== 1;
      return `<i class="${active ? "is-active" : ""}"></i>`;
    })
    .join("");
};

const buildQrImageDataUrl = async (value = "", size = 180) => {
  try {
    return await QRCode.toDataURL(value, {
      width: Number(size) || 180,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    });
  } catch (error) {
    return "";
  }
};

const buildRefundTimeline = (refund = {}, fallbackCreatedAt) => {
  const status = refund?.status || "none";
  const requestedAt = refund?.requestedAt || fallbackCreatedAt || null;
  const resolvedAt = refund?.resolvedAt || null;
  const steps = [
    {
      key: "requested",
      label: "Requested",
      description: "Customer submitted the refund request.",
      date: requestedAt,
      active: ["requested", "approved", "rejected", "refunded"].includes(status),
    },
    {
      key: "reviewing",
      label: "Reviewing",
      description: "Admin checks order, payment, and access records.",
      date: requestedAt,
      active: ["requested", "approved", "rejected", "refunded"].includes(status),
    },
    {
      key: "approved",
      label: status === "rejected" ? "Rejected" : "Approved",
      description: status === "rejected" ? "Refund request was rejected with an admin note." : "Refund request is eligible for payout.",
      date: status === "approved" || status === "rejected" || status === "refunded" ? resolvedAt : null,
      active: ["approved", "rejected", "refunded"].includes(status),
      danger: status === "rejected",
    },
    {
      key: "refunded",
      label: "Refunded",
      description: "Payment was returned or marked as refunded.",
      date: status === "refunded" ? resolvedAt : null,
      active: status === "refunded",
    },
  ];

  return {
    status,
    requestedAt,
    resolvedAt,
    steps,
  };
};

const buildRefundSlaText = (refund = {}) => {
  const status = refund?.status || "none";

  if (status === "refunded") return "Refund completed. Please allow your payment provider or bank a little time to settle the returned amount.";
  if (status === "approved") return "Refund approved. Payout or provider-side reversal is being completed by admin.";
  if (status === "rejected") return "Refund reviewed and rejected. Check the admin note for the reason.";
  if (status === "requested") return "Refund request received. Most requests are reviewed within 3-5 business days.";

  return "Refunds can be requested from your dashboard if a paid order has an access or purchase issue.";
};

const getPublicBaseUrl = (req) => {
  const configuredUrl = process.env.BACKEND_PUBLIC_URL || process.env.API_PUBLIC_URL || process.env.BACKEND_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  return `${req.protocol}://${req.get("host")}`;
};

const getBusinessBaseUrl = (req) => `${getPublicBaseUrl(req)}${req.baseUrl || "/api/v1/business"}`;

const getFrontendBaseUrl = (req) => {
  const configuredUrl = process.env.FRONTEND_PUBLIC_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const hostname = (req.get("host") || "localhost:5173").split(":")[0] || "localhost";
  return process.env.NODE_ENV === "production" ? `${req.protocol}://${req.get("host")}` : `http://${hostname}:5173`;
};

const getCertificateVerificationUrl = (req, certificateId) => `${getFrontendBaseUrl(req)}/certificate/verify/${certificateId}`;

const getCertificatePayload = (req, progress) => {
  if (!progress?._id) return null;

  const certificateId = `CERT-${String(progress._id).slice(-8).toUpperCase()}`;
  const subjectId = progress.subject?._id || progress.subject || req.params.subjectId;
  const businessBaseUrl = getBusinessBaseUrl(req);

  return {
    certificateId,
    downloadUrl: `${businessBaseUrl}/certificate/${subjectId}?format=pdf`,
    verificationUrl: getCertificateVerificationUrl(req, certificateId),
  };
};

const sendSafeEmail = async (options) => {
  try {
    await sendAutomatedEmailTrs(options);
  } catch (error) {
    // Email delivery must not break product/payment flows.
  }
};

const sendInvoiceEmail = async ({ req, order, adminCopy = false }) => {
  const invoiceUrl = `${getBusinessBaseUrl(req)}/invoice/${order._id}`;
  const verificationUrl = `${getBusinessBaseUrl(req)}/invoice/verify/${order._id}`;
  const pdfUrl = `${invoiceUrl}?format=pdf`;

  await sendSafeEmail({
    email: order.user?.email,
    subject: adminCopy ? "Gorkcoder invoice resent by admin" : "Your Gorkcoder invoice is ready",
    title: "Gorkcoder invoice ready",
    message: `Hi ${order.user?.name || "there"}, your Gorkcoder invoice for order #${String(order._id).slice(-8).toUpperCase()} is ready. You can open the secure invoice, download the PDF, or share the public verification link with support if needed. Invoice: ${invoiceUrl}. PDF: ${pdfUrl}. Public verification: ${verificationUrl}`,
    btnTitle: "Open Invoice",
    link: invoiceUrl,
  });

  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    invoiceEmailSentAt: new Date(),
    invoiceEmailSentCount: Number(order.paymentInfo?.invoiceEmailSentCount || 0) + 1,
  };
  await order.save();
};

const renderDocumentHtml = ({ title, eyebrow, body }) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      body { margin: 0; background: #f8fafc; color: #111827; font-family: Arial, sans-serif; }
      .page { max-width: 860px; margin: 32px auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 32px; }
      .eyebrow { color: #0f766e; font-size: 11px; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; }
      h1 { margin: 10px 0 6px; font-size: 32px; letter-spacing: -.04em; }
      p { color: #6b7280; line-height: 1.6; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { border-bottom: 1px solid #e5e7eb; padding: 12px; text-align: left; font-size: 13px; }
      th { color: #6b7280; text-transform: uppercase; letter-spacing: .12em; font-size: 10px; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
      .box { border: 1px solid #e5e7eb; border-radius: 16px; padding: 14px; font-size: 13px; }
      .total { margin-top: 24px; text-align: right; font-size: 18px; font-weight: 900; }
      .invoice-shell { position: relative; overflow: hidden; border-radius: 28px; border: 1px solid #dbeafe; background: linear-gradient(145deg, #ffffff 0%, #f8fffe 55%, #eff6ff 100%); }
      .invoice-shell:before { content: ""; position: absolute; inset: -180px auto auto -120px; width: 360px; height: 360px; border-radius: 999px; background: radial-gradient(circle, rgba(20,184,166,.22), rgba(20,184,166,0) 68%); }
      .invoice-shell:after { content: ""; position: absolute; right: -160px; top: -120px; width: 360px; height: 360px; border-radius: 999px; background: radial-gradient(circle, rgba(59,130,246,.18), rgba(59,130,246,0) 70%); }
      .invoice-inner { position: relative; z-index: 1; padding: 34px; }
      .invoice-top { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; border-bottom: 1px solid #e2e8f0; padding-bottom: 26px; }
      .brand { display: flex; gap: 14px; align-items: center; }
      .brand-mark { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 18px; background: #0f766e; color: white; font-weight: 900; box-shadow: 0 18px 36px rgba(15,118,110,.24); }
      .brand-title { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: -.04em; color: #0f172a; }
      .brand-subtitle, .muted { color: #64748b; font-size: 12px; line-height: 1.6; }
      .invoice-title { text-align: right; }
      .invoice-title h1 { margin: 0; font-size: 42px; color: #0f172a; }
      .invoice-number { display: inline-flex; margin-top: 10px; padding: 8px 12px; border-radius: 999px; background: rgba(15,118,110,.08); color: #0f766e; font-size: 11px; font-weight: 900; letter-spacing: .12em; }
      .status-pill { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; padding: 9px 12px; border-radius: 999px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .12em; }
      .status-pill.pending { background: #fffbeb; color: #b45309; }
      .invoice-meta { display: grid; grid-template-columns: 1.15fr .85fr; gap: 16px; margin-top: 24px; }
      .info-card { border: 1px solid #e2e8f0; background: rgba(255,255,255,.72); border-radius: 20px; padding: 18px; }
      .info-card h3 { margin: 0 0 12px; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: .16em; }
      .info-line { display: flex; justify-content: space-between; gap: 16px; padding: 7px 0; color: #334155; font-size: 13px; border-top: 1px solid rgba(226,232,240,.75); }
      .info-line:first-of-type { border-top: 0; }
      .invoice-table { overflow: hidden; border: 1px solid #e2e8f0; border-radius: 20px; margin-top: 24px; background: rgba(255,255,255,.82); }
      .invoice-table table { margin-top: 0; }
      .invoice-table thead { background: #0f172a; }
      .invoice-table th { color: rgba(255,255,255,.72); border-bottom: 0; }
      .invoice-table td { color: #334155; }
      .invoice-table tbody tr:nth-child(even) { background: rgba(248,250,252,.72); }
      .text-right { text-align: right; }
      .item-title { font-weight: 800; color: #0f172a; }
      .item-type { display: inline-flex; padding: 5px 8px; border-radius: 999px; background: #f1f5f9; color: #475569; font-size: 11px; font-weight: 800; }
      .invoice-summary { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; margin-top: 24px; }
      .note-card { border-radius: 18px; border: 1px dashed #cbd5e1; background: rgba(255,255,255,.62); padding: 16px; color: #64748b; font-size: 12px; line-height: 1.7; }
      .summary-card { border-radius: 20px; border: 1px solid #e2e8f0; background: #fff; padding: 16px; box-shadow: 0 18px 40px rgba(15,23,42,.06); }
      .summary-row { display: flex; justify-content: space-between; gap: 18px; padding: 10px 0; color: #475569; font-size: 13px; border-bottom: 1px solid #f1f5f9; }
      .summary-row.discount span:last-child { color: #0f766e; font-weight: 900; }
      .summary-row.grand { border: 0; align-items: baseline; color: #0f172a; font-weight: 900; font-size: 20px; }
      .footer-note { margin-top: 26px; display: flex; justify-content: space-between; gap: 16px; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 18px; }
      .invoice-print-template { max-width: 860px; margin: 0 auto; background: #fff; color: #101828; overflow: hidden; }
      .invoice-print-header { position: relative; min-height: 185px; background: #e7e9ff; overflow: hidden; }
      .invoice-print-header:before { content: ""; position: absolute; width: 430px; height: 260px; right: -28px; top: -116px; border-radius: 0 0 0 220px; background: #3d42ff; }
      .invoice-print-header:after { content: ""; position: absolute; left: 230px; top: -165px; width: 340px; height: 340px; border-radius: 999px; background: rgba(255,255,255,.54); }
      .invoice-print-brand { position: relative; z-index: 1; padding: 34px 54px 24px; display: flex; justify-content: space-between; gap: 28px; align-items: flex-start; }
      .invoice-logo-wrap { display: flex; gap: 12px; align-items: center; }
      .invoice-logo-symbol { width: 48px; height: 48px; border-radius: 15px; display: grid; place-items: center; color: #fff; font-weight: 900; background: #3d42ff; box-shadow: 0 16px 32px rgba(61,66,255,.24); }
      .invoice-logo-title { margin: 0; color: #101828; font-size: 24px; line-height: 1; font-weight: 950; letter-spacing: -.04em; }
      .invoice-logo-subtitle { margin-top: 5px; color: #101828; font-size: 13px; letter-spacing: .42em; font-weight: 700; }
      .invoice-contact { margin-top: 26px; display: grid; gap: 9px; color: #1f2937; font-size: 14px; }
      .invoice-contact span { display: flex; align-items: center; gap: 10px; }
      .invoice-address { position: relative; z-index: 1; color: #fff; text-align: right; font-size: 15px; line-height: 1.5; font-weight: 800; max-width: 340px; }
      .invoice-print-body { padding: 42px 54px 36px; }
      .invoice-intro { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
      .buyer-label { font-weight: 900; font-size: 14px; color: #101828; margin-bottom: 10px; }
      .buyer-name { color: #3d42ff; font-size: 21px; font-weight: 950; margin-bottom: 8px; }
      .buyer-line { color: #4b5563; font-size: 14px; line-height: 1.55; }
      .invoice-heading { text-align: right; }
      .invoice-heading h1 { margin: 0 0 44px; font-size: 46px; letter-spacing: .04em; font-weight: 500; color: #101828; }
      .invoice-kv { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; font-size: 14px; color: #101828; }
      .invoice-kv strong { font-weight: 900; }
      .invoice-showcase { display: grid; grid-template-columns: minmax(260px, 1fr) minmax(280px, .95fr); gap: 32px; margin-top: 54px; align-items: stretch; }
      .invoice-product-image { min-height: 210px; border-radius: 9px; overflow: hidden; background: linear-gradient(135deg, #0f172a, #3d42ff); }
      .invoice-product-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .invoice-product-placeholder { height: 100%; min-height: 210px; display: grid; place-items: center; color: rgba(255,255,255,.86); font-size: 28px; font-weight: 950; letter-spacing: -.04em; }
      .invoice-product-info { display: grid; align-content: start; }
      .product-info-row { display: grid; grid-template-columns: 126px 1fr; min-height: 45px; align-items: center; padding: 0 12px; color: #4b5563; font-size: 14px; }
      .product-info-row:nth-child(odd) { background: #f4f4f5; }
      .product-info-row strong { color: #101828; font-weight: 950; }
      .items-table { margin-top: 58px; border-collapse: collapse; }
      .items-table th { color: #101828; border-bottom: 2px solid #101828; font-size: 14px; padding: 12px 0; letter-spacing: 0; text-transform: none; font-weight: 950; }
      .items-table td { color: #5b6472; border-bottom: 1px solid #9ca3af; padding: 18px 0; font-size: 14px; }
      .items-table tr:last-child td { border-bottom: 2px solid #101828; }
      .items-table .description-cell { width: 44%; }
      .grand-total-row { margin-top: 20px; display: flex; justify-content: flex-end; gap: 34px; align-items: baseline; font-size: 20px; font-weight: 950; }
      .grand-total-row span:first-child { color: #3d42ff; }
      .invoice-total-stack { margin-top: 18px; display: grid; justify-content: end; gap: 8px; }
      .invoice-total-line { min-width: 300px; display: flex; justify-content: space-between; gap: 32px; color: #5b6472; font-size: 14px; }
      .invoice-total-line.discount strong { color: #12a150; }
      .invoice-total-line.grand { margin-top: 6px; color: #101828; font-size: 20px; font-weight: 950; }
      .invoice-total-line.grand span { color: #3d42ff; }
      .payment-strip { margin-top: 38px; background: #3d42ff; color: #fff; padding: 20px 22px; }
      .payment-strip table { margin: 0; border-collapse: collapse; }
      .payment-strip th, .payment-strip td { border-color: rgba(255,255,255,.72); color: #fff; padding: 10px 0; font-size: 13px; }
      .payment-strip th { color: #fff; font-size: 14px; letter-spacing: 0; text-transform: none; font-weight: 950; }
      .must-read { margin-top: 34px; color: #5b6472; font-size: 13px; line-height: 1.65; }
      .must-read strong { display: block; color: #101828; font-size: 16px; margin-bottom: 8px; }
      .invoice-action-bar { display: flex; justify-content: center; gap: 0; margin: 28px auto 18px; }
      .invoice-action-bar button, .invoice-action-bar a { border: 0; display: inline-flex; align-items: center; gap: 9px; padding: 14px 30px; color: #fff; font-size: 15px; font-weight: 900; text-decoration: none; }
      .invoice-action-bar button { border-radius: 999px 0 0 999px; background: #ef4444; }
      .invoice-action-bar a { border-radius: 0 999px 999px 0; background: #12c85f; }
      .invoice-bottom-note { text-align: center; color: #5b6472; font-size: 13px; }
      .invoice-bottom-note strong { color: #101828; }
      .actions { max-width: 860px; margin: 24px auto 0; text-align: right; }
      button { border: 0; border-radius: 12px; background: #0d9488; color: #fff; padding: 12px 18px; font-weight: 800; cursor: pointer; }
      @media (max-width: 720px) { .invoice-top, .invoice-summary { display: block; } .invoice-title { text-align: left; margin-top: 20px; } .invoice-meta { grid-template-columns: 1fr; } .summary-card { margin-top: 16px; } .invoice-print-brand, .invoice-intro, .invoice-showcase { display: block; } .invoice-address, .invoice-heading { text-align: left; margin-top: 24px; color: #101828; } .invoice-print-body, .invoice-print-brand { padding-left: 24px; padding-right: 24px; } .invoice-heading h1 { margin-bottom: 24px; } .invoice-product-info { margin-top: 18px; } }
      @media print { body { background: #fff; } .page { max-width: none; margin: 0; border: 0; border-radius: 0; padding: 0; } .actions, .invoice-action-bar, .invoice-bottom-note { display: none; } .invoice-shell { border: 0; border-radius: 0; } .invoice-print-template { max-width: none; } }
    </style>
  </head>
  <body>
    <div class="actions"><button onclick="window.print()">Print / Save PDF</button></div>
    <main class="page">
      <div class="eyebrow">${escapeHtml(eyebrow)}</div>
      ${body}
    </main>
  </body>
</html>`;

const getPublicBusiness = asyncHandler(async (req, res) => {
  const [plans, bundles] = await Promise.all([
    MembershipPlanModel.find({ isActive: true }).sort({ price: 1 }),
    BundleModel.find({ isActive: true }).populate("items.product", "title name slug thumbnail price").sort({ createdAt: -1 }),
  ]);

  res.status(200).json({ success: true, plans, bundles });
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await NotificationModel.find({
    $or: [{ user: req.user._id }, { audience: "all" }],
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    notifications,
    unreadCount: notifications.filter((notification) => !notification.readAt).length,
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await NotificationModel.findOneAndUpdate(
    {
      _id: req.params.id,
      $or: [{ user: req.user._id }, { audience: "all" }],
    },
    { readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    return res.status(404).json({ success: false, error: "Notification not found." });
  }

  res.status(200).json({ success: true, notification });
});

const getProductReviews = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  const reviews = await ReviewModel.find({
    product: req.params.productId,
    productModel: productConfig.name,
    status: "approved",
  })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });

  const averageRating = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;

  res.status(200).json({
    success: true,
    reviews,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
  });
});

const createProductReview = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);
  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || "").trim();

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  if (!rating || rating < 1 || rating > 5 || !comment) {
    return res.status(400).json({ success: false, error: "Please add a rating between 1 and 5 and a review comment." });
  }

  const hasAccess = await userOwnsProduct({
    userId: req.user._id,
    productId: req.params.productId,
    productModel: productConfig.name,
  });

  if (!hasAccess && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Only purchased users can review this item." });
  }

  const review = await ReviewModel.findOneAndUpdate(
    {
      user: req.user._id,
      product: req.params.productId,
      productModel: productConfig.name,
    },
    {
      rating,
      comment,
      status: "pending",
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  await writeAuditLog({
    req,
    action: "review.submitted",
    entityType: productConfig.name,
    entityId: req.params.productId,
    message: "Product review submitted.",
  });

  res.status(201).json({ success: true, review, message: "Review submitted for approval." });
});

const getProductQuestions = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  const questions = await ProductQuestionModel.find({
    product: req.params.productId,
    productModel: productConfig.name,
    status: { $in: ["pending", "answered"] },
  })
    .populate("user", "name avatar")
    .populate("answeredBy", "name")
    .sort({ answeredAt: -1, createdAt: -1 })
    .limit(50);

  res.status(200).json({ success: true, questions });
});

const createProductQuestion = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);
  const questionText = String(req.body.question || "").trim();

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  if (!questionText) {
    return res.status(400).json({ success: false, error: "Please enter your question." });
  }

  const product = await productConfig.model.findById(req.params.productId).select("title name slug");

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found." });
  }

  const question = await ProductQuestionModel.create({
    user: req.user._id,
    product: product._id,
    productModel: productConfig.name,
    question: questionText,
  });

  await writeAuditLog({
    req,
    action: "question.created",
    entityType: productConfig.name,
    entityId: product._id,
    message: `Question asked for ${product.title || product.name}.`,
  });

  res.status(201).json({ success: true, question });
});

const getLessonKey = (type, id) => `${type}:${String(id)}`;

const collectChapterLessonKeys = (chapters = []) => {
  const lessonKeys = [];

  const collectSubheadings = (subheadings = []) => {
    subheadings.forEach((subheading) => {
      if (subheading?._id) {
        lessonKeys.push(getLessonKey("subheading", subheading._id));
      }

      collectSubheadings(subheading?.children || []);
    });
  };

  chapters.forEach((chapter) => {
    const subheadings = Array.isArray(chapter?.subheadings) ? chapter.subheadings : [];

    if (subheadings.length > 0) {
      collectSubheadings(subheadings);
      return;
    }

    if (chapter?._id) {
      lessonKeys.push(getLessonKey("chapter", chapter._id));
    }
  });

  return lessonKeys;
};

const getCourseLessonKeys = async (subjectId) => {
  const chapters = await ChapterModel.find({ subject: subjectId }).sort({ order: 1, createdAt: 1 }).select("_id subheadings").lean();
  return collectChapterLessonKeys(chapters);
};

const getCourseProgress = asyncHandler(async (req, res) => {
  const chaptersCount = await ChapterModel.countDocuments({ subject: req.params.subjectId });
  const lessonKeys = await getCourseLessonKeys(req.params.subjectId);
  const progress = await LearningProgressModel.findOne({ user: req.user._id, subject: req.params.subjectId }).populate("lastChapter", "title slug");
  const completedLessons = Array.isArray(progress?.completedLessons) && progress.completedLessons.length > 0 ? progress.completedLessons : (progress?.completedChapters || []).map((chapterId) => getLessonKey("chapter", chapterId));
  const completedCount = completedLessons.filter((lessonKey) => lessonKeys.includes(lessonKey)).length;
  const percent = lessonKeys.length ? Math.min(Math.round((completedCount / lessonKeys.length) * 100), 100) : progress?.percent || 0;
  const certificate = percent >= 100 && progress ? getCertificatePayload(req, progress) : null;

  res.status(200).json({
    success: true,
    progress: progress || {
      subject: req.params.subjectId,
      completedChapters: [],
      completedLessons: [],
      percent: 0,
      completedAt: null,
    },
    totalChapters: chaptersCount,
    totalLessons: lessonKeys.length,
    completedLessons,
    percent,
    certificate,
  });
});

const updateCourseProgress = asyncHandler(async (req, res) => {
  const chapterId = req.body.chapterId;
  const lessonKey = req.body.lessonKey || (chapterId ? getLessonKey("chapter", chapterId) : "");
  const completed = req.body.completed !== false;

  if (!lessonKey) {
    return res.status(400).json({ success: false, error: "lessonKey is required." });
  }

  const chaptersCount = await ChapterModel.countDocuments({ subject: req.params.subjectId });
  const lessonKeys = await getCourseLessonKeys(req.params.subjectId);
  const safeLessonKey = lessonKeys.includes(lessonKey) ? lessonKey : lessonKey.replace(/[^a-zA-Z0-9:_-]/g, "");
  const update = completed
    ? {
        $addToSet: {
          completedLessons: safeLessonKey,
          ...(chapterId ? { completedChapters: chapterId } : {}),
        },
        $set: { ...(chapterId ? { lastChapter: chapterId } : {}), lastLessonKey: safeLessonKey },
      }
    : {
        $pull: {
          completedLessons: safeLessonKey,
          ...(chapterId ? { completedChapters: chapterId } : {}),
        },
        $set: { ...(chapterId ? { lastChapter: chapterId } : {}), lastLessonKey: safeLessonKey, completedAt: null },
      };

  let progress = await LearningProgressModel.findOneAndUpdate(
    { user: req.user._id, subject: req.params.subjectId },
    update,
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const wasCompletedBefore = Boolean(progress.completedAt) || Number(progress.percent || 0) >= 100;
  const completedCount = (progress.completedLessons || []).filter((key) => lessonKeys.includes(key)).length;
  progress.percent = lessonKeys.length ? Math.min(Math.round((completedCount / lessonKeys.length) * 100), 100) : 0;
  progress.completedAt = progress.percent >= 100 ? progress.completedAt || new Date() : null;
  await progress.save();

  const certificate = progress.percent >= 100 ? getCertificatePayload(req, progress) : null;

  if (progress.percent >= 100 && certificate) {
    await CertificateModel.findOneAndUpdate(
      { certificateId: certificate.certificateId },
      {
        certificateId: certificate.certificateId,
        user: req.user._id,
        subject: req.params.subjectId,
        completedAt: progress.completedAt || progress.updatedAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  if (progress.percent >= 100 && !wasCompletedBefore) {
    await NotificationModel.create({
      user: req.user._id,
      type: "course",
      title: "Course completed",
      message: "Great work — you completed this course. Your certificate is ready.",
      link: `/course/${req.params.subjectId}`,
    });

    await sendSafeEmail({
      email: req.user.email,
      subject: "Course completed - certificate ready",
      title: "Your certificate is ready",
      message: `Great work ${req.user.name || ""}! You completed the course. Open your course page to download your certificate.`,
      btnTitle: "View Certificate",
    });
  }

  res.status(200).json({ success: true, progress, totalChapters: chaptersCount, totalLessons: lessonKeys.length, certificate });
});

const secureDownload = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  const product = await productConfig.model.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found." });
  }

  const hasAccess = await userOwnsProduct({
    userId: req.user._id,
    productId: product._id,
    productModel: productConfig.name,
  });

  if (!hasAccess && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Please purchase this item before downloading." });
  }

  const fileUrl = getResourceUrl(product, productConfig.name);

  if (!fileUrl) {
    return res.status(404).json({ success: false, error: "No downloadable file found for this item." });
  }

  await DownloadLogModel.create({
    user: req.user._id,
    product: product._id,
    productModel: productConfig.name,
    title: product.title || product.name || "",
    fileUrl,
    ip: req.ip || "",
  });

  if (/^https?:\/\//i.test(fileUrl)) {
    return res.redirect(fileUrl);
  }

  if (isSafeLocalUploadPath(fileUrl)) {
    const localPath = resolveUploadPath(fileUrl);

    if (localPath && fs.existsSync(localPath)) {
      return res.download(localPath);
    }
  }

  res.status(404).json({ success: false, error: "Download file is not available on the server." });
});

const createSecureDownloadLink = asyncHandler(async (req, res) => {
  const productConfig = normalizeProductType(req.params.productType);

  if (!productConfig) {
    return res.status(400).json({ success: false, error: "Unsupported product type." });
  }

  const product = await productConfig.model.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found." });
  }

  const hasAccess = await userOwnsProduct({
    userId: req.user._id,
    productId: product._id,
    productModel: productConfig.name,
  });

  if (!hasAccess && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Please purchase this item before downloading." });
  }

  const token = createSignedToken({
    userId: String(req.user._id),
    productId: String(product._id),
    productModel: productConfig.name,
  });
  const downloadUrl = `${req.protocol}://${req.get("host")}/api/v1/business/download-token/${token}`;

  if (req.headers.accept?.includes("application/json")) {
    return res.status(200).json({ success: true, downloadUrl, expiresIn: 900 });
  }

  return res.redirect(downloadUrl);
});

const downloadWithToken = asyncHandler(async (req, res) => {
  let payload;

  try {
    payload = verifySignedToken(req.params.token);
  } catch (error) {
    return res.status(401).json({ success: false, error: error.message });
  }

  const productConfig = payload.productModel === "Project" ? normalizeProductType("project") : normalizeProductType("course");
  const product = await productConfig.model.findById(payload.productId);

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found." });
  }

  const fileUrl = getResourceUrl(product, productConfig.name);

  await DownloadLogModel.create({
    user: payload.userId,
    product: product._id,
    productModel: productConfig.name,
    title: product.title || product.name || "",
    fileUrl,
    ip: req.ip || "",
  });

  if (/^https?:\/\//i.test(fileUrl)) {
    return res.redirect(fileUrl);
  }

  if (isSafeLocalUploadPath(fileUrl)) {
    const localPath = resolveUploadPath(fileUrl);

    if (localPath && fs.existsSync(localPath)) {
      return res.download(localPath);
    }
  }

  res.status(404).json({ success: false, error: "Download file is not available on the server." });
});

const getMyDownloads = asyncHandler(async (req, res) => {
  const downloads = await DownloadLogModel.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.status(200).json({ success: true, downloads });
});

const getInvoiceDocument = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.orderId } : { _id: req.params.orderId, user: req.user._id };
  const order = await OrderModel.findOne(query).populate("user", "name email phone address");

  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  const invoiceNumber = String(order._id).slice(-8).toUpperCase();
  const subtotal = Number(order.subtotal || order.amount || 0);
  const discountAmount = Number(order.discountAmount || 0);
  const paymentMethod = order.paymentInfo?.method ? String(order.paymentInfo.method).toUpperCase() : "-";
  const transactionId = order.paymentInfo?.id || order.paymentInfo?.transactionUuid || "-";
  const firstItem = order.orderItems?.[0] || {};
  const productCount = (order.orderItems || []).reduce((total, item) => total + (Number(item.quantity || 1) || 1), 0);
  const invoiceDate = formatDate(order.createdAt || order.paidAt);
  const paymentDate = formatDate(order.paidAt || order.createdAt);
  const firstImage = firstItem.image
    ? /^https?:\/\//i.test(firstItem.image)
      ? firstItem.image
      : `${req.protocol}://${req.get("host")}${String(firstItem.image).startsWith("/") ? "" : "/"}${firstItem.image}`
    : "";
  const invoiceLogoUrl = `${getPublicBaseUrl(req)}/uploads/system/invoice-logo.png`;
  const invoiceUrl = `${getBusinessBaseUrl(req)}/invoice/${order._id}`;
  const verificationUrl = `${getBusinessBaseUrl(req)}/invoice/verify/${order._id}`;
  const pdfUrl = `${invoiceUrl}?format=pdf`;
  const normalizedStatus = String(order.status || "unpaid").toLowerCase();
  const statusClass = ["paid", "refunded", "failed", "cancelled", "pending", "unpaid"].includes(normalizedStatus) ? normalizedStatus : "pending";
  const invoiceDisplayStatus = normalizedStatus === "cancelled" ? "void" : normalizedStatus;
  const refundStatus = order.refund?.status || "none";
  const expiresSoon =
    order.expiresAt &&
    Number.isFinite(new Date(order.expiresAt).getTime()) &&
    new Date(order.expiresAt).getTime() > Date.now() &&
    new Date(order.expiresAt).getTime() - Date.now() <= 1000 * 60 * 60 * 24 * 30;
  const isExpired = order.expiresAt && Number.isFinite(new Date(order.expiresAt).getTime()) && new Date(order.expiresAt).getTime() < Date.now();
  const accessMessage = isExpired
    ? "Access period has expired. Contact support if you believe this is incorrect."
    : expiresSoon
      ? "Access expires soon. Download your files or review access from your dashboard."
      : "Your digital access remains available from your account dashboard while this order is active.";
  const refundTimeline = buildRefundTimeline(order.refund, order.refund?.requestedAt);
  const refundSlaText = buildRefundSlaText(order.refund);
  const qrImageUrl = await buildQrImageDataUrl(verificationUrl, 180);
  const qrMarkup = buildMiniQrMarkup(verificationUrl);
  const rows = (order.orderItems || [])
    .map(
      (item) => `<tr>
        <td class="description-cell">
          <strong>${escapeHtml(item.title || "Item")}</strong>
          <span>${escapeHtml(item.productModel || "Digital Product")}</span>
        </td>
        <td>${formatCurrency(item.price)}</td>
        <td class="text-right">${Number(item.quantity || 1)}</td>
        <td class="text-right">${formatCurrency(0)}</td>
        <td class="text-right">${formatCurrency(Number(item.price || 0) * Number(item.quantity || 1))}</td>
      </tr>`,
    )
    .join("");

  const html = renderDocumentHtml({
    title: `Invoice ${order._id}`,
    eyebrow: "Invoice",
    body: `
      <style>
        .actions{display:none;}
        body{background:#f3f6fb;}
        .page{padding:0;border:0;border-radius:0;background:transparent;}
        .invoice-print-template{max-width:960px;margin:0 auto;overflow:hidden;border-radius:34px;background:#fff;color:#101828;box-shadow:0 34px 90px rgba(15,23,42,.12);}
        .invoice-print-header{position:relative;min-height:218px;overflow:hidden;background:linear-gradient(135deg,#eef2ff 0%,#f8fbff 48%,#e9fbf8 100%);border-bottom:1px solid #e7ecf5;}
        .invoice-print-header:before{content:"";position:absolute;right:-80px;top:-138px;width:520px;height:330px;border-radius:0 0 0 260px;background:linear-gradient(135deg,#4338ca 0%,#5146ff 48%,#20c6bb 100%);box-shadow:0 28px 70px rgba(67,56,202,.24);}
        .invoice-print-header:after{content:"";position:absolute;left:330px;top:-190px;width:390px;height:390px;border-radius:999px;border:1px solid rgba(67,56,202,.06);background:rgba(255,255,255,.56);}
        .invoice-print-brand{position:relative;z-index:1;padding:42px 62px 34px;display:flex;justify-content:space-between;gap:28px;align-items:flex-start;}
        .invoice-logo-wrap{display:flex;gap:14px;align-items:center;}
        .invoice-logo-symbol{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;color:#fff;font-weight:950;background:linear-gradient(135deg,#4338ca,#2563eb 56%,#14b8a6);box-shadow:0 18px 38px rgba(67,56,202,.25);}
        .invoice-logo-title{margin:0;color:#101828;font-size:28px;line-height:1;font-weight:950;letter-spacing:-.055em;}
        .invoice-logo-subtitle{margin-top:6px;color:#111827;font-size:13px;letter-spacing:.5em;font-weight:800;opacity:.78;}
        .invoice-contact{margin-top:26px;display:grid;gap:10px;color:#334155;font-size:14px;font-weight:700;}
        .invoice-contact span{display:flex;align-items:center;gap:10px;font-size:0;}
        .invoice-contact span:before{content:"";width:7px;height:7px;border-radius:999px;background:#14b8a6;box-shadow:0 0 0 5px rgba(20,184,166,.10);}
        .invoice-contact span:after{font-size:14px;color:#334155;}
        .invoice-contact span:first-child:after{content:"+977 9800000000";}
        .invoice-contact span:nth-child(2):after{content:"support@gorkcoder.com";}
        .invoice-address{position:relative;z-index:1;max-width:360px;padding:8px 0;color:#fff;text-align:right;font-size:17px;line-height:1.42;font-weight:900;text-shadow:0 10px 24px rgba(0,0,0,.14);}
        .invoice-print-body{padding:48px 62px 38px;}
        .invoice-intro{display:grid;grid-template-columns:1fr 360px;gap:34px;align-items:stretch;}
        .buyer-panel,.invoice-heading{position:relative;overflow:hidden;border:1px solid #eef2f7;border-radius:24px;background:linear-gradient(145deg,#fff,#f8fafc);padding:24px;}
        .buyer-label,.invoice-section-label{color:#0f766e;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase;}
        .buyer-name{margin:12px 0 8px;color:#4338ca;font-size:24px;font-weight:950;letter-spacing:-.035em;}
        .buyer-line{display:flex;gap:8px;color:#475569;font-size:14px;line-height:1.7;}
        .invoice-heading{text-align:left;}
        .invoice-heading:after{content:"PAID";position:absolute;right:18px;top:18px;border-radius:999px;background:#dcfce7;color:#047857;padding:8px 12px;font-size:10px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;}
        .invoice-heading h1{margin:12px 0 28px;color:#111827;font-size:42px;font-weight:800;letter-spacing:-.055em;}
        .invoice-kv{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;color:#475569;font-size:14px;}
        .invoice-kv strong{color:#0f172a;font-weight:950;}
        .invoice-showcase{display:grid;grid-template-columns:minmax(280px,1fr) minmax(300px,.92fr);gap:28px;margin-top:38px;padding:18px;border:1px solid #eef2f7;border-radius:28px;background:linear-gradient(145deg,#f8fafc,#fff);}
        .invoice-product-image{min-height:258px;border-radius:22px;overflow:hidden;background:linear-gradient(135deg,#111827,#4338ca);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10),0 20px 40px rgba(15,23,42,.10);}
        .invoice-product-image img{width:100%;height:100%;object-fit:cover;display:block;}
        .invoice-product-placeholder{height:100%;min-height:258px;display:grid;place-items:center;color:rgba(255,255,255,.86);font-size:28px;font-weight:950;letter-spacing:-.04em;}
        .invoice-product-info{display:grid;align-content:start;overflow:hidden;border:1px solid #eef2f7;border-radius:22px;background:#fff;}
        .product-info-row{display:grid;grid-template-columns:118px 1fr;min-height:48px;align-items:center;padding:0 16px;border-bottom:1px solid #eef2f7;color:#4b5563;font-size:14px;}
        .product-info-row:last-child{border-bottom:0;}
        .product-info-row:nth-child(odd){background:#f8fafc;}
        .product-info-row strong{color:#101828;font-weight:950;}
        .items-table{width:100%;margin-top:38px;overflow:hidden;border:1px solid #e5eaf2;border-radius:24px;background:#fff;border-collapse:separate;border-spacing:0;}
        .items-table thead{background:#111827;}
        .items-table th{border:0;color:rgba(255,255,255,.74);padding:16px 18px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:950;text-align:left;}
        .items-table td{border:0;border-top:1px solid #eef2f7;padding:18px;color:#475569;font-size:14px;}
        .items-table .text-right{text-align:right;}
        .description-cell{width:44%;}
        .description-cell strong{display:block;color:#0f172a;font-size:14px;line-height:1.35;}
        .description-cell span{display:inline-flex;margin-top:7px;border-radius:999px;background:#f1f5f9;padding:5px 9px;color:#64748b;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;}
        .invoice-total-stack{margin-top:20px;margin-left:auto;display:grid;gap:8px;justify-content:stretch;width:330px;border:1px solid #eef2f7;border-radius:22px;background:#f8fafc;padding:18px 22px;}
        .invoice-total-line{min-width:0;display:flex;justify-content:space-between;gap:32px;color:#5b6472;font-size:14px;}
        .invoice-total-line.discount strong{color:#12a150;}
        .invoice-total-line.grand{margin-top:10px;padding-top:14px;border-top:1px solid #e2e8f0;color:#101828;font-size:23px;font-weight:950;}
        .invoice-total-line.grand span{color:#4338ca;}
        .payment-strip{margin-top:34px;border-radius:24px;background:linear-gradient(135deg,#4338ca,#2563eb 58%,#0f766e);padding:20px 26px;color:#fff;box-shadow:0 24px 50px rgba(37,99,235,.20);}
        .payment-strip table{width:100%;margin:0;border-collapse:collapse;}
        .payment-strip th,.payment-strip td{border-color:rgba(255,255,255,.24);color:#fff;padding:12px 0;font-size:13px;}
        .payment-strip th{font-size:13px;letter-spacing:0;text-transform:none;font-weight:950;text-align:left;}
        .payment-strip .text-right{text-align:right;}
        .must-read{margin-top:30px;border:1px solid #e5eaf2;border-radius:24px;background:linear-gradient(145deg,#fff,#f8fafc);padding:22px;color:#5b6472;font-size:13px;line-height:1.65;}
        .must-read strong{display:block;margin-bottom:8px;color:#0f172a;font-size:17px;}
        .invoice-signature-row{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-top:32px;padding-top:22px;border-top:1px solid #e5eaf2;}
        .signature-name{font-family:Georgia,serif;font-size:22px;font-style:italic;color:#0f172a;}
        .invoice-seal{display:grid;place-items:center;width:84px;height:84px;border-radius:999px;background:radial-gradient(circle,#fff 0 36%,#facc15 37% 52%,#1e3a8a 53%);color:#fff;text-align:center;font-size:10px;font-weight:950;line-height:1.15;box-shadow:0 14px 28px rgba(30,58,138,.16);}
        .invoice-action-bar{display:flex;justify-content:center;gap:12px;margin:34px auto 18px;}
        .invoice-action-bar button,.invoice-action-bar a{border:0;display:inline-flex;align-items:center;gap:9px;border-radius:999px;padding:15px 34px;color:#fff;font-size:0;font-weight:900;text-decoration:none;box-shadow:0 14px 30px rgba(15,23,42,.12);}
        .invoice-action-bar button{background:linear-gradient(135deg,#ef4444,#f97316);}
        .invoice-action-bar a{background:linear-gradient(135deg,#16a34a,#10b981);}
        .invoice-action-bar button:after{content:"Print";font-size:15px;}
        .invoice-action-bar a:after{content:"Download";font-size:15px;}
        .invoice-bottom-note{padding-bottom:28px;text-align:center;color:#5b6472;font-size:13px;}
        .invoice-bottom-note strong{color:#101828;}
        @media(max-width:720px){.invoice-print-template{border-radius:0}.invoice-print-brand,.invoice-print-body{padding-left:24px;padding-right:24px}.invoice-print-brand,.invoice-intro,.invoice-showcase{display:block}.invoice-address,.invoice-heading{text-align:left;margin-top:20px;color:#101828;text-shadow:none}.buyer-panel,.invoice-heading{padding:18px}.invoice-showcase{padding:14px}.invoice-product-info{margin-top:18px}.invoice-total-stack{width:auto}.invoice-signature-row{display:block}.invoice-seal{margin-top:18px}.items-table{display:block;overflow-x:auto}}
        @media print{body{background:#fff}.invoice-print-template{box-shadow:none;border-radius:0}.invoice-action-bar,.invoice-bottom-note{display:none}}
        body{background:#10151c;}
        .invoice-print-template{background:#121820;color:#fff;border:1px solid rgba(255,255,255,.075);box-shadow:0 34px 100px rgba(0,0,0,.42);}
        .invoice-print-header{background:linear-gradient(135deg,rgba(20,184,166,.24),rgba(18,24,32,.94) 44%,rgba(76,45,108,.72));border-bottom:1px solid rgba(255,255,255,.065);}
        .invoice-print-header:before{background:radial-gradient(circle at 42% 45%,rgba(45,212,191,.52),rgba(45,212,191,.16) 35%,rgba(168,85,247,.24) 64%,transparent 72%);box-shadow:none;opacity:.9;}
        .invoice-print-header:after{left:40%;top:-210px;border:1px solid rgba(255,255,255,.045);background:rgba(255,255,255,.035);}
        .invoice-logo-symbol{overflow:hidden;background:rgba(255,255,255,.08);box-shadow:0 18px 38px rgba(20,184,166,.12);border:1px solid rgba(255,255,255,.12);}
        .invoice-logo-symbol img{width:100%;height:100%;object-fit:cover;display:block;}
        .invoice-logo-title{color:#fff;}
        .invoice-logo-subtitle{color:rgba(255,255,255,.62);}
        .invoice-contact{color:rgba(255,255,255,.62);}
        .invoice-contact span:after{color:rgba(255,255,255,.64);}
        .invoice-address{padding:18px 22px;border:1px solid rgba(255,255,255,.11);border-radius:24px;background:rgba(255,255,255,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(18px);}
        .invoice-print-body{background:radial-gradient(circle at 0% 0%,rgba(20,184,166,.12),transparent 32%),radial-gradient(circle at 86% 20%,rgba(168,85,247,.12),transparent 34%),#121820;}
        .buyer-panel,.invoice-heading,.invoice-showcase,.must-read{border-color:rgba(255,255,255,.075);background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.035));box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}
        .buyer-label,.invoice-section-label{color:rgba(126,231,224,.76);}
        .buyer-name{color:#d7c8ff;}
        .buyer-line{color:rgba(255,255,255,.58);}
        .invoice-heading h1{color:#fff;}
        .invoice-kv{color:rgba(255,255,255,.58);}
        .invoice-kv strong{color:rgba(255,255,255,.9);}
        .invoice-product-info{border-color:rgba(255,255,255,.075);background:rgba(255,255,255,.035);}
        .product-info-row{border-bottom-color:rgba(255,255,255,.055);color:rgba(255,255,255,.58);}
        .product-info-row:nth-child(odd){background:rgba(255,255,255,.035);}
        .product-info-row strong{color:rgba(255,255,255,.88);}
        .items-table{border-color:rgba(255,255,255,.075);background:rgba(255,255,255,.035);}
        .items-table thead{background:rgba(255,255,255,.08);}
        .items-table th{color:rgba(126,231,224,.72);}
        .items-table td{border-top-color:rgba(255,255,255,.055);color:rgba(255,255,255,.62);}
        .description-cell strong{color:rgba(255,255,255,.88);}
        .description-cell span{background:rgba(255,255,255,.06);color:rgba(255,255,255,.48);}
        .invoice-total-stack{border-color:rgba(255,255,255,.075);background:rgba(255,255,255,.045);}
        .invoice-total-line{color:rgba(255,255,255,.56);}
        .invoice-total-line.grand{border-top-color:rgba(255,255,255,.075);color:#fff;}
        .invoice-total-line.grand span{color:#d7c8ff;}
        .payment-strip{background:linear-gradient(135deg,rgba(20,184,166,.72),rgba(67,56,202,.76) 56%,rgba(244,114,182,.42));box-shadow:0 24px 50px rgba(20,184,166,.12);}
        .payment-strip th,.payment-strip td{border-color:rgba(255,255,255,.18);}
        .must-read{color:rgba(255,255,255,.56);}
        .must-read strong,.signature-name{color:#fff;}
        .invoice-signature-row{border-top-color:rgba(255,255,255,.075);}
        .invoice-seal{background:radial-gradient(circle,#111827 0 36%,#facc15 37% 52%,#14b8a6 53%);box-shadow:0 18px 34px rgba(20,184,166,.16);}
        .invoice-bottom-note{color:rgba(255,255,255,.52);}
        .invoice-bottom-note strong{color:rgba(255,255,255,.86);}
        body{
          font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          letter-spacing:-.012em;
          -webkit-font-smoothing:antialiased;
          text-rendering:geometricPrecision;
        }
        .page{
          margin-top:26px;
          margin-bottom:34px;
          background:transparent;
        }
        .eyebrow{
          max-width:860px;
          margin:0 auto 6px;
          color:rgba(45,212,191,.78);
          font-size:10px;
          letter-spacing:.32em;
        }
        .invoice-print-template{
          position:relative;
          border-radius:34px;
          background:
            radial-gradient(circle at 18% 0%,rgba(20,184,166,.12),transparent 34%),
            radial-gradient(circle at 88% 4%,rgba(168,85,247,.14),transparent 36%),
            linear-gradient(180deg,#121922 0%,#111820 48%,#10161e 100%);
          box-shadow:0 30px 90px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.055);
        }
        .invoice-print-template:before{
          content:"";
          position:absolute;
          inset:0;
          pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.035),transparent);
          opacity:.55;
        }
        .invoice-print-header,.invoice-print-body,.invoice-action-bar,.invoice-bottom-note{
          position:relative;
          z-index:1;
        }
        .invoice-print-header{
          min-height:198px;
          border-bottom-color:rgba(126,231,224,.10);
        }
        .invoice-print-brand{
          padding:34px 60px 32px;
          align-items:center;
        }
        .invoice-logo-wrap{
          gap:15px;
        }
        .invoice-logo-symbol{
          width:56px;
          height:56px;
          border-radius:18px;
          box-shadow:0 14px 34px rgba(20,184,166,.18);
        }
        .invoice-logo-title{
          font-size:28px;
          font-weight:900;
          letter-spacing:-.055em;
          line-height:.95;
        }
        .invoice-logo-subtitle{
          margin-top:8px;
          font-size:11px;
          letter-spacing:.48em;
          font-weight:800;
        }
        .invoice-contact{
          margin-top:22px;
          gap:9px;
        }
        .invoice-contact span:before{
          width:6px;
          height:6px;
          box-shadow:0 0 0 5px rgba(20,184,166,.09),0 0 16px rgba(45,212,191,.35);
        }
        .invoice-contact span:after{
          font-size:13px;
          font-weight:700;
          letter-spacing:-.01em;
        }
        .invoice-address{
          max-width:360px;
          padding:20px 24px;
          border-radius:25px;
          background:linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.045));
          color:rgba(255,255,255,.88);
          font-size:16px;
          font-weight:800;
          line-height:1.45;
        }
        .invoice-print-body{
          padding:44px 60px 38px;
        }
        .invoice-intro{
          gap:26px;
        }
        .buyer-panel,.invoice-heading,.invoice-showcase,.must-read{
          border-radius:27px;
          border-color:rgba(255,255,255,.085);
          background:linear-gradient(145deg,rgba(255,255,255,.073),rgba(255,255,255,.032));
          box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 18px 46px rgba(0,0,0,.08);
        }
        .buyer-panel,.invoice-heading{
          padding:25px 27px;
          min-height:166px;
        }
        .buyer-label,.invoice-section-label{
          font-size:9px;
          letter-spacing:.28em;
          color:rgba(126,231,224,.82);
        }
        .buyer-name{
          margin-top:15px;
          margin-bottom:10px;
          font-size:24px;
          font-weight:850;
          letter-spacing:-.045em;
          text-shadow:0 10px 22px rgba(168,85,247,.14);
        }
        .buyer-line{
          font-size:13px;
          line-height:1.7;
          color:rgba(255,255,255,.60);
        }
        .invoice-heading h1{
          margin:16px 0 24px;
          font-size:45px;
          font-weight:900;
          letter-spacing:-.07em;
        }
        .invoice-heading:after{
          right:22px;
          top:22px;
          padding:8px 14px;
          background:rgba(187,247,208,.94);
          color:#064e3b;
          box-shadow:0 14px 30px rgba(34,197,94,.12);
        }
        .invoice-kv{
          grid-template-columns:126px 1fr;
          gap:10px 16px;
          font-size:13px;
        }
        .invoice-kv strong{
          font-weight:850;
        }
        .invoice-showcase{
          margin-top:30px;
          padding:18px;
          gap:22px;
          grid-template-columns:minmax(300px,1fr) minmax(290px,.92fr);
        }
        .invoice-product-image{
          min-height:240px;
          border-radius:22px;
          box-shadow:0 18px 42px rgba(0,0,0,.20),inset 0 0 0 1px rgba(255,255,255,.055);
        }
        .invoice-product-info{
          border-radius:22px;
          background:rgba(255,255,255,.04);
        }
        .product-info-row{
          grid-template-columns:116px 1fr;
          min-height:48px;
          padding:0 17px;
          font-size:13px;
        }
        .product-info-row strong{
          font-weight:850;
        }
        .product-info-row span{
          line-height:1.25;
        }
        .items-table{
          margin-top:30px;
          border-radius:24px;
          overflow:hidden;
          box-shadow:0 16px 42px rgba(0,0,0,.12);
        }
        .items-table th{
          padding:15px 18px;
          font-size:10px;
          letter-spacing:.22em;
          font-weight:850;
          background:rgba(255,255,255,.07);
        }
        .items-table td{
          padding:18px;
          font-size:13px;
        }
        .description-cell strong{
          font-size:13px;
          font-weight:850;
        }
        .description-cell span{
          margin-top:9px;
          padding:5px 10px;
          font-size:9px;
          letter-spacing:.14em;
        }
        .invoice-total-stack{
          width:340px;
          margin-top:18px;
          padding:19px 22px;
          border-radius:24px;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 16px 42px rgba(0,0,0,.10);
        }
        .invoice-total-line{
          font-size:13px;
        }
        .invoice-total-line.grand{
          margin-top:11px;
          padding-top:14px;
          font-size:23px;
        }
        .payment-strip{
          margin-top:34px;
          padding:22px 28px;
          border-radius:25px;
          box-shadow:0 20px 46px rgba(20,184,166,.11);
        }
        .payment-strip th{
          font-size:12px;
          font-weight:850;
        }
        .payment-strip td{
          font-size:12px;
          color:rgba(255,255,255,.88);
        }
        .must-read{
          margin-top:30px;
          padding:24px 26px;
        }
        .must-read strong{
          font-size:17px;
          font-weight:850;
        }
        .must-read{
          font-size:13px;
          line-height:1.72;
        }
        .invoice-signature-row{
          margin-top:32px;
          padding-top:28px;
          align-items:center;
        }
        .signature-name{
          font-size:23px;
          letter-spacing:-.03em;
        }
        .invoice-seal{
          width:88px;
          height:88px;
          border:7px solid rgba(20,184,166,.74);
          box-shadow:0 16px 38px rgba(20,184,166,.20);
        }
        .invoice-action-bar{
          margin-top:34px;
          margin-bottom:18px;
        }
        .invoice-action-bar button,.invoice-action-bar a{
          min-width:124px;
          justify-content:center;
          padding:15px 30px;
          transition:transform .18s ease,filter .18s ease,box-shadow .18s ease;
        }
        .invoice-action-bar button:hover,.invoice-action-bar a:hover{
          transform:translateY(-2px);
          filter:brightness(1.08);
          box-shadow:0 18px 36px rgba(0,0,0,.18);
        }
        .invoice-bottom-note{
          font-size:12px;
          padding-bottom:30px;
        }
        .invoice-heading:after{content:"${escapeHtml(invoiceDisplayStatus).toUpperCase()}";}
        .invoice-heading.status-paid:after{background:rgba(187,247,208,.94);color:#064e3b;}
        .invoice-heading.status-refunded:after{background:rgba(191,219,254,.94);color:#1e3a8a;}
        .invoice-heading.status-pending:after,.invoice-heading.status-unpaid:after{background:rgba(254,240,138,.94);color:#713f12;}
        .invoice-heading.status-failed:after,.invoice-heading.status-cancelled:after{background:rgba(254,205,211,.94);color:#881337;}
        .invoice-watermark{
          position:absolute;
          right:36px;
          top:232px;
          z-index:0;
          transform:rotate(-12deg);
          color:rgba(255,255,255,.035);
          font-size:74px;
          font-weight:900;
          letter-spacing:.08em;
          text-transform:uppercase;
          pointer-events:none;
        }
        .invoice-watermark.status-cancelled,.invoice-watermark.status-failed{color:rgba(251,113,133,.07);}
        .invoice-print-body > *{position:relative;z-index:1;}
        .invoice-proof-grid{display:grid;grid-template-columns:1fr 230px;gap:20px;margin-top:28px;}
        .invoice-support-card,.invoice-proof-card{
          border:1px solid rgba(255,255,255,.075);
          border-radius:24px;
          background:linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.028));
          padding:20px 22px;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
        }
        .invoice-support-card p,.invoice-proof-card p{margin:8px 0 0;color:rgba(255,255,255,.56);font-size:12px;line-height:1.65;}
        .invoice-support-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px;}
        .invoice-support-list span{border-radius:14px;background:rgba(255,255,255,.045);padding:10px;color:rgba(255,255,255,.68);font-size:10px;font-weight:800;}
        .invoice-timeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:16px;}
        .invoice-timeline-step{position:relative;min-height:72px;border-radius:16px;background:rgba(255,255,255,.04);padding:12px;border:1px solid rgba(255,255,255,.055);}
        .invoice-timeline-step:before{content:"";display:block;width:9px;height:9px;border-radius:999px;background:rgba(255,255,255,.22);box-shadow:0 0 0 5px rgba(255,255,255,.035);}
        .invoice-timeline-step.is-active{border-color:rgba(126,231,224,.14);background:rgba(20,184,166,.055);}
        .invoice-timeline-step.is-active:before{background:#7ee7e0;box-shadow:0 0 0 5px rgba(126,231,224,.09);}
        .invoice-timeline-step.is-danger{border-color:rgba(251,113,133,.14);background:rgba(244,63,94,.055);}
        .invoice-timeline-step.is-danger:before{background:#fda4af;box-shadow:0 0 0 5px rgba(251,113,133,.08);}
        .invoice-timeline-step strong{display:block;margin-top:10px;color:rgba(255,255,255,.82);font-size:10px;font-weight:900;}
        .invoice-timeline-step span{display:block;margin-top:5px;color:rgba(255,255,255,.36);font-size:9px;line-height:1.45;}
        .invoice-proof-card{display:grid;grid-template-columns:78px 1fr;gap:14px;align-items:center;}
        .invoice-qr{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;width:78px;height:78px;border-radius:18px;background:rgba(255,255,255,.055);padding:12px;border:1px solid rgba(255,255,255,.08);}
        .invoice-qr i{border-radius:3px;background:rgba(255,255,255,.10);}
        .invoice-qr i.is-active{background:rgba(126,231,224,.74);}
        .invoice-qr-img{width:82px;height:82px;border-radius:18px;border:1px solid rgba(255,255,255,.10);background:#fff;padding:7px;object-fit:contain;box-shadow:0 14px 34px rgba(0,0,0,.18);}
        .invoice-qr-fallback{display:none;}
        .invoice-proof-link{display:block;margin-top:8px;word-break:break-all;color:rgba(126,231,224,.72);font-size:10px;text-decoration:none;}
        .invoice-action-bar .copy-invoice{background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.07));}
        .invoice-action-bar button.copy-invoice:after{content:"Copy link";font-size:15px;}
        @media(max-width:720px){
          .invoice-print-brand,.invoice-intro,.invoice-showcase{display:block;}
          .invoice-address,.invoice-heading{margin-top:18px;text-align:left;}
          .invoice-total-stack{width:auto;}
          .invoice-proof-grid,.invoice-proof-card{display:block;}
          .invoice-proof-card{margin-top:14px;}
          .invoice-support-list{grid-template-columns:1fr;}
          .invoice-timeline{grid-template-columns:1fr;}
        }
        @media(max-width:720px){.invoice-address,.invoice-heading{color:#fff;text-shadow:none}}
        @media print{body{background:#10151c}.invoice-print-template{box-shadow:none;border-radius:0}.invoice-action-bar,.invoice-bottom-note{display:none}}
      </style>
      <section class="invoice-print-template">
        <div class="invoice-print-header">
          <div class="invoice-print-brand">
            <div>
              <div class="invoice-logo-wrap">
                <div class="invoice-logo-symbol"><img src="${escapeHtml(invoiceLogoUrl)}" alt="Gorkcoder logo" /></div>
                <div>
                  <p class="invoice-logo-title">GORKCODER</p>
                  <div class="invoice-logo-subtitle">INVOICE</div>
                </div>
              </div>
              <div class="invoice-contact">
                <span>☎ +977 9800000000</span>
                <span>✉ support@gorkcoder.com</span>
              </div>
            </div>
            <div class="invoice-address">
              Digital Products, Courses, Notes & Projects<br/>
              Online Learning Platform<br/>
              Nepal
            </div>
          </div>
        </div>

        <div class="invoice-print-body">
          <div class="invoice-watermark status-${escapeHtml(statusClass)}">${escapeHtml(invoiceDisplayStatus)}</div>
          <div class="invoice-intro">
            <div class="buyer-panel">
              <div class="buyer-label">Buyer Info:</div>
              <div class="buyer-name">${escapeHtml(order.user?.name || "Customer")}</div>
              <div class="buyer-line">Phone: ${escapeHtml(order.user?.phone || order.shippingInfo?.phoneNo || "-")}</div>
              <div class="buyer-line">Email: ${escapeHtml(order.user?.email || "-")}</div>
              <div class="buyer-line">Address: ${escapeHtml(order.shippingInfo?.address || order.user?.address || "-")}</div>
            </div>
            <div class="invoice-heading status-${escapeHtml(statusClass)}">
              <div class="invoice-section-label">Payment receipt</div>
              <h1>INVOICE</h1>
              <div class="invoice-kv">
                <strong>Invoice No:</strong><span>#${escapeHtml(invoiceNumber)}</span>
                <strong>Invoice Date:</strong><span>${invoiceDate}</span>
                <strong>Status:</strong><span>${escapeHtml(order.status || "-")}</span>
              </div>
            </div>
          </div>

          <div class="invoice-showcase">
            <div class="invoice-product-image">
              ${
                firstImage
                  ? `<img src="${escapeHtml(firstImage)}" alt="${escapeHtml(firstItem.title || "Purchased product")}" />`
                  : `<div class="invoice-product-placeholder">Gorkcoder</div>`
              }
            </div>
            <div class="invoice-product-info">
              <div class="product-info-row"><strong>Main Item:</strong><span>${escapeHtml(firstItem.title || "Digital Order")}</span></div>
              <div class="product-info-row"><strong>Order Date:</strong><span>${invoiceDate}</span></div>
              <div class="product-info-row"><strong>Products:</strong><span>${productCount} item${productCount === 1 ? "" : "s"}</span></div>
              <div class="product-info-row"><strong>Payment:</strong><span>${escapeHtml(paymentMethod)}</span></div>
              <div class="product-info-row"><strong>Coupon:</strong><span>${escapeHtml(order.coupon?.code || "No coupon")}</span></div>
              <div class="product-info-row"><strong>Expires:</strong><span>${formatDate(order.expiresAt)}</span></div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Tax</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td colspan="5">No line items available.</td></tr>`}</tbody>
          </table>

          <div class="invoice-total-stack">
            <div class="invoice-total-line"><span>Subtotal:</span><strong>${formatCurrency(subtotal)}</strong></div>
            <div class="invoice-total-line discount"><span>Discount:</span><strong>- ${formatCurrency(discountAmount)}</strong></div>
            <div class="invoice-total-line grand"><span>Grand Total:</span><strong>${formatCurrency(order.amount)}</strong></div>
          </div>

          <div class="payment-strip">
            <table>
              <thead>
                <tr>
                  <th>Payment Details</th>
                  <th>Date</th>
                  <th>Booking ID</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${escapeHtml(paymentMethod)}</td>
                  <td>${paymentDate}</td>
                  <td>${escapeHtml(String(transactionId).slice(0, 28))}</td>
                  <td class="text-right">${formatCurrency(order.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="must-read">
            <strong>Must Read:</strong>
            ${
              normalizedStatus === "cancelled"
                ? "This invoice has been voided because the order was cancelled. It remains available only as an audit record and does not grant access."
                : "This invoice confirms digital access for the products listed above. Download links and course access remain available from your account dashboard while your access is active."
            }
            This is a computer generated receipt and does not require a physical signature.
          </div>

          <div class="invoice-proof-grid">
            <div class="invoice-support-card">
              <div class="invoice-section-label">Access, refund & support</div>
              <p>${escapeHtml(accessMessage)}</p>
              <div class="invoice-support-list">
                <span>Refund: ${escapeHtml(refundStatus)}</span>
                <span>Support: support@gorkcoder.com</span>
                <span>Review SLA: 3-5 days</span>
              </div>
              <p>${escapeHtml(refundSlaText)}</p>
              <div class="invoice-timeline">
                ${refundTimeline.steps
                  .map(
                    (step) => `<span class="invoice-timeline-step ${step.active ? "is-active" : ""} ${step.danger ? "is-danger" : ""}">
                      <strong>${escapeHtml(step.label)}</strong>
                      <span>${escapeHtml(step.date ? formatDate(step.date) : step.description)}</span>
                    </span>`,
                  )
                  .join("")}
              </div>
            </div>
            <div class="invoice-proof-card">
              ${qrImageUrl ? `<img class="invoice-qr-img" src="${escapeHtml(qrImageUrl)}" alt="Scan invoice verification QR" />` : `<span class="invoice-qr">${qrMarkup}</span>`}
              <span>
                <span class="invoice-section-label">Invoice proof</span>
                <p>Use this public proof link to verify the receipt without exposing private invoice details.</p>
                <a class="invoice-proof-link" href="${escapeHtml(verificationUrl)}">${escapeHtml(verificationUrl)}</a>
                <span class="invoice-qr-fallback">${qrMarkup}</span>
              </span>
            </div>
          </div>

          <div class="invoice-signature-row">
            <div>
              <div class="invoice-section-label">Verified by</div>
              <div class="signature-name">Sunil B.K</div>
              <div class="buyer-line">Gorkcoder digital access team</div>
            </div>
            <div class="invoice-seal">${normalizedStatus === "cancelled" ? "VOID<br/>RECORD" : normalizedStatus === "refunded" ? "REFUND<br/>RECORD" : "PAID<br/>AND<br/>VERIFIED"}</div>
            <div style="text-align:right">
              <div class="invoice-section-label">Secure record</div>
              <div class="buyer-line">Invoice #${escapeHtml(invoiceNumber)}</div>
              <div class="buyer-line">Generated on ${invoiceDate}</div>
            </div>
          </div>
        </div>

        <div class="invoice-action-bar">
          <button type="button" onclick="window.print()">🖨 Print</button>
          <a href="${escapeHtml(pdfUrl)}">⬇ Download</a>
          <button class="copy-invoice" type="button" onclick="navigator.clipboard && navigator.clipboard.writeText('${escapeHtml(invoiceUrl)}')">Copy link</button>
        </div>
        <div class="invoice-bottom-note"><strong>Note:</strong> This is computer generated receipt and does not require physical signature.</div>
      </section>
    `,
  });

  if (req.query.format === "pdf" || req.headers.accept?.includes("application/pdf")) {
    order.paymentInfo = {
      ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
      invoiceDownloadedAt: new Date(),
      invoiceDownloadCount: Number(order.paymentInfo?.invoiceDownloadCount || 0) + 1,
    };
    await order.save();

    const pdf = createInvoicePdf({
      invoiceNumber,
      status: normalizedStatus,
      customer: {
        name: order.user?.name || "Customer",
        email: order.user?.email || "-",
        phone: order.user?.phone || order.shippingInfo?.phoneNo || "-",
      },
      items: order.orderItems || [],
      subtotal,
      discountAmount,
      total: order.amount,
      paymentMethod,
      transactionId,
      invoiceDate,
      paidAt: paymentDate,
      expiresAt: formatDate(order.expiresAt),
      refundStatus,
      verificationUrl,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="invoice-${order._id}.pdf"`);
    return res.send(pdf);
  }

  order.paymentInfo = {
    ...(order.paymentInfo?.toObject?.() || order.paymentInfo || {}),
    invoiceOpenedAt: new Date(),
  };
  await order.save();

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

const verifyInvoice = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.orderId).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ success: false, error: "Invoice record not found." });
  }

  const invoiceNumber = String(order._id).slice(-8).toUpperCase();
  const normalizedStatus = String(order.status || "unpaid").toLowerCase();
  const isVerified = ["paid", "refunded"].includes(normalizedStatus);
  const refundTimeline = buildRefundTimeline(order.refund, order.refund?.requestedAt);
  const firstItem = order.orderItems?.[0] || {};
  const productCount = (order.orderItems || []).reduce((total, item) => total + (Number(item.quantity || 1) || 1), 0);
  const verificationUrl = `${getBusinessBaseUrl(req)}/invoice/verify/${order._id}`;
  const qrImageUrl = await buildQrImageDataUrl(verificationUrl, 190);
  const qrMarkup = buildMiniQrMarkup(verificationUrl);

  if (req.headers.accept?.includes("application/json") || req.query.format === "json") {
    return res.status(200).json({
      success: true,
      invoice: {
        invoiceNumber,
        verified: isVerified,
        status: normalizedStatus,
        productCount,
        firstItem: firstItem.title || "Digital product",
        paymentMethod: order.paymentInfo?.method || "",
        issuedAt: order.createdAt,
        paidAt: order.paidAt,
        refund: refundTimeline,
      },
    });
  }

  const timelineMarkup = refundTimeline.steps
    .map(
      (step) => `<div class="timeline-step ${step.active ? "is-active" : ""} ${step.danger ? "is-danger" : ""}">
        <span></span>
        <strong>${escapeHtml(step.label)}</strong>
        <p>${escapeHtml(step.date ? formatDate(step.date) : step.description)}</p>
      </div>`,
    )
    .join("");

  const html = renderDocumentHtml({
    title: `Invoice verification ${invoiceNumber}`,
    eyebrow: "Public invoice verification",
    body: `
      <style>
        body{background:#0f151d;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
        .page{max-width:920px;border:1px solid rgba(255,255,255,.075);background:radial-gradient(circle at 0 0,rgba(20,184,166,.16),transparent 32%),radial-gradient(circle at 100% 0,rgba(168,85,247,.16),transparent 34%),#121820;color:#fff;box-shadow:0 30px 90px rgba(0,0,0,.34);}
        .eyebrow{color:rgba(126,231,224,.72);}
        .verify-shell{display:grid;grid-template-columns:1fr 230px;gap:24px;align-items:stretch;}
        .verify-card{position:relative;overflow:hidden;border:1px solid rgba(255,255,255,.075);border-radius:30px;background:linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.032));padding:30px;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}
        .verify-pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;border:1px solid ${isVerified ? "rgba(126,231,224,.18)" : "rgba(251,191,36,.18)"};background:${isVerified ? "rgba(20,184,166,.08)" : "rgba(245,158,11,.08)"};padding:9px 13px;color:${isVerified ? "#a7fff5" : "#fde68a"};font-size:10px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;}
        .verify-card h1{margin:24px 0 10px;color:#fff;font-size:46px;line-height:1;letter-spacing:-.07em;}
        .verify-card p{color:rgba(255,255,255,.58);font-size:13px;line-height:1.75;}
        .verify-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:24px;}
        .verify-stat{border-radius:18px;background:rgba(255,255,255,.045);padding:14px;}
        .verify-stat span{display:block;color:rgba(126,231,224,.58);font-size:9px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;}
        .verify-stat strong{display:block;margin-top:8px;color:rgba(255,255,255,.86);font-size:13px;}
        .verify-qr{display:grid;place-items:center;text-align:center;}
        .invoice-qr{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;width:128px;height:128px;border-radius:30px;background:rgba(255,255,255,.055);padding:20px;border:1px solid rgba(255,255,255,.08);}
        .invoice-qr i{border-radius:4px;background:rgba(255,255,255,.10);}
        .invoice-qr i.is-active{background:rgba(126,231,224,.78);}
        .invoice-qr-img{width:152px;height:152px;border-radius:28px;border:1px solid rgba(255,255,255,.10);background:#fff;padding:10px;box-shadow:0 20px 48px rgba(0,0,0,.22);}
        .timeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-top:24px;}
        .timeline-step{border:1px solid rgba(255,255,255,.055);border-radius:18px;background:rgba(255,255,255,.035);padding:14px;}
        .timeline-step span{display:block;width:10px;height:10px;border-radius:999px;background:rgba(255,255,255,.22);}
        .timeline-step.is-active span{background:#7ee7e0;box-shadow:0 0 0 5px rgba(126,231,224,.09);}
        .timeline-step.is-danger span{background:#fda4af;box-shadow:0 0 0 5px rgba(251,113,133,.08);}
        .timeline-step strong{display:block;margin-top:12px;color:rgba(255,255,255,.82);font-size:10px;}
        .timeline-step p{margin:5px 0 0;color:rgba(255,255,255,.36);font-size:9px;line-height:1.45;}
        .verify-search{margin-top:18px;display:flex;gap:8px;border-radius:18px;background:rgba(255,255,255,.045);padding:8px;}
        .verify-search input{min-width:0;flex:1;border:0;background:transparent;color:#fff;outline:none;padding:0 8px;font-size:12px;}
        .verify-search input::placeholder{color:rgba(255,255,255,.32);}
        .verify-search button{border:0;border-radius:14px;background:rgba(126,231,224,.16);color:#a7fff5;padding:10px 12px;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;}
        @media(max-width:760px){.verify-shell{grid-template-columns:1fr}.verify-grid,.timeline{grid-template-columns:1fr}.verify-card h1{font-size:34px}}
      </style>
      <section class="verify-shell">
        <div class="verify-card">
          <span class="verify-pill">${isVerified ? "Verified active" : "Not paid / inactive"}</span>
          <h1>Invoice #${escapeHtml(invoiceNumber)}</h1>
          <p>This public page confirms whether the invoice exists and whether the order has a valid paid or refunded payment record. Private buyer details and downloads remain protected.</p>
          <div class="verify-grid">
            <div class="verify-stat"><span>Status</span><strong>${escapeHtml(normalizedStatus)}</strong></div>
            <div class="verify-stat"><span>Gateway</span><strong>${escapeHtml(order.paymentInfo?.method || "-")}</strong></div>
            <div class="verify-stat"><span>Items</span><strong>${productCount} digital item${productCount === 1 ? "" : "s"}</strong></div>
            <div class="verify-stat"><span>Issued</span><strong>${formatDate(order.createdAt)}</strong></div>
          </div>
          <div class="timeline">${timelineMarkup}</div>
          <form class="verify-search" action="${escapeHtml(`${getBusinessBaseUrl(req)}/invoice/search`)}" method="get">
            <input name="q" placeholder="Search another invoice or order ID" />
            <button type="submit">Search</button>
          </form>
        </div>
        <div class="verify-card verify-qr">
          ${qrImageUrl ? `<img class="invoice-qr-img" src="${escapeHtml(qrImageUrl)}" alt="Scan invoice verification QR" />` : `<span class="invoice-qr">${qrMarkup}</span>`}
          <p style="margin-top:18px">Scan this QR to open the public invoice verification record.</p>
        </div>
      </section>
    `,
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

const searchInvoice = asyncHandler(async (req, res) => {
  const rawQuery = String(req.query.q || req.query.invoice || "").trim();
  const normalizedQuery = rawQuery.replace(/^#/, "").trim();

  if (!normalizedQuery) {
    return res.status(400).json({ success: false, error: "Enter an invoice number, order ID, or payment ID." });
  }

  let order = null;

  if (/^[a-f\d]{24}$/i.test(normalizedQuery)) {
    order = await OrderModel.findById(normalizedQuery);
  }

  if (!order) {
    order = await OrderModel.findOne({
      $or: [{ "paymentInfo.id": normalizedQuery }, { "paymentInfo.transactionUuid": normalizedQuery }],
    });
  }

  if (!order) {
    const recentOrders = await OrderModel.find({}).sort({ createdAt: -1 }).limit(500).select("_id status amount paymentInfo createdAt orderItems");
    order = recentOrders.find((candidate) => String(candidate._id).slice(-8).toUpperCase() === normalizedQuery.toUpperCase());
  }

  if (!order) {
    return res.status(404).json({ success: false, error: "No invoice matched that number." });
  }

  const verificationUrl = `${getBusinessBaseUrl(req)}/invoice/verify/${order._id}`;

  if (req.headers.accept?.includes("text/html") && req.query.redirect !== "false") {
    return res.redirect(verificationUrl);
  }

  res.status(200).json({
    success: true,
    invoice: {
      orderId: order._id,
      invoiceNumber: String(order._id).slice(-8).toUpperCase(),
      status: order.status,
      amount: order.amount,
      issuedAt: order.createdAt,
      verificationUrl,
      firstItem: order.orderItems?.[0]?.title || "Digital order",
    },
  });
});

const resendInvoiceEmail = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" ? { _id: req.params.orderId } : { _id: req.params.orderId, user: req.user._id };
  const order = await OrderModel.findOne(query).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found." });
  }

  if (!order.user?.email) {
    return res.status(400).json({ success: false, error: "No email address is attached to this order." });
  }

  await sendInvoiceEmail({ req, order, adminCopy: req.user.role === "admin" });

  res.status(200).json({
    success: true,
    message: "Invoice email sent successfully.",
    invoiceEmailSentAt: order.paymentInfo?.invoiceEmailSentAt,
    invoiceEmailSentCount: order.paymentInfo?.invoiceEmailSentCount || 0,
  });
});

const getCertificateDocument = asyncHandler(async (req, res) => {
  const progress = await LearningProgressModel.findOne({
    user: req.user._id,
    subject: req.params.subjectId,
    percent: { $gte: 100 },
  }).populate("subject", "name slug");

  if (!progress) {
    return res.status(403).json({ success: false, error: "Complete the course before downloading the certificate." });
  }

  const certificateId = `CERT-${String(progress._id).slice(-8).toUpperCase()}`;
  const completedAt = progress.completedAt || progress.updatedAt || new Date();
  const issuedAt = new Date();
  const verificationUrl = getCertificateVerificationUrl(req, certificateId);

  await CertificateModel.findOneAndUpdate(
    { certificateId },
    {
      certificateId,
      user: req.user._id,
      subject: progress.subject._id || progress.subject,
      completedAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const html = renderDocumentHtml({
    title: `Certificate ${certificateId}`,
    eyebrow: "Certificate of completion",
    body: `
      <section style="position:relative; overflow:hidden; border-radius:32px; border:1px solid #dbeafe; background:linear-gradient(145deg,#f8fffe 0%,#ffffff 48%,#eff6ff 100%); padding:46px 36px; text-align:center;">
        <div style="position:absolute; inset:0 auto auto 0; width:260px; height:260px; border-radius:999px; background:rgba(15,118,110,.12); filter:blur(28px);"></div>
        <div style="position:absolute; right:-80px; top:-80px; width:260px; height:260px; border-radius:999px; background:rgba(59,130,246,.12); filter:blur(28px);"></div>
        <div style="position:relative; z-index:1;">
          <div style="display:inline-flex; padding:9px 14px; border-radius:999px; background:rgba(15,118,110,.08); color:#0f766e; font-size:11px; font-weight:900; letter-spacing:.18em; text-transform:uppercase;">Gorkcoder verified certificate</div>
          <h1 style="font-size:48px; margin:22px 0 8px; letter-spacing:-.05em; color:#0f172a;">Certificate of Completion</h1>
          <p style="margin:0; color:#64748b;">This certifies that</p>
          <h2 style="font-size:36px; margin:12px 0 8px; color:#0f172a;">${escapeHtml(req.user.name || "Student")}</h2>
          <p style="margin:0; color:#64748b;">successfully completed the course</p>
          <h2 style="font-size:30px; margin:14px 0 0; color:#0f766e;">${escapeHtml(progress.subject?.name || "Course")}</h2>
          <div class="grid" style="margin-top:40px; text-align:left;">
            <div class="box"><strong>Certificate ID</strong><br/>${escapeHtml(certificateId)}</div>
            <div class="box"><strong>Completed on</strong><br/>${formatDate(completedAt)}</div>
          </div>
          <div class="box" style="margin-top:14px; text-align:left;"><strong>Verify certificate</strong><br/><a href="${escapeHtml(verificationUrl)}" style="color:#0f766e;">${escapeHtml(verificationUrl)}</a></div>
          <p style="margin-top:36px; color:#94a3b8; font-size:12px;">Issued by Sunil B.K / Gorkcoder on ${formatDate(issuedAt)}.</p>
        </div>
      </section>
    `,
  });

  if (req.query.format === "pdf" || req.headers.accept?.includes("application/pdf")) {
    const pdf = createCertificatePdf({
      certificateId,
      student: req.user.name || "Student",
      course: progress.subject?.name || "Course",
      completedOn: formatDate(completedAt),
      issuedOn: formatDate(issuedAt),
      verifyUrl: verificationUrl,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${certificateId}.pdf"`);
    return res.send(pdf);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

const getMyCertificates = asyncHandler(async (req, res) => {
  const completedProgress = await LearningProgressModel.find({
    user: req.user._id,
    percent: { $gte: 100 },
  }).select("_id subject completedAt updatedAt");

  await Promise.all(
    completedProgress
      .filter((progress) => progress.subject)
      .map((progress) => {
        const certificateId = `CERT-${String(progress._id).slice(-8).toUpperCase()}`;

        return CertificateModel.findOneAndUpdate(
          { certificateId },
          {
            certificateId,
            user: req.user._id,
            subject: progress.subject,
            completedAt: progress.completedAt || progress.updatedAt || new Date(),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }),
  );

  const certificates = await CertificateModel.find({ user: req.user._id })
    .populate("subject", "name slug thumbnail logo metaDescription description accessType price")
    .sort({ completedAt: -1, createdAt: -1 });

  const mappedCertificates = certificates.map((certificate) => {
    const subjectId = certificate.subject?._id || certificate.subject;
    const payload = {
      certificateId: certificate.certificateId,
      downloadUrl: `${getBusinessBaseUrl(req)}/certificate/${subjectId}?format=pdf`,
      verificationUrl: getCertificateVerificationUrl(req, certificate.certificateId),
    };

    return {
      _id: certificate._id,
      certificateId: certificate.certificateId,
      completedAt: certificate.completedAt,
      issuedAt: certificate.createdAt,
      course: certificate.subject
        ? {
            _id: certificate.subject._id,
            name: certificate.subject.name,
            slug: certificate.subject.slug,
            thumbnail: certificate.subject.thumbnail,
            logo: certificate.subject.logo,
            metaDescription: certificate.subject.metaDescription,
            description: certificate.subject.description,
            accessType: certificate.subject.accessType,
            price: certificate.subject.price,
          }
        : null,
      ...payload,
    };
  });

  res.status(200).json({ success: true, certificates: mappedCertificates });
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await CertificateModel.findOne({ certificateId: req.params.certificateId })
    .populate("user", "name")
    .populate("subject", "name slug metaDescription thumbnail logo");

  if (!certificate) {
    return res.status(404).json({ success: false, error: "Certificate not found." });
  }

  res.status(200).json({
    success: true,
    certificate: {
      certificateId: certificate.certificateId,
      student: certificate.user?.name || "Student",
      course: certificate.subject?.name || "Course",
      courseSlug: certificate.subject?.slug || "",
      courseDescription: certificate.subject?.metaDescription || "",
      courseThumbnail: certificate.subject?.thumbnail || certificate.subject?.logo || null,
      completedAt: certificate.completedAt,
      issuedAt: certificate.createdAt,
    },
  });
});

const saveCartAbandonment = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const subtotal = Number(req.body.subtotal || 0);

  if (items.length === 0) {
    await CartAbandonmentModel.updateMany({ user: req.user._id, status: "open" }, { status: "dismissed" });
    return res.status(200).json({ success: true });
  }

  const cart = await CartAbandonmentModel.findOneAndUpdate(
    { user: req.user._id, status: "open" },
    {
      items: items.map((item) => ({
        product: item.product || item.id,
        productType: item.productType || item.type || "",
        title: item.title || item.name || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),
      subtotal,
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({ success: true, cart });
});

const getMyAbandonedCart = asyncHandler(async (req, res) => {
  const cart = await CartAbandonmentModel.findOne({ user: req.user._id, status: "open" }).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, cart });
});

const createRefundRequest = asyncHandler(async (req, res) => {
  const reason = String(req.body.reason || "").trim();
  const allowedCategories = ["duplicate", "wrong_purchase", "technical_issue", "not_as_expected", "other"];
  const allowedMethods = ["original_payment", "bank_transfer", "esewa", "other"];
  const category = allowedCategories.includes(req.body.category) ? req.body.category : "other";
  const refundMethod = allowedMethods.includes(req.body.refundMethod) ? req.body.refundMethod : "original_payment";
  const refundContact = String(req.body.refundContact || "").trim();

  if (!reason) {
    return res.status(400).json({ success: false, error: "Refund reason is required." });
  }

  if (reason.length < 12) {
    return res.status(400).json({ success: false, error: "Please add a little more detail to your refund reason." });
  }

  const order = await OrderModel.findOne({ _id: req.params.orderId, user: req.user._id, status: "paid" });

  if (!order) {
    return res.status(404).json({ success: false, error: "Paid order not found." });
  }

  const refundRequest = await RefundRequestModel.findOneAndUpdate(
    { user: req.user._id, order: order._id },
    { reason, category, refundMethod, refundContact, status: "requested" },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  order.refund = {
    ...(order.refund?.toObject?.() || order.refund || {}),
    status: "requested",
    requestedAt: new Date(),
    reason,
    refundMethod,
    refundContact,
  };
  await order.save();

  await NotificationModel.create({
    user: req.user._id,
    type: "payment",
    title: "Refund request submitted",
    message: "Your refund request was sent to admin for review. Most requests are reviewed within 3-5 business days.",
    link: "/account?tab=orders",
  });

  await sendSafeEmail({
    email: req.user.email,
    subject: "Gorkcoder refund request received",
    title: "Refund request received",
    message: `Hi ${req.user.name || "there"}, we received your refund request for order #${String(order._id).slice(-8).toUpperCase()}. Our team reviews payment, access, and order records before making a decision. Most requests are reviewed within 3-5 business days. You can track the timeline from your dashboard.`,
    btnTitle: "Track Refund",
  });

  await writeAuditLog({ req, action: "refund.requested", entityType: "Order", entityId: order._id, message: "Refund requested by user." });
  res.status(201).json({ success: true, refundRequest, timeline: buildRefundTimeline(refundRequest, refundRequest.createdAt) });
});

const getMyRefundRequests = asyncHandler(async (req, res) => {
  const refunds = await RefundRequestModel.find({ user: req.user._id }).populate("order", "amount paymentInfo status createdAt paidAt refund orderItems").sort({ updatedAt: -1 }).lean();
  const refundsWithTimeline = refunds.map((refund) => ({
    ...refund,
    timeline: buildRefundTimeline(refund, refund.createdAt),
  }));
  res.status(200).json({ success: true, refunds: refundsWithTimeline });
});

const createSupportTicket = asyncHandler(async (req, res) => {
  const subject = String(req.body.subject || "").trim();
  const message = String(req.body.message || "").trim();

  if (!subject || !message) {
    return res.status(400).json({ success: false, error: "Subject and message are required." });
  }

  const ticket = await SupportTicketModel.create({
    user: req.user._id,
    subject,
    message,
    priority: req.body.priority || "normal",
  });

  await NotificationModel.create({
    user: req.user._id,
    type: "support",
    title: "Support ticket created",
    message: "We received your support request.",
    link: "/account?tab=support",
  });

  res.status(201).json({ success: true, ticket });
});

const getMySupportTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicketModel.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.status(200).json({ success: true, tickets });
});

const replySupportTicket = asyncHandler(async (req, res) => {
  const message = String(req.body.message || "").trim();

  if (!message) {
    return res.status(400).json({ success: false, error: "Reply message is required." });
  }

  const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
  const ticket = await SupportTicketModel.findOne(query).populate("user", "name email");

  if (!ticket) {
    return res.status(404).json({ success: false, error: "Support ticket not found." });
  }

  ticket.replies.push({ user: req.user._id, message, isAdmin: req.user.role === "admin" });
  ticket.status = req.user.role === "admin" ? "pending" : "open";
  await ticket.save();

  await NotificationModel.create({
    user: ticket.user?._id || ticket.user,
    type: "support",
    title: req.user.role === "admin" ? "Support replied" : "Support reply added",
    message: req.user.role === "admin" ? "Admin replied to your support ticket." : "Your reply was added to the support ticket.",
    link: "/account?tab=support",
  });

  if (req.user.role === "admin" && ticket.user?.email) {
    await sendSafeEmail({
      email: ticket.user.email,
      subject: "Support replied to your ticket",
      title: "Support reply received",
      message: `Hi ${ticket.user.name || ""}, admin replied to your support ticket: ${escapeHtml(message)}`,
      btnTitle: "Open Support",
    });
  }

  res.status(200).json({ success: true, ticket });
});

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [orders, downloadsCount, reviewsPending, ticketsOpen, openAbandonedCarts, questionsPending] = await Promise.all([
    OrderModel.find({}).populate("user", "name email").sort({ createdAt: -1 }).limit(200),
    DownloadLogModel.countDocuments({}),
    ReviewModel.countDocuments({ status: "pending" }),
    SupportTicketModel.countDocuments({ status: { $in: ["open", "pending"] } }),
    CartAbandonmentModel.countDocuments({ status: "open" }),
    ProductQuestionModel.countDocuments({ status: "pending" }),
  ]);

  const paidOrders = orders.filter((order) => order.status === "paid");
  const totalRevenue = paidOrders.reduce((total, order) => total + Number(order.amount || 0), 0);
  const monthlyRevenue = paidOrders
    .filter((order) => new Date(order.paidAt || order.createdAt) >= startOfMonth)
    .reduce((total, order) => total + Number(order.amount || 0), 0);
  const unpaidOrders = orders.filter((order) => ["unpaid", "pending", "failed"].includes(order.status || "unpaid")).length;
  const productMap = new Map();
  const monthlyMap = new Map();
  const productTypeRevenue = {};
  const couponMap = new Map();

  paidOrders.forEach((order) => {
    const paidDate = new Date(order.paidAt || order.createdAt);
    const monthKey = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + Number(order.amount || 0));

    if (order.coupon?.code) {
      const currentCoupon = couponMap.get(order.coupon.code) || { code: order.coupon.code, uses: 0, discount: 0, revenue: 0 };
      currentCoupon.uses += 1;
      currentCoupon.discount += Number(order.discountAmount || 0);
      currentCoupon.revenue += Number(order.amount || 0);
      couponMap.set(order.coupon.code, currentCoupon);
    }

    (order.orderItems || []).forEach((item) => {
      const key = `${item.productModel}-${item.product}`;
      const current = productMap.get(key) || {
        title: item.title,
        productModel: item.productModel,
        sold: 0,
        revenue: 0,
      };
      current.sold += item.quantity || 1;
      current.revenue += Number(item.price || 0) * (item.quantity || 1);
      productMap.set(key, current);

      productTypeRevenue[item.productModel] = (productTypeRevenue[item.productModel] || 0) + Number(item.price || 0) * (item.quantity || 1);
    });
  });

  const bestSellers = Array.from(productMap.values()).sort((first, second) => second.revenue - first.revenue).slice(0, 8);
  const monthlyRevenueSeries = Array.from(monthlyMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((first, second) => first.month.localeCompare(second.month))
    .slice(-12);
  const couponPerformance = Array.from(couponMap.values()).sort((first, second) => second.revenue - first.revenue).slice(0, 8);
  const conversionRate = orders.length ? Number(((paidOrders.length / orders.length) * 100).toFixed(1)) : 0;

  res.status(200).json({
    success: true,
    analytics: {
      totalRevenue,
      monthlyRevenue,
      paidOrders: paidOrders.length,
      unpaidOrders,
      downloadsCount,
      reviewsPending,
      ticketsOpen,
      openAbandonedCarts,
      questionsPending,
      conversionRate,
      monthlyRevenueSeries,
      productTypeRevenue,
      couponPerformance,
      bestSellers,
      recentOrders: orders.slice(0, 10),
    },
  });
});

const adminListReviews = asyncHandler(async (req, res) => {
  const reviews = await ReviewModel.find(req.query.status ? { status: req.query.status } : {})
    .populate("user", "name email")
    .populate("product", "title name slug")
    .sort({ createdAt: -1 })
    .limit(200);

  res.status(200).json({ success: true, reviews });
});

const adminUpdateReview = asyncHandler(async (req, res) => {
  const review = await ReviewModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found." });
  }

  await writeAuditLog({ req, action: "review.moderated", entityType: "ProductReview", entityId: review._id, message: `Review marked ${review.status}.` });
  res.status(200).json({ success: true, review });
});

const adminListQuestions = asyncHandler(async (req, res) => {
  const questions = await ProductQuestionModel.find(req.query.status ? { status: req.query.status } : {})
    .populate("user", "name email")
    .populate("answeredBy", "name email")
    .populate("product", "title name slug")
    .sort({ createdAt: -1 })
    .limit(200);

  res.status(200).json({ success: true, questions });
});

const adminAnswerQuestion = asyncHandler(async (req, res) => {
  const answer = String(req.body.answer || "").trim();
  const status = req.body.status || (answer ? "answered" : "hidden");

  const question = await ProductQuestionModel.findById(req.params.id).populate("user", "name email");

  if (!question) {
    return res.status(404).json({ success: false, error: "Question not found." });
  }

  question.answer = answer || question.answer;
  question.status = status;
  question.answeredBy = req.user._id;
  question.answeredAt = answer ? new Date() : question.answeredAt;
  await question.save();

  if (answer && question.user?.email) {
    await NotificationModel.create({
      user: question.user._id,
      type: "info",
      title: "Your product question was answered",
      message: "Admin answered your question. Open the product page to view it.",
    });

    await sendSafeEmail({
      email: question.user.email,
      subject: "Your product question was answered",
      title: "Question answered",
      message: `Hi ${question.user.name || ""}, admin answered your product question: ${escapeHtml(answer)}`,
      btnTitle: "View Answer",
    });
  }

  await writeAuditLog({ req, action: "question.answered", entityType: "ProductQuestion", entityId: question._id, message: "Product question updated." });
  res.status(200).json({ success: true, question });
});

const adminListTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicketModel.find(req.query.status ? { status: req.query.status } : {})
    .populate("user", "name email")
    .populate("replies.user", "name email")
    .sort({ updatedAt: -1 })
    .limit(200);

  res.status(200).json({ success: true, tickets });
});

const adminUpdateTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicketModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });

  if (!ticket) {
    return res.status(404).json({ success: false, error: "Support ticket not found." });
  }

  await writeAuditLog({ req, action: "support.status_updated", entityType: "SupportTicket", entityId: ticket._id, message: `Ticket marked ${ticket.status}.` });
  res.status(200).json({ success: true, ticket });
});

const adminCreateNotification = asyncHandler(async (req, res) => {
  const notification = await NotificationModel.create({
    user: req.body.user || undefined,
    audience: req.body.audience || (req.body.user ? "user" : "all"),
    title: req.body.title,
    message: req.body.message,
    type: req.body.type || "info",
    link: req.body.link || "",
  });

  await writeAuditLog({ req, action: "notification.created", entityType: "Notification", entityId: notification._id, message: notification.title });
  res.status(201).json({ success: true, notification });
});

const adminUpsertPlan = asyncHandler(async (req, res) => {
  const payload = {
    name: req.body.name,
    slug: String(req.body.slug || req.body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: req.body.description || "",
    price: Number(req.body.price || 0),
    durationDays: Number(req.body.durationDays || 365),
    features: Array.isArray(req.body.features) ? req.body.features : String(req.body.features || "").split("\n").filter(Boolean),
    isPopular: Boolean(req.body.isPopular),
    isActive: req.body.isActive !== false,
  };
  const plan = req.params.id ? await MembershipPlanModel.findByIdAndUpdate(req.params.id, payload, { new: true }) : await MembershipPlanModel.create(payload);

  await writeAuditLog({ req, action: req.params.id ? "plan.updated" : "plan.created", entityType: "MembershipPlan", entityId: plan._id, message: plan.name });
  res.status(req.params.id ? 200 : 201).json({ success: true, plan });
});

const adminListPlans = asyncHandler(async (req, res) => {
  const plans = await MembershipPlanModel.find({}).sort({ price: 1 });
  res.status(200).json({ success: true, plans });
});

const adminUpsertBundle = asyncHandler(async (req, res) => {
  const payload = {
    title: req.body.title,
    slug: String(req.body.slug || req.body.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: req.body.description || "",
    items: Array.isArray(req.body.items) ? req.body.items : [],
    price: Number(req.body.price || 0),
    compareAtPrice: Number(req.body.compareAtPrice || 0),
    isActive: req.body.isActive !== false,
  };
  const bundle = req.params.id ? await BundleModel.findByIdAndUpdate(req.params.id, payload, { new: true }) : await BundleModel.create(payload);

  await writeAuditLog({ req, action: req.params.id ? "bundle.updated" : "bundle.created", entityType: "Bundle", entityId: bundle._id, message: bundle.title });
  res.status(req.params.id ? 200 : 201).json({ success: true, bundle });
});

const adminListBundles = asyncHandler(async (req, res) => {
  const bundles = await BundleModel.find({}).populate("items.product", "title name slug").sort({ createdAt: -1 });
  res.status(200).json({ success: true, bundles });
});

const adminListAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLogModel.find({}).populate("actor", "name email").sort({ createdAt: -1 }).limit(200);
  res.status(200).json({ success: true, logs });
});

const adminListDownloads = asyncHandler(async (req, res) => {
  const downloads = await DownloadLogModel.find({}).populate("user", "name email").sort({ createdAt: -1 }).limit(200);
  res.status(200).json({ success: true, downloads });
});

const adminListPaymentEvents = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.provider && req.query.provider !== "all") {
    query.provider = req.query.provider;
  }

  if (req.query.type) {
    query.type = { $regex: String(req.query.type), $options: "i" };
  }

  if (req.query.status && req.query.status !== "all") {
    query.status = req.query.status;
  }

  const events = await PaymentEventModel.find(query)
    .populate({
      path: "order",
      select: "amount status paymentInfo user createdAt",
      populate: { path: "user", select: "name email" },
    })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  res.status(200).json({ success: true, events });
});

const previewEmailTemplate = asyncHandler(async (req, res) => {
  const template = String(req.params.template || "invoice").toLowerCase();
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const previewMap = {
    invoice: {
      title: "Gorkcoder invoice ready",
      subject: "Your Gorkcoder invoice is ready",
      message:
        "Your secure invoice is ready. You can open the invoice, download the PDF copy, or use the public verification link whenever you need proof of purchase.",
      btnTitle: "Open Invoice",
      link: `${baseUrl}/api/v1/business/invoice/verify/preview`,
    },
    refund: {
      title: "Refund request received",
      subject: "Gorkcoder refund request received",
      message:
        "We received your refund request and our team will review it within 3-5 business days. You can track the latest status from your dashboard.",
      btnTitle: "Track Refund",
      link: `${process.env.FORNTEND_URL || "http://localhost:5173"}/account?tab=refunds`,
    },
    payment_failed: {
      title: "Payment alert",
      subject: "Gorkcoder payment alert",
      message:
        "A gateway event needs attention. Please review the order, gateway status, and audit log before retrying or contacting the customer.",
      btnTitle: "Review Orders",
      link: `${process.env.DASHBOARD_URL || "http://localhost:5172"}/orders`,
    },
  };

  const preview = previewMap[template] || previewMap.invoice;
  const html = generateEmailTemplate({
    title: preview.title,
    message: preview.message,
    logo: emailPreviewLogo,
    banner: emailPreviewBanner,
    link: preview.link,
    btnTitle: preview.btnTitle,
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html.replace(/cid:/g, ""));
});

const exportPaymentEventsCsv = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.provider && req.query.provider !== "all") {
    query.provider = req.query.provider;
  }

  if (req.query.status && req.query.status !== "all") {
    query.status = req.query.status;
  }

  const events = await PaymentEventModel.find(query)
    .populate({
      path: "order",
      select: "amount status paymentInfo user createdAt",
      populate: { path: "user", select: "name email" },
    })
    .sort({ createdAt: -1 })
    .limit(5000)
    .lean();

  const header = ["Event ID", "Provider", "Type", "Status", "Message", "Order ID", "Order Status", "Amount", "User", "Email", "Created"];
  const rows = events.map((event) => [
    event.eventId || event._id,
    event.provider || "",
    event.type || "",
    event.status || "",
    event.message || "",
    event.order?._id || "",
    event.order?.status || "",
    event.order?.amount || "",
    event.order?.user?.name || "",
    event.order?.user?.email || "",
    event.createdAt || event.processedAt || "",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=payment-events-export.csv");
  res.send(csv);
});

const adminListAbandonedCarts = asyncHandler(async (req, res) => {
  const carts = await CartAbandonmentModel.find(req.query.status ? { status: req.query.status } : {})
    .populate("user", "name email")
    .sort({ updatedAt: -1 })
    .limit(200);

  res.status(200).json({ success: true, carts });
});

const adminListRefundRequests = asyncHandler(async (req, res) => {
  const query = req.query.status && req.query.status !== "all" ? { status: req.query.status } : {};
  const refunds = await RefundRequestModel.find(query)
    .populate("user", "name email")
    .populate("order", "amount paymentInfo status createdAt paidAt refund orderItems")
    .sort({ updatedAt: -1 })
    .limit(200)
    .lean();
  const refundsWithTimeline = refunds.map((refund) => ({
    ...refund,
    timeline: buildRefundTimeline(refund, refund.createdAt),
  }));

  res.status(200).json({ success: true, refunds: refundsWithTimeline });
});

const adminUpdateRefundRequest = asyncHandler(async (req, res) => {
  const refund = await RefundRequestModel.findById(req.params.id).populate("user", "name email").populate("order");

  if (!refund) {
    return res.status(404).json({ success: false, error: "Refund request not found." });
  }

  const status = req.body.status || refund.status;
  refund.status = status;
  refund.adminNote = req.body.adminNote || refund.adminNote || "";
  refund.resolvedBy = req.user._id;
  refund.resolvedAt = new Date();
  await refund.save();

  if (refund.order) {
    refund.order.refund = {
      ...(refund.order.refund?.toObject?.() || refund.order.refund || {}),
      status,
      resolvedAt: refund.resolvedAt,
      adminNote: refund.adminNote,
      reason: refund.reason,
      refundMethod: refund.refundMethod,
      refundContact: refund.refundContact,
    };

    if (status === "refunded") {
      refund.order.status = "refunded";
      refund.order.paymentInfo = {
        ...(refund.order.paymentInfo?.toObject?.() || refund.order.paymentInfo || {}),
        status: "refunded",
        refundedAt: refund.resolvedAt,
      };
    }

    await refund.order.save();
  }

  await NotificationModel.create({
    user: refund.user._id,
    type: "payment",
    title: `Refund ${status}`,
    message: refund.adminNote || `Your refund request was marked ${status}.`,
    link: "/account?tab=orders",
  });

  await sendSafeEmail({
    email: refund.user.email,
    subject: `Gorkcoder refund ${status}`,
    title: `Refund ${status}`,
    message: `Hi ${refund.user.name || "there"}, your refund request for order #${String(refund.order?._id || "").slice(-8).toUpperCase()} was marked ${status}. ${refund.adminNote ? `Admin note: ${refund.adminNote}` : "Open your dashboard to view the latest timeline and details."}`,
    btnTitle: "Open Dashboard",
  });

  await writeAuditLog({ req, action: "refund.updated", entityType: "RefundRequest", entityId: refund._id, message: `Refund marked ${status}.` });
  res.status(200).json({ success: true, refund: { ...(refund.toObject?.() || refund), timeline: buildRefundTimeline(refund, refund.createdAt) } });
});

const exportOrdersCsv = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({}).populate("user", "name email").sort({ createdAt: -1 }).limit(5000);
  const header = ["Order ID", "User", "Email", "Status", "Amount", "Gateway", "Paid At", "Refund"];
  const rows = orders.map((order) => [
    order._id,
    order.user?.name || "",
    order.user?.email || "",
    order.status || "",
    order.amount || 0,
    order.paymentInfo?.method || "",
    order.paidAt || "",
    order.refund?.status || "none",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=orders-export.csv");
  res.send(csv);
});

const exportUsersCsv = asyncHandler(async (req, res) => {
  const users = await require("../../models/users/UserModel").find({}).select("name email role paid isVerified createdAt").sort({ createdAt: -1 }).limit(5000);
  const header = ["User ID", "Name", "Email", "Role", "Paid", "Verified", "Created"];
  const rows = users.map((user) => [user._id, user.name || "", user.email || "", user.role || "", user.paid ? "yes" : "no", user.isVerified ? "yes" : "no", user.createdAt || ""]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=users-export.csv");
  res.send(csv);
});

module.exports = {
  getPublicBusiness,
  getMyNotifications,
  markNotificationRead,
  getProductReviews,
  createProductReview,
  getProductQuestions,
  createProductQuestion,
  getCourseProgress,
  updateCourseProgress,
  secureDownload,
  createSecureDownloadLink,
  downloadWithToken,
  getInvoiceDocument,
  verifyInvoice,
  searchInvoice,
  resendInvoiceEmail,
  getCertificateDocument,
  getMyCertificates,
  verifyCertificate,
  getMyDownloads,
  saveCartAbandonment,
  getMyAbandonedCart,
  createRefundRequest,
  getMyRefundRequests,
  createSupportTicket,
  getMySupportTickets,
  replySupportTicket,
  getAdminAnalytics,
  adminListReviews,
  adminUpdateReview,
  adminListQuestions,
  adminAnswerQuestion,
  adminListTickets,
  adminUpdateTicket,
  adminCreateNotification,
  adminUpsertPlan,
  adminListPlans,
  adminUpsertBundle,
  adminListBundles,
  adminListAuditLogs,
  adminListDownloads,
  adminListPaymentEvents,
  previewEmailTemplate,
  adminListAbandonedCarts,
  adminListRefundRequests,
  adminUpdateRefundRequest,
  exportOrdersCsv,
  exportUsersCsv,
  exportPaymentEventsCsv,
};


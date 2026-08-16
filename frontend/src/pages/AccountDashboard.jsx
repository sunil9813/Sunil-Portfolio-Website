import PropTypes from "prop-types";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaAward,
  FaBookmark,
  FaCamera,
  FaChartLine,
  FaCopy,
  FaCreditCard,
  FaDownload,
  FaEnvelopeOpenText,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFolderOpen,
  FaGraduationCap,
  FaKey,
  FaLock,
  FaPaperclip,
  FaRegCommentDots,
  FaProjectDiagram,
  FaRegNewspaper,
  FaRegUser,
  FaMoneyCheckAlt,
  FaShieldAlt,
  FaStar,
  FaTrashAlt,
  FaTimes,
  FaUndoAlt,
  FaUserEdit,
} from "react-icons/fa";
import { IoCheckmarkCircle, IoHelpCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";

import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { changePassword, getUserProfile, logout, sendVerificationEmail, updateUserCover, updateUserProfile } from "@/redux/slices/authSlice";
import { getMyTestimonials } from "@/redux/slices/portfolio/testimonialSlice";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import { submitEsewaForm } from "@/utils/payment";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

const isNoteSubject = (item) => (Array.isArray(item?.resourceFiles) && item.resourceFiles.length > 0) || Boolean(item?.resourceFile?.filePath || item?.resourceFile?.url);

const FAVORITE_META = {
  Blog: {
    label: "Blogs",
    singular: "Blog",
    icon: <FaRegNewspaper />,
    path: (item) => `/view-blog/${item?.slug || item?._id}`,
    accent: "text-sky-600 dark:text-sky-200/70",
  },
  Courses: {
    label: "Courses",
    singular: "Course",
    icon: <FaGraduationCap />,
    path: (item) => `/course/${item?.slug || item?._id}`,
    accent: "text-teal-600 dark:text-teal-200/70",
  },
  Notes: {
    label: "Notes",
    singular: "Note",
    icon: <FaFileAlt />,
    path: (item) => `/note/${item?.slug || item?._id}`,
    accent: "text-cyan-600 dark:text-cyan-200/70",
  },
  Project: {
    label: "Projects",
    singular: "Project",
    icon: <FaProjectDiagram />,
    path: (item) => `/project-details/${item?.slug || item?._id}`,
    accent: "text-violet-600 dark:text-violet-200/70",
  },
  Chapter: {
    label: "Courses",
    singular: "Course",
    icon: <FaFileAlt />,
    path: (item) => `/course/${item?.slug || item?.subject?.slug || item?._id}`,
    accent: "text-amber-600 dark:text-amber-200/70",
  },
};

const tabs = [
  { id: "overview", label: "Overview", section: "Workspace", icon: <FaChartLine />, description: "Your saved work, messages, learning, and account health at a glance." },
  { id: "account", label: "Account", section: "Account", icon: <FaRegUser />, description: "Update your profile, change password, and review account status from one place." },
  { id: "bookmarks", label: "Bookmarks", section: "Library", icon: <FaBookmark />, description: "Blogs, notes, projects, and courses you saved." },
  { id: "likes", label: "Likes", section: "Library", icon: <FaStar />, description: "All content you liked, grouped by type." },
  { id: "learning", label: "Learning", section: "Library", icon: <FaGraduationCap />, description: "Notes and course resources connected to your recent activity." },
  { id: "downloads", label: "Downloads", section: "Library", icon: <FaFolderOpen />, description: "Downloaded resources and files when download tracking is available." },
  { id: "communication", label: "Communication", section: "Communication", icon: <FaEnvelopeOpenText />, description: "Messages you submitted plus quick feedback and inquiry actions." },
  { id: "comments", label: "Comments", section: "Communication", icon: <FaRegCommentDots />, description: "Your comments across blogs, notes, courses, and projects." },
  { id: "notifications", label: "Alerts", section: "Communication", icon: <IoNotificationsOutline />, description: "Replies, verification prompts, and account notices." },
  { id: "support", label: "Support", section: "Communication", icon: <IoHelpCircleOutline />, description: "Create support tickets and track admin replies." },
  { id: "orders", label: "Orders", section: "Business", icon: <FaPaperclip />, description: "Orders, payments, expiry, and access records." },
  { id: "certificates", label: "Certificates", section: "Business", icon: <FaAward />, description: "Certificates unlocked after completing your courses." },
  { id: "refunds", label: "Refunds", section: "Business", icon: <FaUndoAlt />, description: "Request refunds and track review progress." },
  { id: "social", label: "Social Links", section: "Business", icon: <FaExternalLinkAlt />, description: "Add GitHub, LinkedIn, portfolio, or website links." },
  { id: "activity", label: "Activity", section: "Business", icon: <IoCheckmarkCircle />, description: "A timeline of your messages, comments, likes, and orders." },
  { id: "privacy", label: "Privacy", section: "Business", icon: <FaTrashAlt />, description: "Review account data and manage account deletion." },
];

const navSections = ["Workspace", "Account", "Library", "Communication", "Business"].map((section) => ({
  section,
  items: tabs.filter((tab) => tab.section === section),
}));

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset.url || asset.filePath || "";
};

const getItemTitle = (item) => item?.title || item?.name || item?.metaTitle || item?.slug || item?._id || "Saved item";

const getItemImage = (item) => getAssetUrl(item?.cover) || getAssetUrl(item?.thumbnail) || getAssetUrl(item?.logo) || getAssetUrl(item?.avatar);

const getTypeMeta = (type) => {
  if (type === "Posts") return FAVORITE_META.Blog;
  return FAVORITE_META[type] || {
    label: type || "Items",
    singular: type || "Item",
    icon: <FaFolderOpen />,
    path: () => "#",
    accent: "text-gray-600 dark:text-white/55",
  };
};

const getFavoriteGroups = (favoriteResource) => {
  if (!favoriteResource || typeof favoriteResource !== "object" || Array.isArray(favoriteResource)) {
    return [];
  }

  return Object.entries(favoriteResource)
    .flatMap(([type, items]) => {
      const normalizedItems = Array.isArray(items)
        ? items
        : Object.entries(items || {})
            .filter(([, isActive]) => Boolean(isActive))
            .map(([id]) => ({ _id: id, title: id }));

      if (type === "Courses") {
        const noteItems = normalizedItems.filter(isNoteSubject);
        const courseItems = normalizedItems.filter((item) => !isNoteSubject(item));

        return [
          { type: "Notes", items: noteItems, meta: FAVORITE_META.Notes },
          { type: "Courses", items: courseItems, meta: FAVORITE_META.Courses },
        ];
      }

      return [
        {
          type,
          items: normalizedItems,
          meta: FAVORITE_META[type] || {
            label: type,
            singular: type,
            icon: <FaFolderOpen />,
            path: () => "#",
            accent: "text-gray-600 dark:text-white/55",
          },
        },
      ];
    })
    .filter((group) => group.items.length > 0)
    .sort((first, second) => {
      const order = ["Blog", "Notes", "Courses", "Project", "Chapter"];
      return (order.indexOf(first.type) === -1 ? 99 : order.indexOf(first.type)) - (order.indexOf(second.type) === -1 ? 99 : order.indexOf(second.type));
    });
};

const getProfileCompletion = (user, profileForm, coverUrl, avatarUrl) => {
  const fields = [profileForm.name, user?.email, profileForm.phone, profileForm.address, profileForm.bio, avatarUrl, coverUrl, user?.isVerified];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
};

const getSubmissionLabel = (type) => {
  if (type === "feedback") return "Feedback";
  if (type === "inquiry") return "Inquiry";
  return "Contact";
};

const getCommunicationTabCount = (messages, value) => {
  if (value === "All") return messages.length;
  if (value === "Project") return messages.filter((message) => message.type === "inquiry" && (message.projectDoc?.filePath || message.cost || message.company)).length;
  return messages.filter((message) => message.type === value.toLowerCase()).length;
};

const stripHtml = (value = "") => String(value).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const getLikeGroups = (likes) => {
  if (!likes || typeof likes !== "object") return [];

  return ["Blog", "Courses", "Project", "Chapter"]
    .flatMap((type) => {
      const items = Array.isArray(likes[type]) ? likes[type] : [];

      if (type === "Courses") {
        const noteItems = items.filter(isNoteSubject);
        const courseItems = items.filter((item) => !isNoteSubject(item));

        return [
          { type: "Notes", meta: getTypeMeta("Notes"), items: noteItems },
          { type: "Courses", meta: getTypeMeta("Courses"), items: courseItems },
        ];
      }

      return [{ type, meta: getTypeMeta(type), items }];
    })
    .filter((group) => group.items.length > 0);
};

const getResourcePath = (resourceType, resource = {}, resourceId) => {
  const type = resourceType === "Posts" ? "Blog" : resourceType;
  const meta = getTypeMeta(type);
  const item = resource && Object.keys(resource).length > 0 ? resource : { _id: resourceId };
  return meta.path(item);
};

const formatDate = (date) => {
  if (!date) return "Recently";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
};

const formatCurrency = (amount = 0) => `Rs. ${Number(amount || 0).toLocaleString()}`;

const REFUND_STATUS_META = {
  none: { label: "No refund", className: "border-gray-200/70 bg-gray-100/70 text-gray-500 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35" },
  requested: { label: "Requested", className: "border-amber-300/25 bg-amber-500/[0.10] text-amber-700 dark:border-amber-300/[0.10] dark:text-amber-100/75" },
  approved: { label: "Approved", className: "border-sky-300/25 bg-sky-500/[0.09] text-sky-700 dark:border-sky-300/[0.10] dark:text-sky-100/75" },
  rejected: { label: "Rejected", className: "border-rose-300/25 bg-rose-500/[0.09] text-rose-700 dark:border-rose-300/[0.10] dark:text-rose-100/75" },
  refunded: { label: "Refunded", className: "border-emerald-300/25 bg-emerald-500/[0.09] text-emerald-700 dark:border-emerald-300/[0.10] dark:text-emerald-100/75" },
};

const refundCategoryOptions = [
  { value: "duplicate", label: "Duplicate payment" },
  { value: "wrong_purchase", label: "Wrong purchase" },
  { value: "technical_issue", label: "Technical issue" },
  { value: "not_as_expected", label: "Not as expected" },
  { value: "other", label: "Other" },
];

const refundMethodOptions = [
  { value: "original_payment", label: "Original payment method" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "esewa", label: "eSewa" },
  { value: "other", label: "Other" },
];

const getRefundStatusMeta = (status = "none") => REFUND_STATUS_META[status] || REFUND_STATUS_META.none;

const getRefundTimelineSteps = (refund = {}) => {
  const status = refund.status || refund.order?.refund?.status || "none";
  const requestedAt = refund.createdAt || refund.order?.refund?.requestedAt;
  const resolvedAt = refund.resolvedAt || refund.order?.refund?.resolvedAt;

  return refund.timeline?.steps || [
    { key: "requested", label: "Requested", date: requestedAt, active: ["requested", "approved", "rejected", "refunded"].includes(status) },
    { key: "reviewing", label: "Reviewing", date: requestedAt, active: ["requested", "approved", "rejected", "refunded"].includes(status) },
    { key: "decision", label: status === "rejected" ? "Rejected" : "Approved", date: ["approved", "rejected", "refunded"].includes(status) ? resolvedAt : null, active: ["approved", "rejected", "refunded"].includes(status), danger: status === "rejected" },
    { key: "refunded", label: "Refunded", date: status === "refunded" ? resolvedAt : null, active: status === "refunded" },
  ];
};

const getRefundLabel = (options, value) => options.find((option) => option.value === value)?.label || value || "-";

const validateImage = (file) => {
  if (!file) return false;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Please select a JPG, PNG, or WEBP image.");
    return false;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("Image size must be under 5 MB.");
    return false;
  }

  return true;
};

const StatPill = ({ icon, label, value }) => (
  <div className="rounded-lg border border-gray-200/75 bg-white/65 px-4 py-3 dark:border-white/[0.06] dark:bg-white/[0.025]">
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200/80 bg-gray-50 text-[12px] text-teal-600 dark:border-white/[0.06] dark:bg-white/[0.035] dark:text-teal-200/70">{icon}</span>
      <div>
        <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">{label}</p>
        <p className="mt-1 text-sm font-black text-gray-950 dark:text-white/85">{value}</p>
      </div>
    </div>
  </div>
);

StatPill.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">{label}</span>
    {children}
  </label>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const TextInput = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`h-11 w-full rounded-lg border border-gray-200/75 bg-white/70 px-4 text-[11px] font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-teal-300/45 focus:bg-white dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75 dark:placeholder:text-white/20 dark:focus:border-teal-300/[0.14] ${className}`}
  />
);

TextInput.propTypes = {
  className: PropTypes.string,
};

const TextArea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`min-h-32 w-full resize-y rounded-lg border border-gray-200/75 bg-white/70 px-4 py-3 text-[11px] font-medium leading-6 text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-teal-300/45 focus:bg-white dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/75 dark:placeholder:text-white/20 dark:focus:border-teal-300/[0.14] ${className}`}
  />
);

TextArea.propTypes = {
  className: PropTypes.string,
};

const EmptyState = ({ icon, title, text, action }) => (
  <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300/80 bg-white/60 p-8 text-center shadow-[0_18px_48px_rgba(15,23,42,0.045)] dark:border-white/[0.07] dark:bg-white/[0.018]">
    <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-teal-400/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 left-12 size-44 rounded-full bg-purple-400/10 blur-3xl" />
    <div className="relative mx-auto flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-xl text-teal-600 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-teal-200/50">{icon}</div>
    <h3 className="relative mt-4 text-sm font-bold text-gray-950 dark:text-white/85">{title}</h3>
    <p className="relative mx-auto mt-2 max-w-md text-[11px] leading-6 text-gray-500 dark:text-white/35">{text}</p>
    {action}
  </div>
);

EmptyState.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  action: PropTypes.node,
};

const LoadingState = ({ label = "Loading..." }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.045)] dark:border-white/[0.055] dark:bg-white/[0.02]">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-teal-300/[0.05] to-transparent" />
    <div className="relative flex items-center gap-4">
      <span className="size-12 animate-pulse rounded-2xl bg-gray-200/80 dark:bg-white/[0.06]" />
      <span className="flex-1 space-y-3">
        <span className="block h-3 w-40 animate-pulse rounded-full bg-gray-200/80 dark:bg-white/[0.07]" />
        <span className="block h-3 w-64 max-w-full animate-pulse rounded-full bg-gray-200/60 dark:bg-white/[0.045]" />
      </span>
      <span className="hidden rounded-full border border-teal-300/20 bg-teal-500/[0.06] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-200/55 sm:inline-flex">{label}</span>
    </div>
  </div>
);

LoadingState.propTypes = {
  label: PropTypes.string,
};

const RefundTimeline = ({ refund }) => {
  const steps = getRefundTimelineSteps(refund);

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
      {steps.map((step) => (
        <div
          key={step.key}
          className={`rounded-lg border p-3 ${
            step.danger
              ? "border-rose-300/25 bg-rose-500/[0.06] dark:border-rose-300/[0.09]"
              : step.active
                ? "border-teal-300/25 bg-teal-500/[0.055] dark:border-teal-300/[0.09]"
                : "border-gray-200/70 bg-white/45 dark:border-white/[0.05] dark:bg-white/[0.014]"
          }`}
        >
          <span className={`mb-2 block size-2 rounded-full ${step.danger ? "bg-rose-400" : step.active ? "bg-teal-300" : "bg-gray-300 dark:bg-white/20"}`} />
          <p className="text-[9px] font-black text-gray-800 dark:text-white/70">{step.label}</p>
          <p className="mt-1 text-[8px] font-semibold text-gray-400 dark:text-white/25">{step.date ? formatDate(step.date) : step.description || "Pending"}</p>
        </div>
      ))}
    </div>
  );
};

RefundTimeline.propTypes = {
  refund: PropTypes.object.isRequired,
};

const SectionHeader = ({ eyebrow, title, text, action }) => (
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="text-[8px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-200/55">{eyebrow}</p>}
      <h3 className="mt-1 text-lg font-black text-gray-950 dark:text-white/90">{title}</h3>
      {text && <p className="mt-1 max-w-2xl text-[11px] leading-6 text-gray-500 dark:text-white/35">{text}</p>}
    </div>
    {action}
  </div>
);

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  action: PropTypes.node,
};

const Surface = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-gray-200/70 bg-white/60 shadow-[0_14px_34px_rgba(15,23,42,0.045)] dark:border-white/[0.055] dark:bg-white/[0.022] dark:shadow-[0_18px_42px_rgba(0,0,0,0.16)] ${className}`}>{children}</div>
);

Surface.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const ActivityRow = ({ title, text, date, icon }) => (
  <div className="flex gap-3 rounded-lg border border-gray-200/70 bg-white/55 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-gray-200/70 bg-gray-50 text-[12px] text-teal-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-teal-200/70">{icon}</span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-[12px] font-bold text-gray-950 dark:text-white/85">{title}</h4>
        <span className="text-[9px] font-medium text-gray-400 dark:text-white/25">{formatDate(date)}</span>
      </div>
      {text && <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-gray-500 dark:text-white/35">{text}</p>}
    </div>
  </div>
);

ActivityRow.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  date: PropTypes.string,
  icon: PropTypes.node.isRequired,
};

const ContentCard = ({ title, eyebrow, meta, image, icon, to, text, footer }) => {
  const body = (
    <article className="group h-full overflow-hidden rounded-lg border border-gray-200/70 bg-white/60 shadow-[0_14px_34px_rgba(15,23,42,0.045)] transition-all hover:-translate-y-0.5 hover:border-teal-300/45 hover:bg-teal-500/[0.035] dark:border-white/[0.055] dark:bg-white/[0.022] dark:shadow-[0_18px_42px_rgba(0,0,0,0.14)]">
      {image && (
        <div className="aspect-[16/9] overflow-hidden bg-[linear-gradient(135deg,#111827,#174343)]">
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {!image && icon && <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gray-200/70 bg-gray-50 text-sm text-teal-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-teal-200/70">{icon}</span>}
            <div className="min-w-0">
              {eyebrow && <span className="text-[8px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-200/65">{eyebrow}</span>}
              <h4 className="mt-1 line-clamp-2 min-h-10 text-[12px] font-bold leading-5 text-gray-950 dark:text-white/80">{title}</h4>
            </div>
          </div>
          {to && <FaExternalLinkAlt className="mt-1 shrink-0 text-[10px] text-gray-300 transition-all group-hover:text-teal-500 dark:text-white/20" />}
        </div>
        {text && <p className="mt-2 line-clamp-3 text-[11px] leading-6 text-gray-600 dark:text-white/45">{text}</p>}
        {meta && <p className="mt-2 truncate text-[10px] font-medium text-gray-400 dark:text-white/28">{meta}</p>}
        {footer}
      </div>
    </article>
  );

  return to ? (
    <Link to={to} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
};

ContentCard.propTypes = {
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
  meta: PropTypes.string,
  image: PropTypes.string,
  icon: PropTypes.node,
  to: PropTypes.string,
  text: PropTypes.string,
  footer: PropTypes.node,
};

const SegmentedControl = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200/70 bg-white/45 p-2 dark:border-white/[0.05] dark:bg-white/[0.016]">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-[10px] font-semibold transition-all ${
          value === option.value ? "bg-teal-600 text-white shadow-[0_10px_22px_rgba(20,184,166,0.18)]" : "text-gray-500 hover:bg-gray-100/70 dark:text-white/35 dark:hover:bg-white/[0.035]"
        }`}
      >
        <span>{option.label}</span>
        <span className={`rounded-full px-2 py-0.5 text-[8px] ${value === option.value ? "bg-white/20 text-white" : "bg-gray-200/75 text-gray-500 dark:bg-white/[0.055] dark:text-white/35"}`}>{option.count}</span>
      </button>
    ))}
  </div>
);

SegmentedControl.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const AccountDashboard = () => {
  const dispatch = useDispatch();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const avatarPreviewRef = useRef("");
  const coverPreviewRef = useRef("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { user, isLoggedIn, isLoading } = useSelector((state) => state.auth);
  const { favoriteResource, isFavoriteLoading } = useSelector((state) => state.favorite);
  const { myTestimonials, isMyTestimonialsLoading } = useSelector((state) => state.testimonial);

  const requestedTab = searchParams.get("tab") || "overview";
  const activeTab = ["profile", "security", "settings", "verification"].includes(requestedTab) ? "account" : ["messages", "feedback", "inquiry"].includes(requestedTab) ? "communication" : requestedTab;
  const favoriteGroups = useMemo(() => getFavoriteGroups(favoriteResource), [favoriteResource]);
  const [accountData, setAccountData] = useState({
    comments: [],
    likes: {},
    orders: [],
    links: [],
    downloads: [],
    notifications: [],
    tickets: [],
    downloadLogs: [],
    refunds: [],
    certificates: [],
    readingHistory: [],
  });
  const [isAccountDataLoading, setIsAccountDataLoading] = useState(false);
  const [socialLinkForm, setSocialLinkForm] = useState("");
  const [privacyConfirm, setPrivacyConfirm] = useState("");
  const [activeBookmarkType, setActiveBookmarkType] = useState("All");
  const [activeLikeType, setActiveLikeType] = useState("All");
  const [activeCommunicationType, setActiveCommunicationType] = useState("All");
  const [payingOrderId, setPayingOrderId] = useState("");
  const [receiptLoadingOrderId, setReceiptLoadingOrderId] = useState("");
  const [resendingInvoiceOrderId, setResendingInvoiceOrderId] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [refundModalOrder, setRefundModalOrder] = useState(null);
  const [refundForm, setRefundForm] = useState({ category: "technical_issue", refundMethod: "original_payment", refundContact: "", reason: "" });
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

  const totalBookmarks = favoriteGroups.reduce((total, group) => total + group.items.length, 0);
  const totalMessages = myTestimonials?.length || 0;
  const likeGroups = useMemo(() => getLikeGroups(accountData.likes), [accountData.likes]);
  const totalLikes = likeGroups.reduce((total, group) => total + group.items.length, 0);
  const bookmarkTypeTabs = useMemo(() => [{ value: "All", label: "All", count: totalBookmarks }, ...favoriteGroups.map((group) => ({ value: group.meta.label, label: group.meta.label, count: group.items.length }))], [favoriteGroups, totalBookmarks]);
  const likeTypeTabs = useMemo(() => [{ value: "All", label: "All", count: totalLikes }, ...likeGroups.map((group) => ({ value: group.meta.label, label: group.meta.label, count: group.items.length }))], [likeGroups, totalLikes]);
  const communicationTypeTabs = useMemo(
    () =>
      ["All", "Inquiry", "Feedback", "Project"].map((type) => ({
        value: type,
        label: type,
        count: getCommunicationTabCount(myTestimonials || [], type),
      })),
    [myTestimonials],
  );
  const visibleFavoriteGroups = activeBookmarkType === "All" ? favoriteGroups : favoriteGroups.filter((group) => group.meta.label === activeBookmarkType);
  const visibleLikeGroups = activeLikeType === "All" ? likeGroups : likeGroups.filter((group) => group.meta.label === activeLikeType);
  const visibleCommunicationItems = useMemo(() => {
    if (activeCommunicationType === "All") return myTestimonials || [];
    if (activeCommunicationType === "Project") return (myTestimonials || []).filter((message) => message.type === "inquiry" && (message.projectDoc?.filePath || message.cost || message.company));
    return (myTestimonials || []).filter((message) => message.type === activeCommunicationType.toLowerCase());
  }, [activeCommunicationType, myTestimonials]);
  const learningItems = useMemo(() => {
    const items = [
      ...favoriteGroups.filter((group) => ["Notes", "Courses", "Chapter"].includes(group.type)).flatMap((group) => group.items.map((item) => ({ type: group.type, item, source: "Bookmarked" }))),
      ...likeGroups.filter((group) => ["Notes", "Courses", "Chapter"].includes(group.type)).flatMap((group) => group.items.map((item) => ({ type: group.type, item, source: "Liked" }))),
      ...accountData.readingHistory
        .filter((entry) => entry?.blog)
        .map((entry) => ({
          type: "Blog",
          item: entry.blog,
          source: `${Math.round(entry.progress || 0)}% read`,
        })),
      ...accountData.comments
        .filter((comment) => ["Courses", "Chapter"].includes(comment.resourceType))
        .map((comment) => {
          const item = comment.resource || { _id: comment.resourceId };
          return { type: comment.resourceType === "Courses" && isNoteSubject(item) ? "Notes" : comment.resourceType, item, source: "Commented" };
        }),
    ];
    const seen = new Set();
    return items.filter(({ type, item }) => {
      const key = `${type}-${item?._id || item?.slug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [accountData.comments, accountData.readingHistory, favoriteGroups, likeGroups]);
  const notificationItems = useMemo(
    () => [
      ...(!user?.isVerified ? [{ title: "Verify your account", text: "Verification helps unlock trusted account features.", type: "warning" }] : []),
      ...(myTestimonials || []).filter((message) => message.reply).map((message) => ({ title: `${getSubmissionLabel(message.type)} replied`, text: stripHtml(message.content).slice(0, 120), type: "success" })),
      ...(user?.paid ? [{ title: "Paid access active", text: "Your account has paid access enabled.", type: "success" }] : []),
    ],
    [myTestimonials, user],
  );
  const activityItems = useMemo(() => {
    const activities = [
      ...(myTestimonials || []).map((message) => ({
        id: `message-${message._id}`,
        title: `Submitted ${getSubmissionLabel(message.type).toLowerCase()}`,
        text: stripHtml(message.content).slice(0, 140),
        date: message.createdAt,
      })),
      ...accountData.comments.map((comment) => ({
        id: `comment-${comment._id}`,
        title: `Commented on ${getTypeMeta(comment.resourceType).singular}`,
        text: stripHtml(comment.content).slice(0, 140),
        date: comment.createdAt,
      })),
      ...likeGroups.flatMap((group) =>
        group.items.map((item) => ({
          id: `like-${group.type}-${item._id}`,
          title: `Liked ${group.meta.singular}`,
          text: getItemTitle(item),
          date: item.createdAt,
        })),
      ),
      ...accountData.orders.map((order) => ({
        id: `order-${order._id}`,
        title: `Order ${order.status || "created"}`,
        text: `Amount: ${order.amount || 0}`,
        date: order.createdAt || order.paidAt,
      })),
      ...accountData.certificates.map((certificate) => ({
        id: `certificate-${certificate._id}`,
        title: "Certificate unlocked",
        text: certificate.course?.name || certificate.certificateId,
        date: certificate.completedAt || certificate.issuedAt,
      })),
      ...accountData.readingHistory.map((entry) => ({
        id: `read-${entry._id}`,
        title: "Read blog",
        text: entry.blog?.title || "Blog article",
        date: entry.updatedAt || entry.createdAt,
      })),
    ];

    return activities.sort((first, second) => new Date(second.date || 0) - new Date(first.date || 0)).slice(0, 12);
  }, [accountData.certificates, accountData.comments, accountData.orders, accountData.readingHistory, likeGroups, myTestimonials]);
  const quickActions = [
    { label: "Update account", tab: "account", icon: <FaUserEdit /> },
    { label: "View bookmarks", tab: "bookmarks", icon: <FaBookmark /> },
    { label: "Continue learning", tab: "learning", icon: <FaGraduationCap /> },
    { label: "Write feedback", to: "/contact", icon: <MdFeedback /> },
  ];

  const avatarUrl = getAssetUrl(user?.avatar);
  const coverUrl = getAssetUrl(user?.cover);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const profileCompletion = getProfileCompletion(user, profileForm, coverPreview || coverUrl, avatarPreview || avatarUrl);
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Profile";
  const activeTabDescription = tabs.find((tab) => tab.id === activeTab)?.description || "";
  const accountHealth = useMemo(
    () => [
      { label: "Profile completion", value: `${profileCompletion}%`, tone: profileCompletion >= 75 ? "Ready" : "Needs info" },
      { label: "Verification", value: user?.isVerified ? "Verified" : "Pending", tone: user?.isVerified ? "Ready" : "Action" },
      { label: "Paid access", value: user?.paid ? "Active" : "Free", tone: user?.paid ? "Ready" : "Standard" },
      { label: "Social links", value: accountData.links.length, tone: accountData.links.length > 0 ? "Ready" : "Optional" },
    ],
    [accountData.links.length, profileCompletion, user],
  );
  const tabCounts = useMemo(
    () => ({
      bookmarks: totalBookmarks,
      likes: totalLikes,
      learning: learningItems.length,
      downloads: accountData.downloads.length,
      communication: totalMessages,
      comments: accountData.comments.length,
      notifications: notificationItems.length + accountData.notifications.length,
      support: accountData.tickets.length,
      orders: accountData.orders.length,
      certificates: accountData.certificates.length,
      refunds: accountData.refunds.length,
      social: accountData.links.length,
    }),
    [accountData.certificates.length, accountData.comments.length, accountData.downloads.length, accountData.links.length, accountData.notifications.length, accountData.orders.length, accountData.refunds.length, accountData.tickets.length, learningItems.length, notificationItems.length, totalBookmarks, totalLikes, totalMessages],
  );

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserProfile());
      dispatch(getUserFavorite());
      dispatch(getMyTestimonials());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && activeTab === "bookmarks") {
      dispatch(getUserFavorite());
    }
  }, [activeTab, dispatch, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAccountData = async () => {
      setIsAccountDataLoading(true);

      const requests = [
        axios.get(`${REACT_APP_BACKEND_URL}/comment/my`),
        axios.get(`${REACT_APP_BACKEND_URL}/like/my`),
        axios.get(`${REACT_APP_BACKEND_URL}/order/me`),
        axios.get(`${REACT_APP_BACKEND_URL}/order/purchases`),
        user?.isVerified ? axios.get(`${REACT_APP_BACKEND_URL}/auth/user/link`) : Promise.resolve({ data: [] }),
        axios.get(`${REACT_APP_BACKEND_URL}/business/notifications`),
        axios.get(`${REACT_APP_BACKEND_URL}/business/support/me`),
        axios.get(`${REACT_APP_BACKEND_URL}/business/downloads/me`),
        axios.get(`${REACT_APP_BACKEND_URL}/business/refunds/me`),
        axios.get(`${REACT_APP_BACKEND_URL}/business/certificates/me`),
        axios.get(`${REACT_APP_BACKEND_URL}/blog/reading-history/me`),
      ];

      const [commentsResult, likesResult, ordersResult, purchasesResult, linksResult, notificationsResult, ticketsResult, downloadsResult, refundsResult, certificatesResult, readingHistoryResult] = await Promise.allSettled(requests);
      const savedDownloads = JSON.parse(localStorage.getItem("accountDownloads") || "[]");
      const purchasedDownloads = purchasesResult.status === "fulfilled" ? purchasesResult.value.data?.purchases || [] : [];

      setAccountData({
        comments: commentsResult.status === "fulfilled" ? commentsResult.value.data?.comments || [] : [],
        likes: likesResult.status === "fulfilled" ? likesResult.value.data || {} : {},
        orders: ordersResult.status === "fulfilled" ? ordersResult.value.data?.orders || [] : [],
        links: linksResult.status === "fulfilled" ? linksResult.value.data?.[0]?.links || linksResult.value.data?.links || [] : [],
        downloads: [...purchasedDownloads, ...(Array.isArray(savedDownloads) ? savedDownloads : [])],
        notifications: notificationsResult.status === "fulfilled" ? notificationsResult.value.data?.notifications || [] : [],
        tickets: ticketsResult.status === "fulfilled" ? ticketsResult.value.data?.tickets || [] : [],
        downloadLogs: downloadsResult.status === "fulfilled" ? downloadsResult.value.data?.downloads || [] : [],
        refunds: refundsResult.status === "fulfilled" ? refundsResult.value.data?.refunds || [] : [],
        certificates: certificatesResult.status === "fulfilled" ? certificatesResult.value.data?.certificates || [] : [],
        readingHistory: readingHistoryResult.status === "fulfilled" ? readingHistoryResult.value.data?.history || [] : [],
      });
      setIsAccountDataLoading(false);
    };

    fetchAccountData();
  }, [isLoggedIn, user?.isVerified]);

  useEffect(() => {
    if (!bookmarkTypeTabs.some((option) => option.value === activeBookmarkType)) {
      setActiveBookmarkType("All");
    }
  }, [activeBookmarkType, bookmarkTypeTabs]);

  useEffect(() => {
    if (!likeTypeTabs.some((option) => option.value === activeLikeType)) {
      setActiveLikeType("All");
    }
  }, [activeLikeType, likeTypeTabs]);

  useEffect(() => {
    if (!communicationTypeTabs.some((option) => option.value === activeCommunicationType)) {
      setActiveCommunicationType("All");
    }
  }, [activeCommunicationType, communicationTypeTabs]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      avatar: null,
    });
    setAvatarPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return "";
    });
    setCoverPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return "";
    });
  }, [user]);

  useEffect(() => {
    avatarPreviewRef.current = avatarPreview;
  }, [avatarPreview]);

  useEffect(() => {
    coverPreviewRef.current = coverPreview;
  }, [coverPreview]);

  useEffect(() => {
    return () => {
      if (avatarPreviewRef.current) URL.revokeObjectURL(avatarPreviewRef.current);
      if (coverPreviewRef.current) URL.revokeObjectURL(coverPreviewRef.current);
    };
  }, []);

  const setTab = (tab) => {
    setSearchParams(tab === "overview" ? {} : { tab });
  };

  const handleProfileChange = (event) => {
    const { name, value, files } = event.target;

    if (files) {
      const file = files[0];
      if (!validateImage(file)) return;

      setAvatarPreview((currentPreview) => {
        if (currentPreview) URL.revokeObjectURL(currentPreview);
        return URL.createObjectURL(file);
      });
      setProfileForm((currentValue) => ({ ...currentValue, avatar: file }));
      return;
    }

    setProfileForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!validateImage(file)) return;

    setCoverPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(file);
    });

    const formData = new FormData();
    formData.append("cover", file);

    const response = await dispatch(updateUserCover(formData));

    if (!response?.error) {
      dispatch(getUserProfile());
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", profileForm.name.trim());
    formData.append("phone", profileForm.phone);
    formData.append("address", profileForm.address.trim());
    formData.append("bio", profileForm.bio.trim());

    if (profileForm.avatar) {
      formData.append("avatar", profileForm.avatar);
    }

    const response = await dispatch(updateUserProfile(formData));

    if (!response?.error) {
      toast.success(response.payload?.message || "Profile updated.");
      dispatch(getUserProfile());
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((currentValue) => ({
      ...currentValue,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      toast.error("Please enter old and new passwords.");
      return;
    }

    const response = await dispatch(changePassword(passwordForm));

    if (!response?.error) {
      setPasswordForm({ oldPassword: "", newPassword: "" });
    }
  };

  const handleVerificationEmail = async () => {
    await dispatch(sendVerificationEmail());
  };

  const refreshAccountData = async () => {
    const [commentsResponse, likesResponse, ordersResponse, purchasesResponse, linksResponse] = await Promise.all([
      axios.get(`${REACT_APP_BACKEND_URL}/comment/my`),
      axios.get(`${REACT_APP_BACKEND_URL}/like/my`),
      axios.get(`${REACT_APP_BACKEND_URL}/order/me`),
      axios.get(`${REACT_APP_BACKEND_URL}/order/purchases`),
      user?.isVerified ? axios.get(`${REACT_APP_BACKEND_URL}/auth/user/link`) : Promise.resolve({ data: [] }),
    ]);
    const [notificationsResponse, ticketsResponse, downloadsResponse, refundsResponse, certificatesResponse, readingHistoryResponse] = await Promise.all([
      axios.get(`${REACT_APP_BACKEND_URL}/business/notifications`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/support/me`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/downloads/me`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/refunds/me`),
      axios.get(`${REACT_APP_BACKEND_URL}/business/certificates/me`),
      axios.get(`${REACT_APP_BACKEND_URL}/blog/reading-history/me`),
    ]);

    setAccountData((currentValue) => ({
      ...currentValue,
      comments: commentsResponse.data?.comments || [],
      likes: likesResponse.data || {},
      orders: ordersResponse.data?.orders || [],
      links: linksResponse.data?.[0]?.links || linksResponse.data?.links || [],
      downloads: purchasesResponse.data?.purchases || currentValue.downloads || [],
      notifications: notificationsResponse.data?.notifications || [],
      tickets: ticketsResponse.data?.tickets || [],
      downloadLogs: downloadsResponse.data?.downloads || [],
      refunds: refundsResponse.data?.refunds || [],
      certificates: certificatesResponse.data?.certificates || [],
      readingHistory: readingHistoryResponse.data?.history || [],
    }));
  };

  const handleStartPayment = async (orderId, gateway = "esewa") => {
    try {
      setPayingOrderId(orderId);
      const endpoint = gateway === "stripe" ? "/payment/stripe/initiate-payment" : "/payment/initiate-payment";
      const response = await axios.post(`${REACT_APP_BACKEND_URL}${endpoint}`, { orderId });

      if (!response.data?.paymentUrl) {
        throw new Error("Payment gateway details were not returned.");
      }

      if (gateway === "stripe") {
        window.location.href = response.data.paymentUrl;
        return;
      }

      if (!response.data?.formData) {
        throw new Error("eSewa form details were not returned.");
      }

      submitEsewaForm(response.data.paymentUrl, response.data.formData);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Unable to start payment.");
      setPayingOrderId("");
    }
  };

  const handleOpenReceipt = async (orderId) => {
    try {
      setReceiptLoadingOrderId(orderId);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/order/receipt/${orderId}`);
      const receipt = response.data?.receipt;

      if (!receipt) {
        throw new Error("Receipt was not returned.");
      }

      setSelectedReceipt(receipt);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Unable to open receipt.");
    } finally {
      setReceiptLoadingOrderId("");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleCopyInvoiceLink = async (orderId) => {
    try {
      await navigator.clipboard.writeText(`${REACT_APP_BACKEND_URL}/business/invoice/${orderId}`);
      toast.success("Invoice link copied.");
    } catch {
      toast.error("Unable to copy invoice link.");
    }
  };

  const handleResendInvoiceEmail = async (orderId) => {
    try {
      setResendingInvoiceOrderId(orderId);
      await axios.post(`${REACT_APP_BACKEND_URL}/business/invoice/${orderId}/resend`);
      toast.success("Invoice email sent.");
      await refreshAccountData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to send invoice email.");
    } finally {
      setResendingInvoiceOrderId("");
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    await axios.patch(`${REACT_APP_BACKEND_URL}/business/notifications/${notificationId}/read`);
    setAccountData((currentValue) => ({
      ...currentValue,
      notifications: currentValue.notifications.map((notification) => (notification._id === notificationId ? { ...notification, readAt: new Date().toISOString() } : notification)),
    }));
  };

  const handleSupportSubmit = async (event) => {
    event.preventDefault();

    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      toast.error("Please enter support subject and message.");
      return;
    }

    await axios.post(`${REACT_APP_BACKEND_URL}/business/support`, supportForm);
    setSupportForm({ subject: "", message: "" });
    toast.success("Support ticket created.");
    await refreshAccountData();
  };

  const getSecureDownloadUrl = (download) => {
    const type = download.productModel === "Project" ? "project" : "course";
    return `${REACT_APP_BACKEND_URL}/business/download-link/${type}/${download.product}`;
  };

  const openRefundModal = (order) => {
    setRefundModalOrder(order);
    setRefundForm({ category: "technical_issue", refundMethod: "original_payment", refundContact: "", reason: "" });
  };

  const closeRefundModal = () => {
    if (isSubmittingRefund) return;
    setRefundModalOrder(null);
    setRefundForm({ category: "technical_issue", refundMethod: "original_payment", refundContact: "", reason: "" });
  };

  const resetRefundModal = () => {
    setRefundModalOrder(null);
    setRefundForm({ category: "technical_issue", refundMethod: "original_payment", refundContact: "", reason: "" });
  };

  const handleRefundFormChange = (event) => {
    const { name, value } = event.target;
    setRefundForm((currentValue) => ({ ...currentValue, [name]: value }));
  };

  const handleRefundRequest = async (event) => {
    event.preventDefault();

    if (!refundModalOrder?._id) return;

    if (refundForm.reason.trim().length < 12) {
      toast.error("Please explain the refund reason in at least 12 characters.");
      return;
    }

    try {
      setIsSubmittingRefund(true);
      await axios.post(`${REACT_APP_BACKEND_URL}/business/refunds/${refundModalOrder._id}`, {
        ...refundForm,
        reason: refundForm.reason.trim(),
        refundContact: refundForm.refundContact.trim(),
      });
      toast.success("Refund request submitted.");
      resetRefundModal();
      await refreshAccountData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Unable to submit refund request.");
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  const handleSocialLinkSubmit = async (event) => {
    event.preventDefault();

    if (!socialLinkForm.trim()) {
      toast.error("Please enter a social link.");
      return;
    }

    if (!user?.isVerified) {
      toast.error("Please verify your account before adding social links.");
      return;
    }

    await axios.post(`${REACT_APP_BACKEND_URL}/auth/user/link`, {
      links: [{ link: socialLinkForm.trim(), visibility: true }],
    });
    setSocialLinkForm("");
    toast.success("Social link added.");
    await refreshAccountData();
  };

  const handleDeleteAccount = async () => {
    if (privacyConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm account deletion.");
      return;
    }

    await axios.delete(`${REACT_APP_BACKEND_URL}/auth/profile`);
    await dispatch(logout());
    toast.success("Account deleted.");
  };

  if (!isLoggedIn) {
    return (
      <section className="course-details-page overflow-hidden p-3 sm:p-4">
        <div className="container relative z-10">
          <div className="flex min-h-[520px] flex-col items-center justify-center rounded-lg border border-gray-200/70 bg-gray-50/50 px-6 text-center dark:border-white/[0.055] dark:bg-white/[0.018]">
            <FaLock className="text-2xl text-teal-600 dark:text-teal-200/70" />
            <h1 className="mt-4 text-2xl font-black text-gray-950 dark:text-white/90">Login to view your dashboard</h1>
            <Link to="/login" className="mt-5 rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
              Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="course-details-page overflow-hidden p-3 sm:p-4">
      <div className="project-bg !overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <span className="absolute -left-[10%] top-[18%] block aspect-[1.5489] w-[75%] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] rounded-[100%] bg-[#2B2B44] opacity-24 blur-3xl"></span>
          <span className="absolute -top-[20%] -right-[30%] block aspect-[1.3555] w-[62%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-28 blur-3xl"></span>
        </div>
      </div>

      <div className="container relative z-10 grid grid-cols-1 gap-4 xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="rounded-lg border border-gray-200/70 bg-gray-50/55 p-3 shadow-[0_16px_38px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.20)]">
            <div className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[linear-gradient(135deg,#111827,#161922_62%,#102928)] p-4">
              <div className="relative z-10 flex items-center gap-3">
                <div className="size-14 overflow-hidden rounded-lg border border-white/[0.14] bg-white/[0.08]">
                  {avatarUrl && avatarUrl !== DEFAULT_AVATAR ? (
                    <img src={avatarUrl} alt={user?.name || "User"} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-black uppercase text-white/90">{user?.name?.charAt(0) || "U"}</div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[7px] font-semibold uppercase tracking-widest text-gray-600 dark:text-white/45">User dashboard</p>
                  <h2 className="mt-1 truncate text-sm font-bold text-white/90">{user?.name}</h2>
                  <p className="mt-1 truncate text-[9px] text-gray-600 dark:text-white/45">{user?.email}</p>
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <div className="flex items-center justify-between text-[8px] font-semibold uppercase tracking-widest text-gray-500 dark:text-white/35">
                  <span>Profile</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <span className="block h-full rounded-full bg-teal-400/[0.78] transition-all" style={{ width: `${profileCompletion}%` }}></span>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <StatPill icon={<FaBookmark />} label="Saved" value={totalBookmarks} />
              <StatPill icon={<FaStar />} label="Likes" value={totalLikes} />
            </div>

            <div className="mt-4 space-y-4">
              {navSections.map((section) => (
                <div key={section.section}>
                  <p className="mb-2 px-2 text-[7px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/22">{section.section}</p>
                  <div className="space-y-1">
                    {section.items.map((tab) => {
                      const count = tabCounts[tab.id];

                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setTab(tab.id)}
                          className={`group flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                            activeTab === tab.id
                              ? "border-teal-300/35 bg-teal-500/[0.08] text-teal-700 shadow-[0_10px_24px_rgba(20,184,166,0.08)] dark:border-teal-300/[0.12] dark:bg-teal-300/[0.045] dark:text-teal-200/80"
                              : "border-transparent text-gray-500 hover:bg-gray-100/70 dark:text-white/35 dark:hover:bg-white/[0.025]"
                          }`}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200/70 bg-white/60 text-[12px] dark:border-white/[0.05] dark:bg-white/[0.02]">{tab.icon}</span>
                          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold">{tab.label}</span>
                          {typeof count === "number" && count > 0 && <span className="rounded-full bg-gray-200/75 px-2 py-0.5 text-[8px] font-black text-gray-500 dark:bg-white/[0.06] dark:text-white/40">{count}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-lg border border-gray-200/70 bg-gray-50/50 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)]">
            <div className="relative h-44 bg-[linear-gradient(135deg,#161922,#0f2e2f)] sm:h-56">
              {(coverPreview || coverUrl) && <img src={coverPreview || coverUrl} alt={user?.name || "Cover"} className="h-full w-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"></div>
              {!user?.isVerified && (
                <div className="absolute left-4 top-4 max-w-[calc(100%-8rem)] rounded-lg border border-amber-300/25 bg-black/35 p-3 text-white backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-400/15 text-amber-100">
                      <FaShieldAlt />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white/90">Verify your account</p>
                      <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-white/55">Send a verification email to unlock trusted account features.</p>
                      <button type="button" onClick={handleVerificationEmail} disabled={isLoading} className="mt-2 rounded-md bg-amber-500 px-3 py-1.5 text-[9px] font-semibold text-white transition-all hover:bg-amber-400 disabled:opacity-60">
                        Send email
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isLoading}
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.14] bg-black/25 px-4 py-2 text-[10px] font-semibold text-white/85 backdrop-blur transition-all hover:bg-black/35 disabled:opacity-60"
              >
                <FaCamera />
                Change cover
              </button>
              <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleCoverChange} className="hidden" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex min-w-0 items-end gap-4">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="group relative size-24 shrink-0 overflow-hidden rounded-lg border-2 border-white/75 bg-white text-gray-900 shadow-xl dark:bg-[#111827] dark:text-white"
                    aria-label="Change avatar"
                  >
                    {avatarPreview || (avatarUrl && avatarUrl !== DEFAULT_AVATAR) ? (
                      <img src={avatarPreview || avatarUrl} alt={user?.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-4xl font-black uppercase">{user?.name?.charAt(0) || "U"}</span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/50 py-1.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <FaCamera />
                    </span>
                  </button>
                  <input ref={avatarInputRef} name="avatar" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleProfileChange} className="hidden" />

                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="truncate text-2xl font-black text-white sm:text-3xl">{user?.name}</h1>
                      <span className={`rounded-md border px-2 py-1 text-[8px] font-semibold uppercase tracking-widest ${user?.isVerified ? "border-emerald-300/25 bg-emerald-400/15 text-emerald-100" : "border-amber-300/25 bg-amber-400/15 text-amber-100"}`}>
                        {user?.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[11px] font-medium text-white/60">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-gray-200/70 p-4 dark:border-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
              <StatPill icon={<FaBookmark />} label="Bookmarks" value={totalBookmarks} />
              <StatPill icon={<FaEnvelopeOpenText />} label="Messages" value={totalMessages} />
              <StatPill icon={<FaRegCommentDots />} label="Comments" value={accountData.comments.length} />
              <StatPill icon={<FaStar />} label="Likes" value={totalLikes} />
            </div>
          </section>

          <section className="rounded-lg border border-gray-200/70 bg-gray-50/50 p-5 shadow-[0_16px_38px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="flex flex-col gap-3 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-lg border border-gray-200/70 bg-white/60 text-teal-600 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-teal-200/70">{tabs.find((tab) => tab.id === activeTab)?.icon || <FaRegUser />}</span>
                <div className="min-w-0">
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-200/55">Account workspace</p>
                  <h2 className="mt-2 text-2xl font-black text-gray-950 dark:text-white/90">{activeTabLabel}</h2>
                  {activeTabDescription && <p className="mt-1 max-w-2xl text-[11px] leading-6 text-gray-500 dark:text-white/35">{activeTabDescription}</p>}
                </div>
              </div>
              <div className="w-full sm:w-52">
                <div className="mb-2 flex items-center justify-between text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/26">
                  <span>Profile</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/75 dark:bg-white/[0.05]">
                  <span className="block h-full rounded-full bg-teal-500 transition-all" style={{ width: `${profileCompletion}%` }}></span>
                </div>
              </div>
            </div>

            {activeTab === "overview" && (
              <div className="mt-5 space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <StatPill icon={<FaBookmark />} label="Bookmarks" value={totalBookmarks} />
                  <StatPill icon={<FaStar />} label="Liked" value={totalLikes} />
                  <StatPill icon={<FaRegCommentDots />} label="Comments" value={accountData.comments.length} />
                  <StatPill icon={<FaEnvelopeOpenText />} label="Messages" value={totalMessages} />
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                  <Surface className="p-5">
                    <SectionHeader eyebrow="Next steps" title="Quick Actions" text="Common account tasks are kept close so the dashboard feels useful immediately." />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {quickActions.map((action) =>
                        action.to ? (
                          <Link key={action.label} to={action.to} className="group flex items-center gap-3 rounded-lg border border-gray-200/70 bg-gray-50/70 p-4 dark:border-white/[0.05] dark:bg-white/[0.016] text-left transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04]">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-teal-300/[0.20] bg-teal-500/[0.10] text-teal-700 dark:text-teal-200/75">{action.icon}</span>
                            <span className="text-[12px] font-bold text-gray-950 dark:text-white/85">{action.label}</span>
                          </Link>
                        ) : (
                          <button key={action.label} type="button" onClick={() => setTab(action.tab)} className="group flex items-center gap-3 rounded-lg border border-gray-200/70 bg-gray-50/70 p-4 dark:border-white/[0.05] dark:bg-white/[0.016] text-left transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04]">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-teal-300/[0.20] bg-teal-500/[0.10] text-teal-700 dark:text-teal-200/75">{action.icon}</span>
                            <span className="text-[12px] font-bold text-gray-950 dark:text-white/85">{action.label}</span>
                          </button>
                        ),
                      )}
                    </div>
                  </Surface>

                  <Surface className="p-5">
                    <SectionHeader eyebrow="Account health" title="Status" text="A quick read on what still needs attention." />
                    <div className="space-y-3">
                      {accountHealth.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200/70 bg-gray-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 dark:text-white/35">{item.label}</p>
                            <p className="mt-1 text-sm font-black text-gray-950 dark:text-white/85">{item.value}</p>
                          </div>
                          <span className="rounded-md border border-teal-300/[0.25] bg-teal-500/[0.10] px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-200/75">{item.tone}</span>
                        </div>
                      ))}
                    </div>
                  </Surface>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <Surface className="p-5">
                    <SectionHeader
                      eyebrow="Learning"
                      title="Continue Learning"
                      text="Built from notes and courses you saved, liked, or commented on."
                      action={
                        <button type="button" onClick={() => setTab("learning")} className="rounded-lg border border-gray-200/70 bg-white/65 px-4 py-2 text-[10px] font-semibold text-gray-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/65 transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04] hover:text-teal-700 dark:hover:text-white">
                          View all
                        </button>
                      }
                    />
                    {learningItems.length > 0 ? (
                      <div className="space-y-3">
                        {learningItems.slice(0, 4).map(({ type, item, source }) => {
                          const meta = getTypeMeta(type);
                          return (
                            <Link key={`${type}-${item?._id || item?.slug}-${source}-overview`} to={meta.path(item)} className="flex items-center gap-3 rounded-lg border border-gray-200/70 bg-gray-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.016] transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04]">
                              <span className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-[12px] dark:bg-white/[0.035] ${meta.accent}`}>{meta.icon}</span>
                              <span className="min-w-0">
                                <span className="block truncate text-[12px] font-bold text-gray-950 dark:text-white/85">{getItemTitle(item)}</span>
                                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/28">{source}</span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState icon={<FaGraduationCap />} title="No learning list yet" text="Save, like, or comment on notes and course resources to build this list." />
                    )}
                  </Surface>

                  <Surface className="p-5">
                    <SectionHeader
                      eyebrow="Recent"
                      title="Activity Timeline"
                      text="A compact feed of your latest messages, comments, likes, and orders."
                      action={
                        <button type="button" onClick={() => setTab("activity")} className="rounded-lg border border-gray-200/70 bg-white/65 px-4 py-2 text-[10px] font-semibold text-gray-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/65 transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04] hover:text-teal-700 dark:hover:text-white">
                          View all
                        </button>
                      }
                    />
                    {activityItems.length > 0 ? (
                      <div className="space-y-3">
                        {activityItems.slice(0, 5).map((item) => (
                          <ActivityRow key={`${item.id}-overview`} title={item.title} text={item.text} date={item.date} icon={<IoCheckmarkCircle />} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={<IoCheckmarkCircle />} title="No recent activity" text="Your actions will appear here as you use the site." />
                    )}
                  </Surface>
                </div>

                <Surface className="p-5">
                  <SectionHeader
                    eyebrow="Communication"
                    title="Latest Messages"
                    text="Feedback, inquiries, and contact messages you submitted while logged in."
                    action={
                      <button type="button" onClick={() => setTab("communication")} className="rounded-lg border border-gray-200/70 bg-white/65 px-4 py-2 text-[10px] font-semibold text-gray-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/65 transition-all hover:border-teal-300/45 hover:bg-teal-500/[0.04] hover:text-teal-700 dark:hover:text-white">
                        View all
                      </button>
                    }
                  />
                  {totalMessages > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {myTestimonials.slice(0, 2).map((message) => (
                        <div key={`${message._id}-overview`} className="rounded-lg border border-gray-200/70 bg-gray-50/70 p-4 dark:border-white/[0.05] dark:bg-white/[0.016]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-teal-300/[0.25] bg-teal-500/[0.10] px-2 py-1 text-[8px] font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-200/75">{getSubmissionLabel(message.type)}</span>
                            <span className="text-[9px] font-medium text-gray-400 dark:text-white/28">{formatDate(message.createdAt)}</span>
                          </div>
                          <p className="mt-3 line-clamp-3 text-[11px] leading-6 text-gray-600 dark:text-white/45">{stripHtml(message.content)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<FaEnvelopeOpenText />}
                      title="No messages yet"
                      text="Send feedback or an inquiry and it will show here."
                      action={
                        <Link to="/contact" className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                          Write feedback
                        </Link>
                      }
                    />
                  )}
                </Surface>
              </div>
            )}

            {activeTab === "account" && (
              <div className="mt-5 space-y-5">
                <Surface className="p-5">
                  <SectionHeader eyebrow="Account details" title="Profile Information" text="Email stays locked to your account. Everything else can be updated here." />
                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Name">
                      <TextInput name="name" value={profileForm.name} onChange={handleProfileChange} placeholder="Your name" />
                    </Field>
                    <Field label="Email">
                      <TextInput value={user?.email || ""} readOnly className="cursor-not-allowed bg-gray-100/75 text-gray-500 dark:bg-white/[0.035] dark:text-white/35" />
                    </Field>
                    <Field label="Phone">
                      <TextInput name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} placeholder="Phone number" />
                    </Field>
                    <Field label="Address">
                      <TextInput name="address" value={profileForm.address} onChange={handleProfileChange} placeholder="Address" />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Bio">
                        <TextArea name="bio" value={profileForm.bio} onChange={handleProfileChange} placeholder="Tell us about yourself" />
                      </Field>
                    </div>
                    <div className="flex flex-wrap gap-3 md:col-span-2">
                      <button type="button" onClick={() => avatarInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-gray-200/80 bg-white/65 px-5 py-3 text-[10px] font-semibold text-gray-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/65 transition-all hover:border-teal-300/45">
                        <FaCamera />
                        Change profile photo
                      </button>
                      <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500 disabled:opacity-[0.60]">
                        <FaUserEdit />
                        {isLoading ? "Saving..." : "Save profile"}
                      </button>
                    </div>
                  </form>
                </Surface>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <Surface className="p-5">
                    <SectionHeader eyebrow="Security" title="Password" text="Update your password from the same account workspace." />
                    <form onSubmit={handlePasswordSubmit} className="grid max-w-2xl grid-cols-1 gap-4">
                      <Field label="Old password">
                        <TextInput name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePasswordChange} placeholder="Current password" />
                      </Field>
                      <Field label="New password">
                        <TextInput name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="New password" />
                      </Field>
                      <button type="submit" disabled={isLoading} className="inline-flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500 disabled:opacity-[0.60]">
                        <FaKey />
                        {isLoading ? "Updating..." : "Update password"}
                      </button>
                    </form>
                  </Surface>

                  <Surface className="p-5">
                    <SectionHeader eyebrow="Status" title="Account Summary" text="A compact view of your current account setup." />
                    <div className="space-y-3">
                      {[
                        ["Role", user?.role || "guest"],
                        ["Paid access", user?.paid ? "Active" : "Not active"],
                        ["Verified", user?.isVerified ? "Yes" : "No"],
                        ["Profile", `${profileCompletion}%`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between rounded-lg border border-gray-200/70 bg-gray-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                          <p className="text-[10px] font-semibold text-gray-500 dark:text-white/35">{label}</p>
                          <p className="text-[12px] font-black text-gray-950 dark:text-white/85">{value}</p>
                        </div>
                      ))}
                    </div>
                  </Surface>
                </div>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="mt-5">
                {isFavoriteLoading ? (
                  <div className="rounded-lg border border-gray-200/70 bg-white/55 p-4 text-[11px] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/35">Loading bookmarks...</div>
                ) : favoriteGroups.length > 0 ? (
                  <div className="space-y-6">
                    <SegmentedControl options={bookmarkTypeTabs} value={activeBookmarkType} onChange={setActiveBookmarkType} />
                    {visibleFavoriteGroups.map((group) => (
                      <div key={group.type}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-200/70 bg-white/65 dark:border-white/[0.06] dark:bg-white/[0.025] text-sm ${group.meta.accent}`}>{group.meta.icon}</span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-black text-gray-950 dark:text-white/85">{group.meta.label}</h3>
                              <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/28">{group.items.length} saved</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {group.items.map((item) => {
                            const imageUrl = getItemImage(item);
                            const itemPath = group.meta.path(item);

                            return (
                              <ContentCard
                                key={`${group.type}-${item?._id || getItemTitle(item)}`}
                                to={itemPath}
                                title={getItemTitle(item)}
                                eyebrow={group.meta.singular}
                                image={imageUrl}
                                icon={group.meta.icon}
                                meta={item?.category?.title || item?.user?.name || "Saved item"}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaBookmark />}
                    title="No bookmarks yet"
                    text="Saved blogs, notes, projects, and course resources will appear here."
                    action={
                      <Link to="/notes" className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                        Browse notes
                      </Link>
                    }
                  />
                )}
              </div>
            )}

            {activeTab === "communication" && (
              <div className="mt-5 space-y-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <ContentCard
                    to="/contact"
                    title="Share feedback"
                    eyebrow="Feedback"
                    icon={<MdFeedback />}
                    text="Send product feedback using your account details by default."
                    meta="Opens contact form"
                  />
                  <ContentCard
                    to="/contact"
                    title="Project inquiry"
                    eyebrow="Inquiry"
                    icon={<IoHelpCircleOutline />}
                    text="Start a project inquiry with your profile information pre-filled."
                    meta="Opens contact form"
                  />
                </div>

                <Surface className="p-5">
                  <SectionHeader eyebrow="History" title="Submitted Messages" text="All inquiry, feedback, and project messages submitted while logged in." />
                  {isMyTestimonialsLoading ? (
                    <div className="rounded-lg border border-gray-200/70 bg-white/55 p-4 text-[11px] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/35">Loading your messages...</div>
                  ) : totalMessages > 0 ? (
                    <div className="space-y-4">
                      <SegmentedControl options={communicationTypeTabs} value={activeCommunicationType} onChange={setActiveCommunicationType} />

                      {visibleCommunicationItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {visibleCommunicationItems.map((message) => (
                            <ContentCard
                              key={message._id}
                              title={message.fullname || user?.name || getSubmissionLabel(message.type)}
                              eyebrow={activeCommunicationType === "Project" ? "Project" : getSubmissionLabel(message.type)}
                              icon={message.type === "feedback" ? <MdFeedback /> : message.type === "inquiry" ? <IoHelpCircleOutline /> : <FaEnvelopeOpenText />}
                              text={stripHtml(message.content)}
                              meta={formatDate(message.createdAt)}
                              footer={
                                <div className="mt-4 space-y-3 border-t border-gray-200/70 pt-3 dark:border-white/[0.05]">
                                  <div className="flex flex-wrap gap-2 text-[9px] font-medium text-gray-500 dark:text-white/35">
                                    {message.rating && (
                                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/[0.10] px-2 py-1 text-amber-600 dark:text-amber-200/75">
                                        <FaStar />
                                        {message.rating}/5
                                      </span>
                                    )}
                                    {message.reply && <span className="rounded-md bg-emerald-500/[0.12] px-2 py-1 text-emerald-600 dark:text-emerald-200/75">Replied</span>}
                                    {message.company && <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-white/[0.045]">{message.company}</span>}
                                    {message.cost && <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-white/[0.045]">{message.cost}</span>}
                                  </div>
                                  {(message.link || message.projectDoc?.filePath) && (
                                    <div className="flex flex-wrap gap-2">
                                      {message.link && (
                                        <a href={message.link.startsWith("http") ? message.link : `https://${message.link}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-gray-200/70 bg-white/55 px-3 py-2 text-[9px] font-semibold text-gray-600 transition-all hover:border-teal-300/45 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/55 dark:hover:text-teal-100">
                                          <FaExternalLinkAlt />
                                          Website
                                        </a>
                                      )}
                                      {message.projectDoc?.filePath && (
                                        <a href={message.projectDoc.filePath} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-gray-200/70 bg-white/55 px-3 py-2 text-[9px] font-semibold text-gray-600 transition-all hover:border-teal-300/45 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/55 dark:hover:text-teal-100">
                                          <FaPaperclip />
                                          Project document
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState icon={<FaEnvelopeOpenText />} title={`No ${activeCommunicationType.toLowerCase()} messages`} text="Messages for this category will appear here after you submit them." />
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<FaEnvelopeOpenText />}
                      title="No messages yet"
                      text="Feedback, inquiries, and contact messages you send while logged in will appear here."
                      action={
                        <Link to="/contact" className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                          Write feedback
                        </Link>
                      }
                    />
                  )}
                </Surface>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="mt-5">
                {isAccountDataLoading ? (
                  <LoadingState label="Loading comments" />
                ) : accountData.comments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {accountData.comments.map((comment) => (
                      <ContentCard
                        key={comment._id}
                        to={getResourcePath(comment.resourceType, comment.resource, comment.resourceId)}
                        title={getItemTitle(comment.resource)}
                        eyebrow={getTypeMeta(comment.resourceType).singular}
                        image={getItemImage(comment.resource)}
                        icon={getTypeMeta(comment.resourceType).icon}
                        text={stripHtml(comment.content)}
                        meta={formatDate(comment.createdAt)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<FaRegCommentDots />} title="No comments yet" text="Comments you write on blogs, notes, courses, and projects will appear here." />
                )}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="mt-5">
                {isAccountDataLoading ? (
                  <LoadingState label="Loading likes" />
                ) : likeGroups.length > 0 ? (
                  <div className="space-y-6">
                    <SegmentedControl options={likeTypeTabs} value={activeLikeType} onChange={setActiveLikeType} />
                    {visibleLikeGroups.map((group) => (
                      <div key={group.type}>
                        <h3 className="mb-3 text-sm font-black text-gray-950 dark:text-white/85">{group.meta.label}</h3>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {group.items.map((item) => (
                            <ContentCard
                              key={`${group.type}-${item._id}`}
                              to={group.meta.path(item)}
                              title={getItemTitle(item)}
                              eyebrow={group.meta.singular}
                              image={getItemImage(item)}
                              icon={group.meta.icon}
                              meta={`${item.likes?.length || 0} total likes`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<FaStar />} title="No liked items yet" text="Blogs, notes, courses, and projects you like will be collected here." />
                )}
              </div>
            )}

            {activeTab === "learning" && (
              <div className="mt-5">
                {learningItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {learningItems.map(({ type, item, source }) => {
                      const meta = getTypeMeta(type);
                      return (
                        <ContentCard
                          key={`${type}-${item?._id || item?.slug}-${source}`}
                          to={meta.path(item)}
                          title={getItemTitle(item)}
                          eyebrow={source}
                          image={getItemImage(item)}
                          icon={meta.icon}
                          meta={meta.singular}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaGraduationCap />}
                    title="No learning activity yet"
                    text="Bookmarked, liked, or commented notes and course resources will become your continue-learning list."
                    action={
                      <Link to="/notes" className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                        Browse notes
                      </Link>
                    }
                  />
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="mt-5">
                {isAccountDataLoading ? (
                  <LoadingState label="Loading orders" />
                ) : accountData.orders.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg border border-gray-200/70 bg-white/60 dark:border-white/[0.055] dark:bg-white/[0.022]">
                      <div className="overflow-x-auto">
                        <table className="min-w-[920px] w-full text-left">
                          <thead className="border-b border-gray-200/70 bg-gray-50/70 dark:border-white/[0.055] dark:bg-white/[0.025]">
                            <tr className="text-[8px] font-black uppercase tracking-[0.22em] text-gray-400 dark:text-white/25">
                              <th className="px-4 py-3">Order</th>
                              <th className="px-4 py-3">Items</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3">Payment</th>
                              <th className="px-4 py-3">Dates</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200/65 dark:divide-white/[0.05]">
                            {accountData.orders.map((order) => {
                              const canPay = ["unpaid", "pending", "failed"].includes(order.status || "unpaid");
                              const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];
                              const orderLabel = order.paymentInfo?.id || order._id;
                              const status = order.status || "unpaid";
                              const refundStatus = order.refund?.status || "none";
                              const refundMeta = getRefundStatusMeta(refundStatus);

                              return (
                                <tr key={order._id} className="align-top transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.018]">
                                  <td className="px-4 py-4">
                                    <p className="max-w-[170px] truncate text-[11px] font-black text-gray-950 dark:text-white/85" title={orderLabel}>
                                      {orderLabel}
                                    </p>
                                    <p className="mt-1 text-[9px] font-semibold text-gray-400 dark:text-white/25">Created {formatDate(order.createdAt)}</p>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="space-y-1">
                                      {orderItems.length > 0 ? (
                                        orderItems.slice(0, 2).map((item) => (
                                          <p key={`${order._id}-${item.product || item._id || item.title}`} className="max-w-[220px] truncate text-[10px] font-semibold text-gray-600 dark:text-white/45" title={item.title}>
                                            {item.title || "Item"} <span className="text-gray-400 dark:text-white/25">x{item.quantity || 1}</span>
                                          </p>
                                        ))
                                      ) : (
                                        <p className="text-[10px] font-semibold text-gray-400 dark:text-white/25">Order access</p>
                                      )}
                                      {orderItems.length > 2 && <p className="text-[9px] font-bold text-teal-600 dark:text-teal-200/55">+{orderItems.length - 2} more item{orderItems.length - 2 > 1 ? "s" : ""}</p>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="text-[11px] font-black text-gray-950 dark:text-white/85">{formatCurrency(order.amount)}</p>
                                    {Number(order.discountAmount || 0) > 0 && <p className="mt-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-200/60">-{formatCurrency(order.discountAmount)} discount</p>}
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="text-[10px] font-bold capitalize text-gray-600 dark:text-white/45">{order.paymentInfo?.method || "Not selected"}</p>
                                    {order.coupon?.code && <p className="mt-1 text-[9px] font-bold text-teal-600 dark:text-teal-200/55">Coupon {order.coupon.code}</p>}
                                  </td>
                                  <td className="px-4 py-4">
                                    <p className="text-[10px] font-semibold text-gray-500 dark:text-white/35">Paid: {formatDate(order.paidAt)}</p>
                                    <p className="mt-1 text-[10px] font-semibold text-gray-500 dark:text-white/35">Expires: {formatDate(order.expiresAt)}</p>
                                    {(order.paymentInfo?.invoiceDownloadedAt || order.paymentInfo?.invoiceEmailSentAt) && (
                                      <p className="mt-1 text-[9px] font-semibold text-gray-400 dark:text-white/25">
                                        {order.paymentInfo?.invoiceDownloadedAt && <>PDF: {formatDate(order.paymentInfo.invoiceDownloadedAt)}</>}
                                        {order.paymentInfo?.invoiceDownloadedAt && order.paymentInfo?.invoiceEmailSentAt && " · "}
                                        {order.paymentInfo?.invoiceEmailSentAt && <>Email: {formatDate(order.paymentInfo.invoiceEmailSentAt)}</>}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col items-start gap-2">
                                      <span className="inline-flex rounded-md bg-teal-500/[0.08] px-3 py-2 text-[10px] font-black capitalize text-teal-700 dark:text-teal-200/75">{status}</span>
                                      {refundStatus !== "none" && <span className={`inline-flex rounded-md border px-3 py-1.5 text-[9px] font-black ${refundMeta.className}`}>{refundMeta.label}</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-wrap justify-end gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenReceipt(order._id)}
                                        disabled={receiptLoadingOrderId === order._id}
                                        className="inline-flex items-center gap-2 rounded-md border border-gray-200/70 bg-white/60 px-3 py-2 text-[10px] font-bold text-gray-600 transition-all hover:border-teal-300/35 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:text-teal-200/70"
                                      >
                                        <FaFileAlt size={12} />
                                        {receiptLoadingOrderId === order._id ? "Loading..." : "Receipt"}
                                      </button>
                                      <a
                                        href={`${REACT_APP_BACKEND_URL}/business/invoice/${order._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md border border-teal-300/25 bg-teal-500/[0.08] px-3 py-2 text-[10px] font-bold text-teal-700 transition-all hover:bg-teal-500/[0.12] dark:border-teal-300/[0.10] dark:text-teal-100/70"
                                      >
                                        Invoice
                                      </a>
                                      <a
                                        href={`${REACT_APP_BACKEND_URL}/business/invoice/${order._id}?format=pdf`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md border border-indigo-300/25 bg-indigo-500/[0.08] px-3 py-2 text-[10px] font-bold text-indigo-700 transition-all hover:bg-indigo-500/[0.12] dark:border-indigo-300/[0.10] dark:text-indigo-100/70"
                                      >
                                        <FaDownload size={11} />
                                        PDF
                                      </a>
                                      <a
                                        href={`${REACT_APP_BACKEND_URL}/business/invoice/verify/${order._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-500/[0.08] px-3 py-2 text-[10px] font-bold text-emerald-700 transition-all hover:bg-emerald-500/[0.12] dark:border-emerald-300/[0.10] dark:text-emerald-100/70"
                                      >
                                        <FaShieldAlt size={11} />
                                        Verify
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleResendInvoiceEmail(order._id)}
                                        disabled={resendingInvoiceOrderId === order._id}
                                        className="inline-flex items-center gap-2 rounded-md border border-cyan-300/25 bg-cyan-500/[0.08] px-3 py-2 text-[10px] font-bold text-cyan-700 transition-all hover:bg-cyan-500/[0.12] disabled:cursor-not-allowed disabled:opacity-60 dark:border-cyan-300/[0.10] dark:text-cyan-100/70"
                                      >
                                        <FaEnvelopeOpenText size={11} />
                                        {resendingInvoiceOrderId === order._id ? "Sending..." : "Email"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyInvoiceLink(order._id)}
                                        className="inline-flex items-center gap-2 rounded-md border border-gray-200/70 bg-white/55 px-3 py-2 text-[10px] font-bold text-gray-600 transition-all hover:border-teal-300/35 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45 dark:hover:text-teal-200/70"
                                      >
                                        <FaCopy size={11} />
                                        Copy
                                      </button>
                                      {order.status === "paid" && (order.refund?.status || "none") === "none" && (
                                        <button
                                          type="button"
                                          onClick={() => openRefundModal(order)}
                                          className="inline-flex items-center gap-2 rounded-md border border-rose-300/25 bg-rose-500/[0.08] px-3 py-2 text-[10px] font-bold text-rose-700 transition-all hover:bg-rose-500/[0.12] dark:border-rose-300/[0.10] dark:text-rose-100/70"
                                        >
                                          <FaUndoAlt size={11} />
                                          Request refund
                                        </button>
                                      )}
                                      {canPay && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleStartPayment(order._id, "esewa")}
                                            disabled={payingOrderId === order._id}
                                            className="inline-flex items-center gap-2 rounded-md border border-amber-300/30 bg-amber-500/[0.10] px-3 py-2 text-[10px] font-bold text-amber-700 transition-all hover:bg-amber-500/[0.16] disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-300/[0.10] dark:text-amber-100/75"
                                          >
                                            <FaCreditCard size={12} />
                                            {payingOrderId === order._id ? "Starting..." : "eSewa"}
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleStartPayment(order._id, "stripe")}
                                            disabled={payingOrderId === order._id}
                                            className="inline-flex items-center gap-2 rounded-md border border-indigo-300/30 bg-indigo-500/[0.08] px-3 py-2 text-[10px] font-bold text-indigo-700 transition-all hover:bg-indigo-500/[0.14] disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-300/[0.10] dark:text-indigo-100/75"
                                          >
                                            <FaCreditCard size={12} />
                                            Stripe
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {selectedReceipt && (
                      <div className="rounded-lg border border-teal-300/25 bg-teal-500/[0.045] p-4 dark:border-teal-300/[0.08] dark:bg-teal-300/[0.025]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-200/55">Receipt preview</p>
                            <h3 className="mt-2 text-lg font-black text-gray-950 dark:text-white/90">Order #{selectedReceipt.orderId}</h3>
                            <p className="mt-1 text-[10px] text-gray-500 dark:text-white/35">Status: {selectedReceipt.status || "paid"} · Gateway: {selectedReceipt.paymentInfo?.method || "-"}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handlePrintReceipt}
                              className="rounded-md bg-teal-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-teal-500"
                            >
                              Print / Save PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt(null)}
                              className="rounded-md border border-gray-200/70 bg-white/60 px-4 py-2 text-[10px] font-bold text-gray-600 transition-all hover:border-teal-300/35 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.022] dark:text-white/45"
                            >
                              Close
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2 text-[10px] text-gray-500 dark:text-white/35 sm:grid-cols-4">
                          <span>Paid: {formatDate(selectedReceipt.paidAt)}</span>
                          <span>Expires: {formatDate(selectedReceipt.expiresAt)}</span>
                          <span>Subtotal: {formatCurrency(selectedReceipt.subtotal)}</span>
                          <span>Total: {formatCurrency(selectedReceipt.total)}</span>
                        </div>

                        <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200/70 bg-white/65 dark:border-white/[0.055] dark:bg-white/[0.018]">
                          <table className="min-w-[640px] w-full text-left">
                            <thead className="border-b border-gray-200/70 dark:border-white/[0.055]">
                              <tr className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-white/25">
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3 text-right">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200/65 dark:divide-white/[0.05]">
                              {(selectedReceipt.items || []).map((item) => (
                                <tr key={`${selectedReceipt.orderId}-${item.product || item.title}`}>
                                  <td className="px-4 py-3 text-[11px] font-bold text-gray-800 dark:text-white/70">{item.title || "Item"}</td>
                                  <td className="px-4 py-3 text-[10px] font-semibold text-gray-500 dark:text-white/35">{item.productModel || "-"}</td>
                                  <td className="px-4 py-3 text-[10px] font-semibold text-gray-500 dark:text-white/35">{item.quantity || 1}</td>
                                  <td className="px-4 py-3 text-right text-[11px] font-black text-gray-950 dark:text-white/85">{formatCurrency(item.price)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="border-t border-gray-200/70 dark:border-white/[0.055]">
                              <tr>
                                <td className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 dark:text-white/35" colSpan={3}>Subtotal</td>
                                <td className="px-4 py-3 text-right text-[11px] font-black text-gray-950 dark:text-white/85">{formatCurrency(selectedReceipt.subtotal)}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 dark:text-white/35" colSpan={3}>Discount</td>
                                <td className="px-4 py-3 text-right text-[11px] font-black text-emerald-600 dark:text-emerald-200/60">-{formatCurrency(selectedReceipt.discountAmount)}</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-white/35" colSpan={3}>Total</td>
                                <td className="px-4 py-3 text-right text-sm font-black text-teal-700 dark:text-teal-200/75">{formatCurrency(selectedReceipt.total)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState icon={<FaPaperclip />} title="No orders yet" text="Your orders, payments, invoices, and active access records will appear here." />
                )}
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <StatPill icon={<FaAward />} label="Certificates" value={accountData.certificates.length} />
                  <StatPill icon={<FaGraduationCap />} label="Completed courses" value={new Set(accountData.certificates.map((certificate) => certificate.course?._id || certificate.course?.slug || certificate.certificateId)).size} />
                  <StatPill icon={<IoCheckmarkCircle />} label="Latest issued" value={accountData.certificates[0]?.issuedAt ? formatDate(accountData.certificates[0].issuedAt) : "-"} />
                </div>

                {isAccountDataLoading ? (
                  <LoadingState label="Loading certificates" />
                ) : accountData.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {accountData.certificates.map((certificate) => {
                      const courseImage = getAssetUrl(certificate.course?.thumbnail) || getAssetUrl(certificate.course?.logo);
                      const courseName = certificate.course?.name || "Completed course";

                      return (
                        <article
                          key={certificate._id || certificate.certificateId}
                          className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/65 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-teal-300/40 dark:border-white/[0.06] dark:bg-white/[0.025] dark:shadow-[0_20px_46px_rgba(0,0,0,0.22)]"
                        >
                          <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-teal-400/10 blur-3xl transition-all group-hover:bg-teal-300/15" />
                          <div className="pointer-events-none absolute -bottom-20 left-8 size-48 rounded-full bg-amber-300/10 blur-3xl" />

                          <div className="relative flex flex-wrap items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-4">
                              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-50 text-xl text-amber-600 dark:border-white/[0.08] dark:bg-white/[0.035] dark:text-amber-200/80">
                                {courseImage ? <img src={courseImage} alt={courseName} className="h-full w-full object-cover" /> : <FaAward />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-200/55">Verified certificate</p>
                                <h3 className="mt-2 line-clamp-2 text-base font-bold text-gray-950 dark:text-white/90">{courseName}</h3>
                                <p className="mt-2 text-[10px] font-semibold text-gray-400 dark:text-white/28">Certificate ID: {certificate.certificateId}</p>
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-500/[0.08] px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-amber-700 dark:border-amber-200/[0.10] dark:text-amber-100/75">
                              <FaAward size={11} />
                              Complete
                            </span>
                          </div>

                          {certificate.course?.metaDescription && <p className="relative mt-4 line-clamp-2 text-[11px] leading-6 text-gray-500 dark:text-white/38">{stripHtml(certificate.course.metaDescription)}</p>}

                          <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.018]">
                              <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Completed</p>
                              <p className="mt-1 text-[11px] font-bold text-gray-700 dark:text-white/65">{formatDate(certificate.completedAt)}</p>
                            </div>
                            <div className="rounded-xl border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.018]">
                              <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Issued</p>
                              <p className="mt-1 text-[11px] font-bold text-gray-700 dark:text-white/65">{formatDate(certificate.issuedAt)}</p>
                            </div>
                          </div>

                          <div className="relative mt-5 flex flex-wrap items-center gap-2">
                            <a
                              href={certificate.downloadUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-teal-300/25 bg-teal-500/[0.10] px-4 py-2.5 text-[10px] font-bold text-teal-700 transition-all hover:bg-teal-500/[0.16] dark:border-teal-200/[0.10] dark:text-teal-100/75"
                            >
                              <FaFileAlt size={12} />
                              Download PDF
                            </a>
                            <a
                              href={certificate.verificationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200/75 bg-white/55 px-4 py-2.5 text-[10px] font-bold text-gray-600 transition-all hover:border-teal-300/35 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/45 dark:hover:text-teal-200/75"
                            >
                              <FaExternalLinkAlt size={11} />
                              Verify
                            </a>
                            {certificate.course?.slug && (
                              <Link
                                to={`/course/${certificate.course.slug}`}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200/75 bg-white/55 px-4 py-2.5 text-[10px] font-bold text-gray-600 transition-all hover:border-teal-300/35 hover:text-teal-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/45 dark:hover:text-teal-200/75"
                              >
                                Open course
                              </Link>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaAward />}
                    title="No certificates yet"
                    text="Complete every chapter and subheading in a course. Once course progress reaches 100%, your certificate will appear here automatically."
                    action={
                      <Link to="/courses" className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                        Browse courses
                      </Link>
                    }
                  />
                )}
              </div>
            )}

            {activeTab === "refunds" && (
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <StatPill icon={<FaUndoAlt />} label="Total requests" value={accountData.refunds.length} />
                  <StatPill icon={<FaMoneyCheckAlt />} label="In review" value={accountData.refunds.filter((refund) => refund.status === "requested" || refund.status === "approved").length} />
                  <StatPill icon={<IoCheckmarkCircle />} label="Completed" value={accountData.refunds.filter((refund) => refund.status === "refunded").length} />
                </div>
                <div className="rounded-lg border border-amber-300/20 bg-amber-500/[0.055] p-4 text-[11px] leading-6 text-amber-700 dark:border-amber-300/[0.08] dark:text-amber-100/65">
                  Refund requests are usually reviewed within <strong>3-5 business days</strong>. You can track every step here, and admin notes will appear once reviewed.
                </div>

                {accountData.refunds.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {accountData.refunds.map((refund) => {
                      const refundMeta = getRefundStatusMeta(refund.status);
                      const orderItems = Array.isArray(refund.order?.orderItems) ? refund.order.orderItems : [];

                      return (
                        <article key={refund._id} className="overflow-hidden rounded-lg border border-gray-200/70 bg-white/60 shadow-[0_14px_34px_rgba(15,23,42,0.045)] dark:border-white/[0.055] dark:bg-white/[0.022]">
                          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200/70 p-4 dark:border-white/[0.05]">
                            <div>
                              <p className="text-[8px] font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-200/55">Refund request</p>
                              <h3 className="mt-1 max-w-md truncate text-sm font-black text-gray-950 dark:text-white/85">Order #{refund.order?._id || refund.order}</h3>
                              <p className="mt-1 text-[10px] font-semibold text-gray-400 dark:text-white/25">Submitted {formatDate(refund.createdAt)} · {getRefundLabel(refundCategoryOptions, refund.category)}</p>
                            </div>
                            <span className={`inline-flex rounded-md border px-3 py-2 text-[10px] font-black ${refundMeta.className}`}>{refundMeta.label}</span>
                          </div>

                          <div className="p-4">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                              <div className="rounded-lg border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Amount</p>
                                <p className="mt-1 text-sm font-black text-gray-950 dark:text-white/85">{formatCurrency(refund.order?.amount)}</p>
                              </div>
                              <div className="rounded-lg border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Gateway</p>
                                <p className="mt-1 text-[11px] font-bold capitalize text-gray-600 dark:text-white/45">{refund.order?.paymentInfo?.method || "-"}</p>
                              </div>
                              <div className="rounded-lg border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Refund to</p>
                                <p className="mt-1 truncate text-[11px] font-bold text-gray-600 dark:text-white/45">{getRefundLabel(refundMethodOptions, refund.refundMethod)}</p>
                              </div>
                            </div>

                            {orderItems.length > 0 && (
                              <div className="mt-3 rounded-lg border border-gray-200/70 bg-white/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.016]">
                                <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Items</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {orderItems.slice(0, 3).map((item) => (
                                    <span key={`${refund._id}-${item.product || item.title}`} className="rounded-md border border-gray-200/70 bg-white/60 px-2.5 py-1 text-[9px] font-bold text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/35">
                                      {item.title || "Item"}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <p className="mt-3 rounded-lg border border-gray-200/70 bg-white/45 p-3 text-[11px] leading-6 text-gray-600 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/40">{refund.reason}</p>
                            <RefundTimeline refund={refund} />
                            {refund.adminNote && <p className="mt-3 rounded-lg border border-teal-300/25 bg-teal-500/[0.055] p-3 text-[11px] leading-6 text-teal-700 dark:border-teal-300/[0.09] dark:text-teal-100/70">Admin note: {refund.adminNote}</p>}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FaUndoAlt />}
                    title="No refund requests"
                    text="If a paid order has a problem, open Orders and request a refund from that order row."
                    action={
                      <button type="button" onClick={() => setTab("orders")} className="mt-4 inline-flex rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">
                        View orders
                      </button>
                    }
                  />
                )}
              </div>
            )}

            {activeTab === "downloads" && (
              <div className="mt-5">
                {accountData.downloads.length > 0 ? (
                  <div className="space-y-3">
                    {accountData.downloads.map((download) => (
                      <div key={`${download.product || download.id}-${download.orderId || download.date}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                        <div>
                          <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">{download.title}</h3>
                          <p className="mt-2 text-[10px] text-gray-400 dark:text-white/28">
                            {download.productModel || "Download"} · Access until {formatDate(download.expiresAt || download.date)}
                          </p>
                        </div>
                        {download.product && download.productModel && (
                          <a href={getSecureDownloadUrl(download)} className="rounded-lg bg-teal-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-teal-500">
                            Secure download
                          </a>
                        )}
                      </div>
                    ))}
                    {accountData.downloadLogs.length > 0 && (
                      <div className="rounded-lg border border-gray-200/70 bg-white/45 p-4 dark:border-white/[0.055] dark:bg-white/[0.016]">
                        <p className="text-[8px] font-semibold uppercase tracking-widest text-gray-400 dark:text-white/25">Download history</p>
                        <div className="mt-3 space-y-2">
                          {accountData.downloadLogs.slice(0, 5).map((log) => (
                            <p key={log._id} className="text-[10px] font-semibold text-gray-500 dark:text-white/35">
                              {log.title || "Downloaded file"} · {formatDate(log.createdAt)}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState icon={<FaFolderOpen />} title="No downloads tracked yet" text="Downloaded resources can be tracked here once download actions start recording per-user history." />
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="mt-5">
                {notificationItems.length + accountData.notifications.length > 0 ? (
                  <div className="space-y-3">
                    {accountData.notifications.map((notification) => (
                      <div key={notification._id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                        <div>
                          <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">{notification.title}</h3>
                          <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">{notification.message}</p>
                          <p className="mt-2 text-[9px] font-medium text-gray-400 dark:text-white/28">{formatDate(notification.createdAt)}</p>
                        </div>
                        {!notification.readAt && (
                          <button type="button" onClick={() => handleMarkNotificationRead(notification._id)} className="rounded-md border border-teal-300/25 bg-teal-500/[0.08] px-3 py-2 text-[10px] font-bold text-teal-700 dark:text-teal-200/70">
                            Mark read
                          </button>
                        )}
                      </div>
                    ))}
                    {notificationItems.map((item) => (
                      <div key={`${item.title}-${item.text}`} className="rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                        <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">{item.title}</h3>
                        <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">{item.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<IoNotificationsOutline />} title="No alerts" text="Replies, verification reminders, and account updates will appear here." />
                )}
              </div>
            )}

            {activeTab === "support" && (
              <div className="mt-5 space-y-5">
                <form onSubmit={handleSupportSubmit} className="rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">Create support ticket</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <TextInput value={supportForm.subject} onChange={(event) => setSupportForm((currentValue) => ({ ...currentValue, subject: event.target.value }))} placeholder="Subject" />
                    <textarea
                      value={supportForm.message}
                      onChange={(event) => setSupportForm((currentValue) => ({ ...currentValue, message: event.target.value }))}
                      placeholder="Tell me what happened..."
                      rows={5}
                      className="w-full rounded-lg border border-gray-200/70 bg-white/60 px-4 py-3 text-[11px] text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-teal-300/50 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/70 dark:placeholder:text-white/25"
                    />
                  </div>
                  <button type="submit" className="mt-4 rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">Submit ticket</button>
                </form>

                {accountData.tickets.length > 0 ? (
                  <div className="space-y-3">
                    {accountData.tickets.map((ticket) => (
                      <div key={ticket._id} className="rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">{ticket.subject}</h3>
                            <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">{ticket.message}</p>
                          </div>
                          <span className="rounded-md bg-teal-500/[0.08] px-3 py-2 text-[10px] font-bold capitalize text-teal-700 dark:text-teal-200/75">{ticket.status}</span>
                        </div>
                        {ticket.replies?.length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-gray-200/70 pt-3 dark:border-white/[0.05]">
                            {ticket.replies.map((reply) => (
                              <p key={reply._id || reply.createdAt} className="text-[10px] leading-5 text-gray-500 dark:text-white/35">
                                <span className="font-bold text-gray-700 dark:text-white/60">{reply.isAdmin ? "Admin" : "You"}:</span> {reply.message}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<IoHelpCircleOutline />} title="No support tickets" text="Create a ticket when you need help with orders, downloads, or account access." />
                )}
              </div>
            )}

            {activeTab === "social" && (
              <div className="mt-5 space-y-5">
                <form onSubmit={handleSocialLinkSubmit} className="flex flex-col gap-3 rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022] sm:flex-row">
                  <TextInput value={socialLinkForm} onChange={(event) => setSocialLinkForm(event.target.value)} placeholder="https://github.com/username" />
                  <button type="submit" className="rounded-lg bg-teal-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-teal-500">Add link</button>
                </form>
                {!user?.isVerified && <p className="text-[11px] text-amber-600 dark:text-amber-200/70">Verify your account before adding social links.</p>}
                {accountData.links.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {accountData.links.map((item) => (
                      <a key={item._id || item.link} href={item.link?.startsWith("http") ? item.link : `https://${item.link}`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022] text-[11px] font-semibold text-gray-700 dark:text-white/65 transition-all hover:border-teal-300/[0.24] hover:border-teal-300/45">
                        {item.link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<FaExternalLinkAlt />} title="No social links" text="Add GitHub, LinkedIn, portfolio, or website links to complete your profile." />
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="mt-5">
                {activityItems.length > 0 ? (
                  <div className="space-y-3">
                    {activityItems.map((item) => (
                      <div key={item.id} className="rounded-lg border border-gray-200/70 bg-white/60 p-4 dark:border-white/[0.055] dark:bg-white/[0.022]">
                        <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">{item.title}</h3>
                        <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">{item.text}</p>
                        <p className="mt-2 text-[9px] font-medium text-gray-400 dark:text-white/28">{formatDate(item.date)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<IoCheckmarkCircle />} title="No activity yet" text="Your messages, comments, likes, and orders will create a timeline here." />
                )}
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-gray-200/70 bg-white/55 p-5 dark:border-white/[0.05] dark:bg-white/[0.016]">
                  <h3 className="text-sm font-bold text-gray-950 dark:text-white/85">Privacy and data</h3>
                  <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">Your dashboard keeps profile details, bookmarks, likes, comments, messages, social links, and order records tied to your account.</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <StatPill icon={<FaRegCommentDots />} label="Comments" value={accountData.comments.length} />
                    <StatPill icon={<FaStar />} label="Likes" value={totalLikes} />
                    <StatPill icon={<FaEnvelopeOpenText />} label="Messages" value={totalMessages} />
                  </div>
                </div>
                <div className="rounded-lg border border-rose-300/30 bg-rose-500/[0.04] p-5">
                  <h3 className="text-sm font-bold text-rose-700 dark:text-rose-200/80">Delete account</h3>
                  <p className="mt-2 text-[11px] leading-6 text-rose-700/70 dark:text-rose-100/45">This permanently removes your account. Type DELETE to confirm.</p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <TextInput value={privacyConfirm} onChange={(event) => setPrivacyConfirm(event.target.value)} placeholder="Type DELETE" />
                    <button type="button" onClick={handleDeleteAccount} className="rounded-lg bg-rose-600 px-5 py-3 text-[10px] font-semibold text-white transition-all hover:bg-rose-500">Delete</button>
                  </div>
                </div>
              </div>
            )}

          </section>
        </main>
      </div>

      {refundModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <form onSubmit={handleRefundRequest} className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#101821]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-rose-400" />
            <button
              type="button"
              onClick={closeRefundModal}
              disabled={isSubmittingRefund}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-lg border border-gray-200/70 bg-white/70 text-gray-400 transition-all hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/35"
              aria-label="Close refund request"
            >
              <FaTimes />
            </button>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4 pr-10">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-600 dark:border-rose-300/[0.10] dark:text-rose-100/75">
                  <FaUndoAlt />
                </span>
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-200/65">Refund request</p>
                  <h3 className="mt-1 text-xl font-black text-gray-950 dark:text-white/90">Tell us what went wrong</h3>
                  <p className="mt-2 text-[11px] leading-6 text-gray-500 dark:text-white/35">
                    Order #{refundModalOrder.paymentInfo?.id || refundModalOrder._id} · {formatCurrency(refundModalOrder.amount)} · {refundModalOrder.paymentInfo?.method || "payment"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Refund reason">
                  <CustomDropdown
                    value={refundForm.category}
                    onChange={(value) => handleRefundFormChange({ target: { name: "category", value } })}
                    options={refundCategoryOptions}
                    className="w-full"
                    buttonClassName="!h-11 !rounded-lg !bg-white/70 !px-4 !text-[11px] !font-medium !text-gray-800 !ring-gray-200/75 dark:!bg-white/[0.025] dark:!text-white/75 dark:!ring-white/[0.06]"
                    menuClassName="!min-w-full"
                    align="left"
                  />
                </Field>

                <Field label="Refund method">
                  <CustomDropdown
                    value={refundForm.refundMethod}
                    onChange={(value) => handleRefundFormChange({ target: { name: "refundMethod", value } })}
                    options={refundMethodOptions}
                    className="w-full"
                    buttonClassName="!h-11 !rounded-lg !bg-white/70 !px-4 !text-[11px] !font-medium !text-gray-800 !ring-gray-200/75 dark:!bg-white/[0.025] dark:!text-white/75 dark:!ring-white/[0.06]"
                    menuClassName="!min-w-full"
                    align="left"
                  />
                </Field>
              </div>

              <div className="mt-3">
                <Field label="Refund contact / account detail">
                  <TextInput name="refundContact" value={refundForm.refundContact} onChange={handleRefundFormChange} placeholder="Optional: eSewa ID, bank account, or contact number" />
                </Field>
              </div>

              <div className="mt-3">
                <Field label="Explain the issue">
                  <TextArea name="reason" value={refundForm.reason} onChange={handleRefundFormChange} rows={6} placeholder="Example: I purchased the wrong course, or the resource could not be accessed after payment..." />
                </Field>
                <p className="mt-2 text-[10px] text-gray-400 dark:text-white/25">{refundForm.reason.trim().length}/1200 characters · minimum 12</p>
              </div>

              <div className="mt-5 rounded-lg border border-amber-300/25 bg-amber-500/[0.055] p-4 text-[11px] leading-6 text-amber-700 dark:border-amber-300/[0.10] dark:text-amber-100/65">
                Admin will review the order, gateway record, and your reason before approval. You can track every update from the Refunds tab.
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button type="button" onClick={closeRefundModal} disabled={isSubmittingRefund} className="rounded-lg border border-gray-200/70 bg-white/70 px-5 py-3 text-[10px] font-bold text-gray-600 transition-all hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-white/45">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingRefund} className="rounded-lg bg-rose-600 px-5 py-3 text-[10px] font-black text-white transition-all hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmittingRefund ? "Submitting..." : "Submit refund request"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

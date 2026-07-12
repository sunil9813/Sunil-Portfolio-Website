import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

import { FaStar } from "react-icons/fa";
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineArrowsUpDown,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckBadge,
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineFunnel,
  HiOutlineInbox,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineXMark,
} from "react-icons/hi2";

import { DateFormatter } from "@/components/common/DateFormatter";
import { getAllTestimonial, getTestimonial, updateTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { generateItemColor } from "@/utils";
import { TertiaryButton, Wrapper } from "@/routes";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const ROWS_PER_PAGE = 7;

const TESTIMONIAL_UI_STYLES = `
  .testimonial-table-scroll,
  .testimonial-popup-scroll {
    scrollbar-width: thin;
    scrollbar-color: #35404d transparent;
    overscroll-behavior: contain;
  }

  .testimonial-table-scroll::-webkit-scrollbar,
  .testimonial-popup-scroll::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .testimonial-table-scroll::-webkit-scrollbar-track,
  .testimonial-popup-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .testimonial-table-scroll::-webkit-scrollbar-thumb,
  .testimonial-popup-scroll::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #35404d;
  }

  .testimonial-table-scroll::-webkit-scrollbar-thumb:hover,
  .testimonial-popup-scroll::-webkit-scrollbar-thumb:hover {
    background: #4a5868;
  }

  .testimonial-table-scroll::-webkit-scrollbar-corner,
  .testimonial-popup-scroll::-webkit-scrollbar-corner {
    background: transparent;
  }

  .react-confirm-alert-overlay.testimonial-confirm-overlay {
    z-index: 99999;
    padding: 18px;
    background: rgba(2, 5, 9, 0.88);
    backdrop-filter: blur(10px);
  }

  .testimonial-custom-dialog {
    animation: testimonialDialogIn 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes testimonialDialogIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.97);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const TAB_CONFIG = [
  {
    value: "contact",
    label: "Contact",
    description: "General messages",
    icon: HiOutlineEnvelope,
    activeClass: "border-cyan-300/30 bg-cyan-500/[0.09] text-cyan-700 shadow-[0_12px_28px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.13] dark:bg-cyan-300/[0.05] dark:text-cyan-200/80",
    iconClass: "border-cyan-300/25 bg-cyan-500/[0.10] text-cyan-700 dark:border-cyan-300/[0.10] dark:bg-cyan-300/[0.055] dark:text-cyan-200/75",
  },
  {
    value: "feedback",
    label: "Feedback",
    description: "Reviews and ratings",
    icon: FaStar,
    activeClass: "border-amber-300/30 bg-amber-500/[0.09] text-amber-700 shadow-[0_12px_28px_rgba(245,158,11,0.08)] dark:border-amber-300/[0.13] dark:bg-amber-300/[0.05] dark:text-amber-200/80",
    iconClass: "border-amber-300/25 bg-amber-500/[0.10] text-amber-700 dark:border-amber-300/[0.10] dark:bg-amber-300/[0.055] dark:text-amber-200/75",
  },
  {
    value: "inquiry",
    label: "Project Inquiry",
    description: "Potential client work",
    icon: HiOutlineBriefcase,
    activeClass: "border-indigo-300/30 bg-indigo-500/[0.09] text-indigo-700 shadow-[0_12px_28px_rgba(99,102,241,0.08)] dark:border-indigo-300/[0.13] dark:bg-indigo-300/[0.05] dark:text-indigo-200/80",
    iconClass: "border-indigo-300/25 bg-indigo-500/[0.10] text-indigo-700 dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.055] dark:text-indigo-200/75",
  },
];

const TABLE_COLUMNS = {
  contact: ["#", "Sender", "Phone", "Location", "Message", "Submitted"],
  feedback: ["#", "Sender", "Feedback", "Rating", "Position", "Company", "Submitted"],
  inquiry: ["#", "Sender", "Inquiry", "Document", "Budget", "Company", "Submitted"],
};

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All status",
  },
  {
    value: "pending",
    label: "Awaiting reply",
  },
  {
    value: "replied",
    label: "Replied",
  },
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Newest first",
  },
  {
    value: "oldest",
    label: "Oldest first",
  },
  {
    value: "name",
    label: "Name A-Z",
  },
];

const TABLE_CELL_CLASS = "border-b border-slate-200/65 px-3 py-4 align-middle dark:border-white/[0.045]";

const TABLE_HEAD_CELL_CLASS =
  "sticky top-0 z-10 border-b border-slate-200/75 bg-slate-100/85 px-3 py-3.5 text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 backdrop-blur-xl dark:border-white/[0.055] dark:bg-[#171717]/95 dark:text-white/25";

const TABLE_ACTION_HEAD_CELL_CLASS = `${TABLE_HEAD_CELL_CLASS} right-0 z-20 min-w-[220px] text-right`;

const TABLE_ACTION_CELL_CLASS = `${TABLE_CELL_CLASS} sticky right-0 z-[6] min-w-[220px] dark:bg-[#1C1C1C]`;

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

const executeThunk = async (dispatch, thunkAction) => {
  const request = dispatch(thunkAction);

  if (typeof request?.unwrap === "function") {
    return request.unwrap();
  }

  const result = await request;

  if (result?.meta?.requestStatus === "rejected" || result?.error) {
    throw result?.payload || result?.error;
  }

  return result?.payload ?? result;
};

const normaliseTestimonialPayload = (payload) => {
  return payload?.testimonial || payload?.data?.testimonial || payload?.data || payload || null;
};

const safeExternalUrl = (value) => {
  if (!value) {
    return null;
  }

  try {
    const formattedValue = value.startsWith("https://") || value.startsWith("http://") ? value : `https://${value}`;

    const parsedUrl = new URL(formattedValue);

    if (!["https:", "http:"].includes(parsedUrl.protocol)) {
      return null;
    }

    return parsedUrl.href;
  } catch {
    return null;
  }
};

const getDisplayName = (item) => {
  return item?.user?.name || item?.fullname || item?.name || "Unknown visitor";
};

const getDisplayEmail = (item) => {
  return item?.user?.email || item?.email || "Email not provided";
};

const getInitials = (value = "") => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

const getAvatarUrl = (item) => {
  const userAvatar = item?.user?.avatar;
  const testimonialAvatar = item?.avatar;

  if (typeof userAvatar === "string") {
    return userAvatar;
  }

  if (typeof testimonialAvatar === "string") {
    return testimonialAvatar;
  }

  return userAvatar?.url || userAvatar?.filePath || testimonialAvatar?.url || testimonialAvatar?.filePath || "";
};

const getTypeLabel = (type) => {
  if (type === "feedback") {
    return "Feedback";
  }

  if (type === "inquiry") {
    return "Project inquiry";
  }

  return "Contact message";
};

const getTypeBadgeClass = (type) => {
  if (type === "feedback") {
    return "border-amber-300/25 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70";
  }

  if (type === "inquiry") {
    return "border-indigo-300/25 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70";
  }

  return "border-cyan-300/25 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70";
};

const getPopupTypeBadgeClass = (type) => {
  if (type === "feedback") {
    return "border-amber-300/[0.12] bg-amber-300/[0.05] text-amber-200/75";
  }

  if (type === "inquiry") {
    return "border-indigo-300/[0.12] bg-indigo-300/[0.05] text-indigo-200/75";
  }

  return "border-cyan-300/[0.12] bg-cyan-300/[0.05] text-cyan-200/75";
};

const getSearchableText = (item) => {
  return [getDisplayName(item), getDisplayEmail(item), item?.phone, item?.location, item?.content, item?.position, item?.company, item?.cost].filter(Boolean).join(" ").toLowerCase();
};

const Avatar = ({ item, sizeClass = "size-10", roundedClass = "rounded-2xl" }) => {
  const displayName = getDisplayName(item);
  const avatarUrl = getAvatarUrl(item);

  const useGeneratedAvatar = !avatarUrl || avatarUrl === DEFAULT_AVATAR;

  if (useGeneratedAvatar) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center text-[10px] font-semibold uppercase text-white shadow-[0_8px_22px_rgba(15,23,42,0.14)] ${sizeClass} ${roundedClass}`}
        style={{
          background: generateItemColor(displayName),
        }}
      >
        {getInitials(displayName)}
      </div>
    );
  }

  return (
    <div className={`shrink-0 overflow-hidden border border-slate-200/75 bg-slate-100 shadow-sm dark:border-white/[0.07] dark:bg-white/[0.025] ${sizeClass} ${roundedClass}`}>
      <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
    </div>
  );
};

Avatar.propTypes = {
  item: PropTypes.object,
  sizeClass: PropTypes.string,
  roundedClass: PropTypes.string,
};

const RatingStars = ({ value = 0, showValue = false, size = 13 }) => {
  const rating = Math.min(Math.max(Number(value) || 0, 0), 5);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar key={star} size={size} className={star <= rating ? "text-amber-400" : "text-slate-200 dark:text-white/[0.10]"} />
        ))}
      </div>

      {showValue && <span className="ml-1 text-[8px] font-bold tabular-nums text-amber-700 dark:text-amber-200/65">{rating}/5</span>}
    </div>
  );
};

RatingStars.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showValue: PropTypes.bool,
  size: PropTypes.number,
};

const StatusBadge = ({ replied, compact = false }) => {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold ${compact ? "px-2 py-1 text-[7px]" : "px-3 py-1.5 text-[8px]"} ${
        replied
          ? "border-emerald-300/25 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
          : "border-amber-300/25 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70"
      }`}
    >
      <span className={`size-1.5 rounded-full ${replied ? "bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.45)]" : "bg-amber-500 shadow-[0_0_7px_rgba(245,158,11,0.40)]"}`} />

      {replied ? "Replied" : "Awaiting reply"}
    </span>
  );
};

StatusBadge.propTypes = {
  replied: PropTypes.bool,
  compact: PropTypes.bool,
};

const PopupStatusBadge = ({ replied, compact = false }) => {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border font-semibold ${compact ? "px-2 py-1 text-[7px]" : "px-3 py-1.5 text-[8px]"} ${
        replied ? "border-emerald-300/[0.12] bg-emerald-300/[0.05] text-emerald-200/75" : "border-amber-300/[0.12] bg-amber-300/[0.05] text-amber-200/75"
      }`}
    >
      <span className={`size-1.5 rounded-full ${replied ? "bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,0.35)]" : "bg-amber-300 shadow-[0_0_7px_rgba(252,211,77,0.30)]"}`} />

      {replied ? "Replied" : "Awaiting reply"}
    </span>
  );
};

PopupStatusBadge.propTypes = {
  replied: PropTypes.bool,
  compact: PropTypes.bool,
};

const UserCell = ({ item }) => {
  return (
    <div className="flex min-w-[210px] items-center gap-3">
      <Avatar item={item} />

      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold capitalize text-slate-800 dark:text-white/70">{getDisplayName(item)}</p>

        <p className="mt-1 max-w-[180px] truncate text-[8px] text-slate-400 dark:text-white/25">{getDisplayEmail(item)}</p>

        <div className="mt-1.5">
          <StatusBadge replied={item?.reply === true} compact />
        </div>
      </div>
    </div>
  );
};

UserCell.propTypes = {
  item: PropTypes.object.isRequired,
};

const IndexBadge = ({ value }) => {
  return (
    <span className="flex size-7 items-center justify-center rounded-lg border border-slate-200/75 bg-slate-50/65 text-[8px] font-bold tabular-nums text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/30">
      {value}
    </span>
  );
};

IndexBadge.propTypes = {
  value: PropTypes.number.isRequired,
};

const MutedValue = ({ children, minWidth = "min-w-[130px]" }) => {
  return <span className={`inline-block ${minWidth} text-[9px] font-medium capitalize text-slate-600 dark:text-white/45`}>{children || "Not provided"}</span>;
};

MutedValue.propTypes = {
  children: PropTypes.node,
  minWidth: PropTypes.string,
};

const IconValue = ({ icon: Icon, children, accentClass = "text-indigo-600 dark:text-indigo-200/55", minWidth = "min-w-[140px]", href }) => {
  const className = `inline-flex ${minWidth} items-center gap-2 text-[9px] font-medium capitalize text-slate-600 transition-colors dark:text-white/45 ${
    href ? "hover:text-cyan-700 dark:hover:text-cyan-200/70" : ""
  }`;

  const content = (
    <>
      <Icon className={`shrink-0 ${accentClass}`} />
      {children || "Not provided"}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <span className={className}>{content}</span>;
};

IconValue.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node,
  accentClass: PropTypes.string,
  minWidth: PropTypes.string,
  href: PropTypes.string,
};

const MessagePreview = ({ children, fallback = "No message provided.", minWidth = "min-w-[230px]", maxWidth = "max-w-[340px]" }) => {
  return <p className={`line-clamp-2 ${minWidth} ${maxWidth} text-[9px] leading-5 text-slate-500 dark:text-white/35`}>{children || fallback}</p>;
};

MessagePreview.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.string,
  minWidth: PropTypes.string,
  maxWidth: PropTypes.string,
};

const SummaryCard = ({ icon: Icon, label, value, description, accentClass }) => {
  return (
    <div className="group/stat relative overflow-hidden rounded-2xl border border-slate-200/75 bg-white/55 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_30px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:hover:border-white/[0.09]">
      <div className="flex items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/stat:scale-105 ${accentClass}`}>
          <Icon size={16} />
        </span>

        <div className="min-w-0">
          <p className="text-lg font-semibold tabular-nums tracking-[-0.03em] text-slate-900 dark:text-white/85">{value}</p>

          <p className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">{label}</p>
        </div>
      </div>

      <p className="mt-3 truncate border-t border-slate-200/70 pt-2.5 text-[8px] text-slate-400 dark:border-white/[0.05] dark:text-white/25">{description}</p>
    </div>
  );
};

SummaryCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  description: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
};

const ActionButton = ({ icon: Icon, label, className, disabled, onClick }) => {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 ${className}`}
    >
      <Icon size={15} />
    </button>
  );
};

ActionButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const DetailCard = ({ icon: Icon, label, value, accentClass }) => {
  return (
    <div className="group/detail flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 transition-all duration-300 hover:border-white/[0.09] hover:bg-white/[0.026]">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover/detail:scale-105 ${accentClass}`}>
        <Icon size={15} />
      </span>

      <div className="min-w-0">
        <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-white/25">{label}</p>

        <div className="mt-1 break-words text-[10px] font-semibold leading-5 text-white/70">{value || "Not provided"}</div>
      </div>
    </div>
  );
};

DetailCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  accentClass: PropTypes.string.isRequired,
};

const SelectControl = ({ icon: Icon, value, onChange, children, ariaLabel }) => {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/25" />

      <select
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        className="h-10 min-w-[155px] appearance-none rounded-xl border border-slate-200/80 bg-white/60 pl-9 pr-9 text-[9px] font-medium text-slate-600 outline-none transition-all focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/45 dark:focus:border-indigo-300/[0.14]"
      >
        {children}
      </select>

      <HiOutlineChevronRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 dark:text-white/25" />
    </div>
  );
};

SelectControl.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
};

const PaginationButton = ({ children, disabled, onClick }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/55 px-3 text-[8px] font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300/35 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/40 dark:hover:border-indigo-300/[0.12] dark:hover:text-indigo-200/65"
    >
      {children}
    </button>
  );
};

PaginationButton.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const TestimonialCustomDialog = ({ isOpen, onClose, maxWidth = "max-w-[560px]", children }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/70 px-3 py-5 backdrop-blur-md sm:px-5">
      <button type="button" aria-label="Close testimonial dialog" className="absolute inset-0 cursor-default" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className={`testimonial-custom-dialog relative z-10 w-full ${maxWidth} overflow-hidden rounded-xl border border-white/[0.06] bg-[#171717] p-2 text-white/70 shadow-[0_24px_80px_rgba(0,0,0,0.62)]`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

TestimonialCustomDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  maxWidth: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const LoadingRows = () => {
  return (
    <div className="space-y-3 p-5">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-200/75 dark:bg-white/[0.035]" />
      ))}
    </div>
  );
};

const EmptyState = ({ activeTab, query, statusFilter }) => {
  const hasFilters = Boolean(query) || statusFilter !== "all";

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-[22px] border border-slate-200/75 bg-slate-50/60 text-slate-400 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/25">
        <HiOutlineInbox size={27} />
      </span>

      <h3 className="mt-4 text-sm font-semibold text-slate-800 dark:text-white/75">No {getTypeLabel(activeTab)} found</h3>

      <p className="mt-2 max-w-md text-[9px] leading-5 text-slate-400 dark:text-white/25">
        {hasFilters ? "No records match your current search or status filter. Change the filters and try again." : `There are currently no ${getTypeLabel(activeTab).toLowerCase()} records available.`}
      </p>
    </div>
  );
};

EmptyState.propTypes = {
  activeTab: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
};

export const TestimonialTable = ({ rowData, confirmDelete, deletingId, isLoading }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("contact");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortOrder, setSortOrder] = useState("newest");

  const [page, setPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);

  const [fetchingId, setFetchingId] = useState("");

  const [viewOpen, setViewOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [replyOpen, setReplyOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
  });

  const [replyForm, setReplyForm] = useState({
    fullname: "",
    to: "",
    content: "",
  });

  const counts = useMemo(() => {
    const feedbackRecords = rowData.filter((item) => item?.type === "feedback");

    const feedbackTotal = feedbackRecords.reduce((sum, item) => sum + (Number(item?.rating) || 0), 0);

    const averageRating = feedbackRecords.length > 0 ? (feedbackTotal / feedbackRecords.length).toFixed(1) : "0.0";

    return {
      total: rowData.length,
      contact: rowData.filter((item) => item?.type === "contact").length,
      feedback: feedbackRecords.length,
      inquiry: rowData.filter((item) => item?.type === "inquiry").length,
      replied: rowData.filter((item) => item?.reply === true).length,
      pending: rowData.filter((item) => item?.reply !== true).length,
      averageRating,
    };
  }, [rowData]);

  const filteredData = useMemo(() => {
    const normalisedQuery = query.trim().toLowerCase();

    const records = rowData
      .filter((item) => item?.type === activeTab)
      .filter((item) => {
        if (statusFilter === "replied") {
          return item?.reply === true;
        }

        if (statusFilter === "pending") {
          return item?.reply !== true;
        }

        return true;
      })
      .filter((item) => {
        if (!normalisedQuery) {
          return true;
        }

        return getSearchableText(item).includes(normalisedQuery);
      });

    return [...records].sort((a, b) => {
      if (sortOrder === "oldest") {
        return new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0);
      }

      if (sortOrder === "name") {
        return getDisplayName(a).localeCompare(getDisplayName(b));
      }

      return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    });
  }, [rowData, activeTab, query, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));

  const paginatedData = useMemo(() => {
    const firstIndex = (page - 1) * ROWS_PER_PAGE;

    return filteredData.slice(firstIndex, firstIndex + ROWS_PER_PAGE);
  }, [filteredData, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, query, statusFilter, sortOrder]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const fetchRecord = async (item) => {
    if (!item?._id) {
      return item;
    }

    try {
      setFetchingId(item._id);

      const payload = await executeThunk(dispatch, getTestimonial(item._id));

      return normaliseTestimonialPayload(payload) || item;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to load testimonial details."));

      return null;
    } finally {
      setFetchingId("");
    }
  };

  const handleViewOpen = async (item) => {
    setSelectedItem(item);

    const record = await fetchRecord(item);

    if (record) {
      setSelectedItem(record);
      setViewOpen(true);
    }
  };

  const handleEditOpen = async (item) => {
    setSelectedItem(item);

    const record = await fetchRecord(item);

    if (record) {
      setSelectedItem(record);

      setFormData({
        content: record?.content || "",
      });

      setEditOpen(true);
    }
  };

  const handleReplyOpen = (item) => {
    setSelectedItem(item);

    setReplyForm({
      fullname: getDisplayName(item),
      to: item?.email || item?.user?.email || "",
      content: "",
    });

    setReplyOpen(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!selectedItem?._id || isUpdating) {
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Testimonial content cannot be empty.");
      return;
    }

    try {
      setIsUpdating(true);

      await executeThunk(
        dispatch,
        updateTestimonial({
          id: selectedItem._id,
          data: formData,
        }),
      );

      toast.success("Testimonial updated successfully.");

      setEditOpen(false);
      dispatch(getAllTestimonial());
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to update testimonial."));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReplySubmit = (event) => {
    event.preventDefault();

    if (!replyForm.to.trim()) {
      toast.error("Recipient email is required.");
      return;
    }

    if (!replyForm.content.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    const subject = encodeURIComponent(`Re: ${getTypeLabel(selectedItem?.type)}`);

    const body = encodeURIComponent(replyForm.content);

    window.location.href = `mailto:${replyForm.to}?subject=${subject}&body=${body}`;

    toast.info("Opening your email application.");

    setReplyOpen(false);
  };

  const openReplyFromView = () => {
    const currentItem = selectedItem;

    setViewOpen(false);

    if (currentItem) {
      handleReplyOpen(currentItem);
    }
  };

  const renderActions = (item) => {
    const recordLoading = fetchingId === item?._id;

    const recordDeleting = deletingId === item?._id;

    const disabled = recordLoading || recordDeleting;

    return (
      <div className="flex min-w-[190px] items-center justify-end gap-1.5">
        <ActionButton
          icon={HiOutlinePencilSquare}
          label="Edit testimonial"
          disabled={disabled}
          onClick={() => handleEditOpen(item)}
          className="border-emerald-300/20 bg-emerald-500/[0.06] text-emerald-700 hover:bg-emerald-500/[0.13] dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/70 dark:hover:bg-emerald-300/[0.07]"
        />

        <ActionButton
          icon={HiOutlineEye}
          label="View testimonial"
          disabled={disabled}
          onClick={() => handleViewOpen(item)}
          className="border-cyan-300/20 bg-cyan-500/[0.06] text-cyan-700 hover:bg-cyan-500/[0.13] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/70 dark:hover:bg-cyan-300/[0.07]"
        />

        <ActionButton
          icon={HiOutlineTrash}
          label="Delete testimonial"
          disabled={disabled}
          onClick={() => confirmDelete(item?._id)}
          className="border-red-300/20 bg-red-500/[0.06] text-red-700 hover:bg-red-500/[0.13] dark:border-red-300/[0.08] dark:bg-red-300/[0.035] dark:text-red-200/70 dark:hover:bg-red-300/[0.07]"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleReplyOpen(item)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.075] px-3 text-[8px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.14] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70 dark:hover:bg-indigo-300/[0.075]"
        >
          <HiOutlinePaperAirplane size={13} />
          Reply
        </button>
      </div>
    );
  };

  const renderDesktopRow = (item, index) => {
    const rowNumber = (page - 1) * ROWS_PER_PAGE + index + 1;

    return (
      <tr key={item?._id || index} className="group/row transition-all duration-300 hover:bg-indigo-500/[0.024] dark:hover:bg-white/[0.018]">
        <td className={TABLE_CELL_CLASS}>
          <IndexBadge value={rowNumber} />
        </td>

        <td className={TABLE_CELL_CLASS}>
          <UserCell item={item} />
        </td>

        {activeTab === "contact" && (
          <>
            <td className={TABLE_CELL_CLASS}>
              {item?.phone ? (
                <IconValue icon={HiOutlinePhone} href={`tel:${item.phone}`} minWidth="min-w-[130px]" accentClass="text-cyan-600 dark:text-cyan-200/55">
                  {item.phone}
                </IconValue>
              ) : (
                <span className="text-[8px] text-slate-400 dark:text-white/25">Not provided</span>
              )}
            </td>

            <td className={TABLE_CELL_CLASS}>
              <IconValue icon={HiOutlineMapPin}>{item?.location || "Not provided"}</IconValue>
            </td>

            <td className={TABLE_CELL_CLASS}>
              <MessagePreview>{item?.content}</MessagePreview>
            </td>
          </>
        )}

        {activeTab === "feedback" && (
          <>
            <td className={TABLE_CELL_CLASS}>
              <MessagePreview fallback="No feedback provided." maxWidth="max-w-[330px]">
                {item?.content}
              </MessagePreview>
            </td>

            <td className={TABLE_CELL_CLASS}>
              <div className="min-w-[125px]">
                <RatingStars value={item?.rating} showValue />
              </div>
            </td>

            <td className={TABLE_CELL_CLASS}>
              <MutedValue>{item?.position}</MutedValue>
            </td>

            <td className={TABLE_CELL_CLASS}>
              <IconValue icon={HiOutlineBuildingOffice2} minWidth="min-w-[150px]" accentClass="text-violet-600 dark:text-violet-200/55">
                {item?.company || "Not provided"}
              </IconValue>
            </td>
          </>
        )}

        {activeTab === "inquiry" && (
          <>
            <td className={TABLE_CELL_CLASS}>
              <MessagePreview fallback="No inquiry details provided.">{item?.content}</MessagePreview>
            </td>

            <td className={TABLE_CELL_CLASS}>
              {item?.projectDoc?.filePath ? (
                <a
                  href={item.projectDoc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-500/[0.06] px-3 py-2 text-[8px] font-semibold text-red-700 transition-all hover:-translate-y-0.5 hover:bg-red-500/[0.13] dark:border-red-300/[0.08] dark:bg-red-300/[0.035] dark:text-red-200/70"
                >
                  <HiOutlineDocumentText size={14} />
                  View file
                </a>
              ) : (
                <span className="text-[8px] text-slate-400 dark:text-white/25">No document</span>
              )}
            </td>

            <td className={TABLE_CELL_CLASS}>
              <span className="inline-flex min-w-[105px] items-center gap-1.5 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.055] px-3 py-2 text-[9px] font-bold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                <HiOutlineCurrencyDollar size={14} />

                {item?.cost || "Not provided"}
              </span>
            </td>

            <td className={TABLE_CELL_CLASS}>
              <IconValue icon={HiOutlineBuildingOffice2} minWidth="min-w-[150px]">
                {item?.company || "Not provided"}
              </IconValue>
            </td>
          </>
        )}

        <td className={TABLE_CELL_CLASS}>
          <IconValue icon={HiOutlineCalendarDays} minWidth="min-w-[135px]" accentClass="text-slate-400 dark:text-white/25">
            {item?.createdAt ? <DateFormatter date={item.createdAt} /> : "Not provided"}
          </IconValue>
        </td>

        <td className={TABLE_ACTION_CELL_CLASS}>{renderActions(item)}</td>
      </tr>
    );
  };

  const renderMobileCard = (item, index) => {
    const rowNumber = (page - 1) * ROWS_PER_PAGE + index + 1;

    return (
      <article key={item?._id || index} className="rounded-[22px] border border-slate-200/75 bg-white/50 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] dark:border-white/[0.055] dark:bg-white/[0.014]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar item={item} sizeClass="size-11" />

            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold capitalize text-slate-800 dark:text-white/70">{getDisplayName(item)}</p>

              <p className="mt-1 truncate text-[8px] text-slate-400 dark:text-white/25">{getDisplayEmail(item)}</p>
            </div>
          </div>

          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/75 bg-slate-50/65 text-[8px] font-bold text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.016] dark:text-white/30">
            {rowNumber}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] ${getTypeBadgeClass(item?.type)}`}>{getTypeLabel(item?.type)}</span>

          <StatusBadge replied={item?.reply === true} compact />
        </div>

        {item?.type === "feedback" && (
          <div className="mt-3 rounded-xl border border-amber-300/20 bg-amber-500/[0.045] p-3 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.025]">
            <RatingStars value={item?.rating} showValue />
          </div>
        )}

        {item?.type === "inquiry" && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-emerald-300/20 bg-emerald-500/[0.045] p-3 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.025]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-emerald-700 dark:text-emerald-200/50">Budget</p>

              <p className="mt-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-200/65">{item?.cost || "Not provided"}</p>
            </div>

            <div className="rounded-xl border border-indigo-300/20 bg-indigo-500/[0.045] p-3 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.025]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-indigo-700 dark:text-indigo-200/50">Company</p>

              <p className="mt-1 truncate text-[9px] font-bold capitalize text-indigo-700 dark:text-indigo-200/65">{item?.company || "Not provided"}</p>
            </div>
          </div>
        )}

        <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-white/[0.05] dark:bg-white/[0.012]">
          <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Message</p>

          <p className="mt-1.5 line-clamp-3 text-[9px] leading-5 text-slate-600 dark:text-white/40">{item?.content || "No message provided."}</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-white/[0.05]">
          <span className="inline-flex items-center gap-2 text-[8px] text-slate-400 dark:text-white/25">
            <HiOutlineCalendarDays />

            {item?.createdAt ? <DateFormatter date={item.createdAt} /> : "Not provided"}
          </span>

          {renderActions(item)}
        </div>
      </article>
    );
  };

  const projectUrl = safeExternalUrl(selectedItem?.link);

  const documentUrl = safeExternalUrl(selectedItem?.projectDoc?.filePath);

  const firstVisibleRecord = filteredData.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;

  const lastVisibleRecord = Math.min(page * ROWS_PER_PAGE, filteredData.length);

  return (
    <>
      <style>{TESTIMONIAL_UI_STYLES}</style>

      {/* Edit dialog */}
      <TestimonialCustomDialog isOpen={editOpen} onClose={() => setEditOpen(false)} maxWidth="max-w-[560px]">
        <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 text-white/70">
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-emerald-500/[0.07] blur-2xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-300/[0.08] bg-emerald-300/[0.025] text-emerald-200/70">
              <HiOutlinePencilSquare size={17} />
            </span>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-emerald-200/45">Edit submission</p>

              <h2 className="mt-1 text-sm font-semibold text-white/85">Update Content</h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close edit dialog"
            onClick={() => setEditOpen(false)}
            className="relative flex size-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.014] text-white/25 transition-all duration-300 hover:border-red-300/[0.08] hover:bg-red-300/[0.025] hover:text-red-200/65"
          >
            <HiOutlineXMark size={17} />
          </button>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="testimonial-popup-scroll max-h-[70vh] overflow-y-auto bg-transparent px-1 py-3 text-white/70">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
              <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-indigo-500/[0.06] blur-2xl" />
              <Avatar item={selectedItem} sizeClass="size-11" />

              <div className="relative min-w-0 flex-1">
                <p className="truncate text-[11px] font-bold capitalize text-white/85">{getDisplayName(selectedItem)}</p>

                <p className="mt-1 truncate text-[8px] text-white/25">{getDisplayEmail(selectedItem)}</p>
              </div>

              <span className={`rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] ${getPopupTypeBadgeClass(selectedItem?.type)}`}>
                {getTypeLabel(selectedItem?.type)}
              </span>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="testimonial-content" className="text-[9px] font-semibold text-white/55">
                  Testimonial message
                </label>

                <span className="text-[8px] tabular-nums text-white/25">{formData.content.length} characters</span>
              </div>

              <textarea
                id="testimonial-content"
                name="content"
                value={formData.content}
                onChange={(event) =>
                  setFormData({
                    content: event.target.value,
                  })
                }
                rows={9}
                disabled={isUpdating}
                placeholder="Update the testimonial content..."
                className="testimonial-popup-scroll min-h-52 w-full resize-y rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3 text-[10px] leading-6 text-white/65 outline-none transition-all placeholder:text-white/20 focus:border-emerald-300/[0.12] focus:ring-4 focus:ring-emerald-300/[0.025] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <div className="flex items-center justify-end gap-2 bg-transparent px-1 pb-0 pt-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setEditOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent px-3 text-[10px] font-semibold text-white/35 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-500/[0.05] px-3 text-[10px] font-semibold text-emerald-200/70 transition-all duration-300 hover:border-emerald-300/[0.12] hover:bg-emerald-300/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiOutlineCheckBadge size={14} />

              {isUpdating ? "Updating..." : "Update Content"}
            </button>
          </div>
        </form>
      </TestimonialCustomDialog>

      {/* View dialog */}
      <TestimonialCustomDialog isOpen={viewOpen} onClose={() => setViewOpen(false)} maxWidth="max-w-[760px]">
        <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 text-white/70">
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-indigo-500/[0.07] blur-2xl" />

          <div className="relative flex min-w-0 items-center gap-3">
            <Avatar item={selectedItem} sizeClass="size-12" />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-sm font-semibold capitalize text-white/85">{getDisplayName(selectedItem)}</h2>

                <span className={`rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.08em] ${getPopupTypeBadgeClass(selectedItem?.type)}`}>
                  {getTypeLabel(selectedItem?.type)}
                </span>
              </div>

              <p className="mt-1 truncate text-[8px] text-white/25">{getDisplayEmail(selectedItem)}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close details"
            onClick={() => setViewOpen(false)}
            className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.014] text-white/25 transition-all duration-300 hover:border-red-300/[0.08] hover:bg-red-300/[0.025] hover:text-red-200/65"
          >
            <HiOutlineXMark size={17} />
          </button>
        </div>

        <div className="testimonial-popup-scroll max-h-[72vh] overflow-y-auto bg-transparent px-1 py-3 text-white/70">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
            <PopupStatusBadge replied={selectedItem?.reply === true} />

            <span className="inline-flex items-center gap-2 text-[8px] text-white/40">
              <HiOutlineCalendarDays />

              {selectedItem?.createdAt ? <DateFormatter date={selectedItem.createdAt} /> : "Submission date unavailable"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <DetailCard icon={HiOutlineUser} label="Full name" value={getDisplayName(selectedItem)} accentClass="border-indigo-300/[0.10] bg-indigo-300/[0.04] text-indigo-200/70" />

            <DetailCard icon={HiOutlineEnvelope} label="Email address" value={getDisplayEmail(selectedItem)} accentClass="border-cyan-300/[0.10] bg-cyan-300/[0.04] text-cyan-200/70" />

            <DetailCard icon={HiOutlineMapPin} label="Location" value={selectedItem?.location} accentClass="border-violet-300/[0.10] bg-violet-300/[0.04] text-violet-200/70" />

            <DetailCard icon={HiOutlinePhone} label="Phone number" value={selectedItem?.phone} accentClass="border-blue-300/[0.10] bg-blue-300/[0.04] text-blue-200/70" />

            {(selectedItem?.type === "feedback" || selectedItem?.type === "inquiry") && (
              <>
                <DetailCard icon={HiOutlineBuildingOffice2} label="Company" value={selectedItem?.company} accentClass="border-amber-300/[0.10] bg-amber-300/[0.04] text-amber-200/70" />

                <DetailCard icon={HiOutlineBriefcase} label="Designation" value={selectedItem?.position} accentClass="border-emerald-300/[0.10] bg-emerald-300/[0.04] text-emerald-200/70" />
              </>
            )}
          </div>

          {selectedItem?.type === "feedback" && (
            <div className="mt-3 flex flex-col gap-4 rounded-[22px] border border-[#302D22] bg-[#15140F] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-amber-200/50">Client rating</p>

                <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-amber-200/80">
                  {selectedItem?.rating || 0}
                  /5
                </p>
              </div>

              <RatingStars value={selectedItem?.rating} size={19} />
            </div>
          )}

          {selectedItem?.type === "inquiry" && (
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <DetailCard icon={HiOutlineCurrencyDollar} label="Project budget" value={selectedItem?.cost} accentClass="border-emerald-300/[0.10] bg-emerald-300/[0.04] text-emerald-200/70" />

              {projectUrl && (
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between gap-3 rounded-2xl border border-[#242C36] bg-[#10161E] p-3.5 text-indigo-200/70 transition-all hover:-translate-y-0.5 hover:border-indigo-300/[0.14] hover:bg-[#121922]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-indigo-300/[0.10] bg-indigo-300/[0.04] transition-transform group-hover/link:scale-105">
                      <HiOutlineArrowTopRightOnSquare size={15} />
                    </span>

                    <div>
                      <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-indigo-200/45">Project website</p>

                      <p className="mt-1 text-[9px] font-semibold">Visit website</p>
                    </div>
                  </div>
                </a>
              )}

              {documentUrl && (
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between gap-3 rounded-2xl border border-[#242C36] bg-[#10161E] p-3.5 text-red-200/70 transition-all hover:-translate-y-0.5 hover:border-red-300/[0.14] hover:bg-[#121922]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl border border-red-300/[0.10] bg-red-300/[0.04] transition-transform group-hover/link:scale-105">
                      <HiOutlineDocumentText size={15} />
                    </span>

                    <div>
                      <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-red-200/45">Project document</p>

                      <p className="mt-1 text-[9px] font-semibold">Open document</p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          )}

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2">
              <HiOutlineChatBubbleBottomCenterText className="text-cyan-200/60" />

              <p className="text-[9px] font-semibold text-white/55">Submitted message</p>
            </div>

            <div className="min-h-40 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-white/[0.018] p-4 text-[10px] leading-6 text-white/55">
              {selectedItem?.content || "No message was provided."}
            </div>
          </div>
        </div>

        <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="flex items-center justify-end gap-2 bg-transparent px-1 pb-0 pt-2">
          <button
            type="button"
            onClick={() => setViewOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent px-3 text-[10px] font-semibold text-white/35 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/70"
          >
            Close
          </button>

          <button
            type="button"
            onClick={openReplyFromView}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.05] px-3 text-[10px] font-semibold text-indigo-200/70 transition-all duration-300 hover:border-indigo-300/[0.12] hover:bg-indigo-300/[0.05]"
          >
            <HiOutlinePaperAirplane size={14} />
            Reply
          </button>
        </div>
      </TestimonialCustomDialog>

      {/* Reply dialog */}
      <TestimonialCustomDialog isOpen={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="max-w-[590px]">
        <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] p-3 text-white/70">
          <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-indigo-500/[0.07] blur-2xl" />

          <div className="relative flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-indigo-300/[0.08] bg-indigo-300/[0.025] text-indigo-200/70">
              <HiOutlinePaperAirplane size={17} />
            </span>

            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-indigo-200/45">Compose response</p>

              <h2 className="mt-1 text-sm font-semibold text-white/85">Reply Message</h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close reply dialog"
            onClick={() => setReplyOpen(false)}
            className="relative flex size-8 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.014] text-white/25 transition-all duration-300 hover:border-red-300/[0.08] hover:bg-red-300/[0.025] hover:text-red-200/65"
          >
            <HiOutlineXMark size={17} />
          </button>
        </div>

        <form onSubmit={handleReplySubmit}>
          <div className="testimonial-popup-scroll max-h-[70vh] overflow-y-auto bg-transparent px-1 py-3 text-white/70">
            <div className="relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.018] p-3">
              <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-indigo-500/[0.06] blur-2xl" />
              <Avatar item={selectedItem} sizeClass="size-11" />

              <div className="relative min-w-0">
                <p className="truncate text-[11px] font-bold capitalize text-white/85">{replyForm.fullname || "Recipient"}</p>

                <p className="mt-1 truncate text-[8px] text-white/25">{replyForm.to || "Email not provided"}</p>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="reply-email" className="mb-2 block text-[9px] font-semibold text-white/55">
                Recipient email
              </label>

              <div className="relative">
                <HiOutlineEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/60" />

                <input
                  id="reply-email"
                  type="email"
                  value={replyForm.to}
                  onChange={(event) =>
                    setReplyForm((previousData) => ({
                      ...previousData,
                      to: event.target.value,
                    }))
                  }
                  placeholder="recipient@example.com"
                  className="h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.018] pl-10 pr-4 text-[10px] text-white/65 outline-none transition-all placeholder:text-white/20 focus:border-cyan-300/[0.12] focus:ring-4 focus:ring-cyan-300/[0.025]"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="reply-content" className="text-[9px] font-semibold text-white/55">
                  Reply message
                </label>

                <span className="text-[8px] tabular-nums text-white/25">{replyForm.content.length} characters</span>
              </div>

              <textarea
                id="reply-content"
                value={replyForm.content}
                onChange={(event) =>
                  setReplyForm((previousData) => ({
                    ...previousData,
                    content: event.target.value,
                  }))
                }
                rows={9}
                placeholder="Write your response here..."
                className="testimonial-popup-scroll min-h-52 w-full resize-y rounded-xl border border-white/[0.06] bg-white/[0.018] px-4 py-3 text-[10px] leading-6 text-white/65 outline-none transition-all placeholder:text-white/20 focus:border-indigo-300/[0.12] focus:ring-4 focus:ring-indigo-300/[0.025]"
              />
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-xl border border-cyan-300/20 bg-cyan-500/[0.045] px-3 py-2.5 text-[8px] leading-4 text-cyan-200/70">
              <HiOutlineSparkles className="mt-0.5 shrink-0" />
              This will open your default email application with the recipient, subject and message already completed.
            </div>
          </div>

          <div className="mx-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <div className="flex items-center justify-end gap-2 bg-transparent px-1 pb-0 pt-2">
            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent px-3 text-[10px] font-semibold text-white/35 transition-all duration-300 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/70"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.05] px-3 text-[10px] font-semibold text-indigo-200/70 transition-all duration-300 hover:border-indigo-300/[0.12] hover:bg-indigo-300/[0.05]"
            >
              <HiOutlinePaperAirplane size={14} />
              Open Email
            </button>
          </div>
        </form>
      </TestimonialCustomDialog>

      <section className="space-y-3 pb-8">
        {/* Overview */}
        <Wrapper className="overflow-hidden p-0">
          <div className="relative overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/35 p-5 dark:border-white/[0.045] dark:bg-white/[0.012] sm:p-6">
            <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-indigo-500/[0.028] blur-[110px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-cyan-500/[0.019] blur-[110px]" />

            <div className="relative z-10 flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.075] text-indigo-700 shadow-[0_14px_32px_rgba(79,70,229,0.10)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                  <HiOutlineInbox size={24} />
                </span>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1.5 text-[7px] font-semibold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/60">
                    <HiOutlineSparkles size={12} />
                    Communication centre
                  </div>

                  <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white/90 sm:text-3xl">Testimonials & Inquiries</h1>

                  <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-white/35">
                    Review contact messages, manage client feedback and respond to project inquiries from one organised workspace.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:min-w-[650px]">
                <SummaryCard
                  icon={HiOutlineInbox}
                  label="Total submissions"
                  value={counts.total}
                  description="All communication records"
                  accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
                />

                <SummaryCard
                  icon={HiOutlineClock}
                  label="Awaiting reply"
                  value={counts.pending}
                  description="Require your attention"
                  accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65"
                />

                <SummaryCard
                  icon={HiOutlineCheckCircle}
                  label="Replied"
                  value={counts.replied}
                  description="Responses completed"
                  accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65"
                />

                <SummaryCard
                  icon={FaStar}
                  label="Average rating"
                  value={counts.averageRating}
                  description={`${counts.feedback} client reviews`}
                  accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.035] dark:text-amber-200/65"
                />
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Management workspace */}
        <Wrapper className="overflow-visible p-0">
          <div className="relative overflow-visible rounded-[inherit] border border-slate-200/70 bg-slate-50/30 dark:border-white/[0.045] dark:bg-white/[0.01]">
            <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.016] blur-[100px]" />

            <div className="relative z-10">
              {/* Header and controls */}
              <header className="border-b border-slate-200/70 p-4 dark:border-white/[0.05] sm:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                      <HiOutlineAdjustmentsHorizontal size={17} />
                    </span>

                    <div>
                      <h2 className="text-sm font-semibold tracking-[-0.02em] text-slate-900 dark:text-white/80">Communication Management</h2>

                      <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">Search, filter, review and respond to portfolio submissions.</p>
                    </div>
                  </div>

                  <NavLink to="/create-testimonial">
                    <TertiaryButton type="button">
                      <span className="inline-flex items-center gap-2">
                        <HiOutlinePlus size={14} />
                        Create Testimonial
                      </span>
                    </TertiaryButton>
                  </NavLink>
                </div>

                {/* Tabs */}
                <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3">
                  {TAB_CONFIG.map((tab) => {
                    const TabIcon = tab.icon;

                    const active = activeTab === tab.value;

                    return (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => setActiveTab(tab.value)}
                        className={`group/tab relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                          active
                            ? tab.activeClass
                            : "border-slate-200/70 bg-white/45 text-slate-500 hover:-translate-y-0.5 hover:border-indigo-300/30 hover:bg-indigo-500/[0.025] dark:border-white/[0.05] dark:bg-white/[0.012] dark:text-white/35 dark:hover:border-indigo-300/[0.1] dark:hover:bg-indigo-300/[0.02]"
                        }`}
                      >
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${tab.iconClass}`}>
                          <TabIcon size={16} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[10px] font-bold">{tab.label}</p>

                            <span className="rounded-full border border-slate-200/50 bg-white/40 px-2 py-0.5 text-[8px] font-semibold tabular-nums dark:border-white/[0.06] dark:bg-white/[0.025]">
                              {counts[tab.value]}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-[8px] opacity-60">{tab.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Search and filter row */}
                <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:items-center">
                  <div className="relative min-w-0 flex-1">
                    <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/25" />

                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search sender, email, company, phone or message..."
                      className="h-10 w-full rounded-xl border border-slate-200/80 bg-white/60 pl-10 pr-10 text-[9px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/60 dark:placeholder:text-white/20"
                    />

                    {query && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-white/25 dark:hover:bg-white/[0.04] dark:hover:text-white/55"
                      >
                        <HiOutlineXMark size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <SelectControl icon={HiOutlineFunnel} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} ariaLabel="Filter by reply status">
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectControl>

                    <SelectControl icon={HiOutlineArrowsUpDown} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} ariaLabel="Sort testimonials">
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectControl>
                  </div>
                </div>
              </header>

              {/* Content */}
              {isLoading && rowData.length === 0 ? (
                <LoadingRows />
              ) : filteredData.length > 0 ? (
                <>
                  {/* Desktop table */}
                  <div className="testimonial-table-scroll relative hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[1190px] border-separate border-spacing-0 text-left">
                      <thead>
                        <tr>
                          {TABLE_COLUMNS[activeTab].map((column) => (
                            <th key={column} className={TABLE_HEAD_CELL_CLASS}>
                              {column}
                            </th>
                          ))}

                          <th className={TABLE_ACTION_HEAD_CELL_CLASS}>Actions</th>
                        </tr>
                      </thead>

                      <tbody>{paginatedData.map(renderDesktopRow)}</tbody>
                    </table>
                  </div>

                  {/* Mobile and tablet cards */}
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:hidden">{paginatedData.map(renderMobileCard)}</div>
                </>
              ) : (
                <EmptyState activeTab={activeTab} query={query} statusFilter={statusFilter} />
              )}

              {/* Pagination */}
              <footer className="flex flex-col gap-3 border-t border-slate-200/70 px-4 py-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <p className="text-[9px] font-semibold text-slate-600 dark:text-white/45">
                    Showing {firstVisibleRecord}-{lastVisibleRecord} of {filteredData.length}
                  </p>

                  <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">{getTypeLabel(activeTab)} records</p>
                </div>

                <div className="flex items-center gap-2">
                  <PaginationButton disabled={page === 1} onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}>
                    <HiOutlineChevronLeft size={14} />
                    Previous
                  </PaginationButton>

                  <span className="inline-flex h-9 min-w-[82px] items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/[0.055] px-3 text-[8px] font-bold tabular-nums text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/65">
                    {page} / {totalPages}
                  </span>

                  <PaginationButton disabled={page === totalPages} onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}>
                    Next
                    <HiOutlineChevronRight size={14} />
                  </PaginationButton>
                </div>
              </footer>
            </div>
          </div>
        </Wrapper>
      </section>
    </>
  );
};

TestimonialTable.propTypes = {
  rowData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["contact", "feedback", "inquiry"]).isRequired,
      name: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      location: PropTypes.string,
      content: PropTypes.string,
      rating: PropTypes.number,
      position: PropTypes.string,
      company: PropTypes.string,
      cost: PropTypes.string,
      link: PropTypes.string,
      reply: PropTypes.bool,
      createdAt: PropTypes.string,
      user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.shape({
            url: PropTypes.string,
            filePath: PropTypes.string,
            publicId: PropTypes.string,
          }),
        ]),
      }),
      projectDoc: PropTypes.shape({
        filePath: PropTypes.string,
      }),
      avatar: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          url: PropTypes.string,
          filePath: PropTypes.string,
          publicId: PropTypes.string,
        }),
      ]),
    }),
  ),
  confirmDelete: PropTypes.func.isRequired,
  deletingId: PropTypes.string,
  isLoading: PropTypes.bool,
};

TestimonialTable.defaultProps = {
  rowData: [],
  deletingId: "",
  isLoading: false,
};

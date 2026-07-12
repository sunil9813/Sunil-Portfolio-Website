import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FaStar } from "react-icons/fa";
import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlineInformationCircle,
  HiOutlineMapPin,
  HiOutlinePaperAirplane,
  HiOutlinePhoto,
  HiOutlinePhone,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineXMark,
} from "react-icons/hi2";

import { createTestimonial, getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";
import { GhostButton, HeadingTwo, Input, InputLabel, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  fullname: "",
  position: "",
  company: "",
  location: "",
  content: "",
  email: "",
  phone: "",
  rating: "",
  link: "",
  cost: "",
  type: "",
};

const TYPE_CONFIG = {
  contact: {
    label: "Contact",
    description: "Send a general message or communication.",
    icon: HiOutlineEnvelope,
    accentClass: "border-cyan-300/25 bg-cyan-500/[0.08] text-cyan-700 dark:border-cyan-300/[0.1] dark:bg-cyan-300/[0.045] dark:text-cyan-200/75",
    activeClass: "border-cyan-300/40 bg-cyan-500/[0.075] shadow-[0_14px_32px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.16] dark:bg-cyan-300/[0.045]",
  },
  feedback: {
    label: "Feedback",
    description: "Share a review, rating and professional details.",
    icon: FaStar,
    accentClass: "border-amber-300/25 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.1] dark:bg-amber-300/[0.045] dark:text-amber-200/75",
    activeClass: "border-amber-300/40 bg-amber-500/[0.075] shadow-[0_14px_32px_rgba(245,158,11,0.08)] dark:border-amber-300/[0.16] dark:bg-amber-300/[0.045]",
  },
  inquiry: {
    label: "Project Inquiry",
    description: "Submit project requirements, budget and documents.",
    icon: HiOutlineBriefcase,
    accentClass: "border-indigo-300/25 bg-indigo-500/[0.08] text-indigo-700 dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.045] dark:text-indigo-200/75",
    activeClass: "border-indigo-300/40 bg-indigo-500/[0.075] shadow-[0_14px_32px_rgba(99,102,241,0.08)] dark:border-indigo-300/[0.16] dark:bg-indigo-300/[0.045]",
  },
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #10b981, #06b6d4)",
  "linear-gradient(135deg, #f59e0b, #f97316)",
];

const executeThunk = async (dispatch, action) => {
  const request = dispatch(action);

  if (typeof request?.unwrap === "function") {
    return request.unwrap();
  }

  const result = await request;

  if (result?.meta?.requestStatus === "rejected" || result?.error) {
    throw result?.payload || result?.error;
  }

  return result?.payload ?? result;
};

const getErrorMessage = (error, fallback = "An error occurred while submitting.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const formatFileSize = (size = 0) => {
  if (!size) {
    return "0 MB";
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const isValidWebsite = (value) => {
  try {
    const formattedValue = value.startsWith("https://") || value.startsWith("http://") ? value : `https://${value}`;

    const parsedUrl = new URL(formattedValue);

    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

const getInitials = (value = "") => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "T";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

const getAvatarGradient = (value = "") => {
  const total = value.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return AVATAR_GRADIENTS[total % AVATAR_GRADIENTS.length];
};

const SectionHeader = ({ icon: Icon, eyebrow, title, description, accentClass, trailing }) => {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${accentClass}`}>
          <Icon size={19} />
        </span>

        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">{eyebrow}</p>

          <h2 className="mt-1 text-sm font-black tracking-[-0.02em] text-slate-900 dark:text-white/85">{title}</h2>

          <p className="mt-1 max-w-xl text-[9px] leading-4 text-slate-400 dark:text-white/25">{description}</p>
        </div>
      </div>

      {trailing}
    </div>
  );
};

SectionHeader.propTypes = {
  icon: PropTypes.elementType.isRequired,
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
  trailing: PropTypes.node,
};

const FormField = ({ icon: Icon, label, accentClass, children }) => {
  return (
    <div className="min-w-0">
      <InputLabel className="mb-2">{label}</InputLabel>

      <div className="relative">
        {children}

        <span className={`pointer-events-none absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border 3xl:size-10 ${accentClass}`}>
          <Icon size={15} />
        </span>
      </div>
    </div>
  );
};

FormField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const PurposeCard = ({ value, selected, onSelect }) => {
  const config = TYPE_CONFIG[value];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
        selected
          ? config.activeClass
          : "border-slate-200/75 bg-white/45 hover:border-indigo-300/30 hover:bg-indigo-500/[0.025] dark:border-white/[0.05] dark:bg-white/[0.012] dark:hover:border-indigo-300/[0.1] dark:hover:bg-indigo-300/[0.02]"
      }`}
    >
      {selected && <span className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-current" />}

      <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-105 ${config.accentClass}`}>
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold text-slate-800 dark:text-white/65">{config.label}</p>

          <span
            className={`flex size-5 items-center justify-center rounded-full border ${
              selected
                ? "border-emerald-300/30 bg-emerald-500/[0.08] text-emerald-600 dark:border-emerald-300/[0.1] dark:text-emerald-200/70"
                : "border-slate-200/80 bg-white/45 text-transparent dark:border-white/[0.06] dark:bg-white/[0.016]"
            }`}
          >
            <HiOutlineCheckBadge size={13} />
          </span>
        </div>

        <p className="mt-1 text-[8px] leading-4 text-slate-400 dark:text-white/25">{config.description}</p>
      </div>
    </button>
  );
};

PurposeCard.propTypes = {
  value: PropTypes.oneOf(["contact", "feedback", "inquiry"]).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const UploadZone = ({ inputRef, title, description, accept, file, preview, type, disabled, onChange, onDrop, onRemove }) => {
  const isImage = type === "image";

  const openFilePicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={openFilePicker}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        className="group/upload relative flex min-h-60 w-full flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-slate-300/75 bg-slate-50/40 text-center outline-none transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.025] focus:ring-4 focus:ring-indigo-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.08] dark:bg-white/[0.012] dark:hover:border-indigo-300/[0.14] dark:hover:bg-indigo-300/[0.02]"
      >
        {file ? (
          isImage ? (
            <>
              <img src={preview} alt="Avatar preview" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/upload:scale-[1.025]" />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-white/90">{file.name}</p>

                  <p className="mt-1 text-[8px] text-white/55">{formatFileSize(file.size)}</p>
                </div>

                <span className="rounded-lg border border-white/[0.14] bg-black/30 px-2.5 py-1.5 text-[8px] font-medium text-white/75 backdrop-blur-lg">Replace</span>
              </div>
            </>
          ) : (
            <div className="flex max-w-xs flex-col items-center px-5">
              <span className="flex size-16 items-center justify-center rounded-[22px] border border-red-300/20 bg-red-500/[0.07] text-red-600 shadow-[0_12px_30px_rgba(239,68,68,0.08)] dark:border-red-300/[0.08] dark:bg-red-300/[0.035] dark:text-red-200/70">
                <HiOutlineDocumentText size={28} />
              </span>

              <p className="mt-4 max-w-[250px] truncate text-[10px] font-semibold text-slate-700 dark:text-white/55">{file.name}</p>

              <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">PDF · {formatFileSize(file.size)}</p>

              <span className="mt-4 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.06] px-3 py-2 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                Click to replace
              </span>
            </div>
          )
        ) : (
          <div className="flex max-w-[280px] flex-col items-center px-5">
            <span
              className={`flex size-16 items-center justify-center rounded-[22px] border shadow-[0_12px_30px_rgba(79,70,229,0.08)] transition-transform duration-300 group-hover/upload:-translate-y-1 ${
                isImage
                  ? "border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-600 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                  : "border-red-300/20 bg-red-500/[0.07] text-red-600 dark:border-red-300/[0.09] dark:bg-red-300/[0.04] dark:text-red-200/70"
              }`}
            >
              {isImage ? <HiOutlinePhoto size={27} /> : <HiOutlineDocumentArrowUp size={27} />}
            </span>

            <p className="mt-4 text-[10px] font-semibold text-slate-600 dark:text-white/50">{title}</p>

            <p className="mt-1.5 text-[8px] leading-4 text-slate-400 dark:text-white/25">{description}</p>

            <span className="mt-4 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.06] px-3 py-2 text-[8px] font-semibold text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
              Browse file
            </span>
          </div>
        )}

        {file && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRemove();
            }}
            className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-xl border border-red-300/20 bg-red-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-red-500"
            title="Remove file"
            aria-label="Remove selected file"
          >
            <HiOutlineXMark size={16} />
          </button>
        )}
      </button>

      <input ref={inputRef} type="file" accept={accept} className="hidden" disabled={disabled} onChange={onChange} />
    </div>
  );
};

UploadZone.propTypes = {
  inputRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLElement),
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  file: PropTypes.instanceOf(File),
  preview: PropTypes.string,
  type: PropTypes.oneOf(["image", "document"]).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const RatingSelector = ({ value, onChange, disabled }) => {
  const currentRating = Number(value) || 0;

  return (
    <div className="rounded-[22px] border border-amber-300/20 bg-amber-500/[0.04] p-4 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.025]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-200/50">Client rating</p>

          <p className="mt-1 text-[9px] text-slate-500 dark:text-white/30">Select a rating between one and five stars.</p>
        </div>

        <span className="text-2xl font-black tracking-[-0.04em] text-amber-600 dark:text-amber-200/75">{currentRating || "—"}/5</span>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(String(star))}
            className={`flex size-11 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 ${
              star <= currentRating
                ? "border-amber-300/35 bg-amber-500/[0.11] text-amber-400 shadow-[0_8px_20px_rgba(245,158,11,0.10)] dark:border-amber-300/[0.13] dark:bg-amber-300/[0.06]"
                : "border-slate-200/75 bg-white/50 text-slate-200 hover:border-amber-300/30 hover:text-amber-300 dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/[0.12]"
            }`}
            aria-label={`Rate ${star} out of 5`}
          >
            <FaStar size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};

RatingSelector.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

const LivePreview = ({ testimonial, avatarPreview }) => {
  const { fullname, email, company, position, content, rating, cost, type } = testimonial;

  const selectedType = TYPE_CONFIG[type] || TYPE_CONFIG.contact;

  const TypeIcon = selectedType.icon;

  return (
    <div className="overflow-hidden rounded-[26px] border border-slate-200/75 bg-slate-50/40 dark:border-white/[0.055] dark:bg-white/[0.012]">
      <div className="relative overflow-hidden border-b border-slate-200/70 p-5 dark:border-white/[0.05]">
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.05] blur-[80px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-cyan-500/[0.035] blur-[80px]" />

        <div className="relative z-10 flex items-start gap-3">
          {avatarPreview ? (
            <div className="size-12 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-100 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
              <img src={avatarPreview} alt="Testimonial avatar preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-[12px] font-black uppercase text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
              style={{
                background: getAvatarGradient(fullname),
              }}
            >
              {getInitials(fullname)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[12px] font-bold capitalize text-slate-900 dark:text-white/75">{fullname.trim() || "Your full name"}</h3>

              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[7px] font-semibold ${selectedType.accentClass}`}>
                <TypeIcon size={11} />
                {selectedType.label}
              </span>
            </div>

            <p className="mt-1 truncate text-[8px] text-slate-400 dark:text-white/25">{email.trim() || "your.email@example.com"}</p>

            {(company || position) && <p className="mt-1 truncate text-[8px] capitalize text-slate-500 dark:text-white/30">{[position, company].filter(Boolean).join(" · ")}</p>}
          </div>
        </div>
      </div>

      <div className="p-5">
        {type === "feedback" && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-300/20 bg-amber-500/[0.045] p-3 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.025]">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} size={12} className={star <= (Number(rating) || 0) ? "text-amber-400" : "text-slate-200 dark:text-white/[0.1]"} />
              ))}
            </div>

            <span className="text-[8px] font-bold text-amber-700 dark:text-amber-200/65">{rating || 0}/5</span>
          </div>
        )}

        {type === "inquiry" && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-300/20 bg-emerald-500/[0.045] p-3 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.025]">
            <span className="text-[7px] font-semibold uppercase tracking-[0.09em] text-emerald-700 dark:text-emerald-200/50">Project budget</span>

            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-200/65">{cost.trim() || "Not specified"}</span>
          </div>
        )}

        <p className="line-clamp-5 min-h-[80px] whitespace-pre-wrap text-[9px] leading-5 text-slate-500 dark:text-white/35">
          {content.trim() || "Your submitted message will appear here as you complete the form."}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-white/[0.05]">
          <span className="inline-flex items-center gap-2 text-[8px] text-slate-400 dark:text-white/25">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live preview
          </span>

          <HiOutlineSparkles className="text-indigo-500 dark:text-indigo-200/60" />
        </div>
      </div>
    </div>
  );
};

LivePreview.propTypes = {
  testimonial: PropTypes.shape({
    fullname: PropTypes.string,
    email: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    content: PropTypes.string,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cost: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  avatarPreview: PropTypes.string,
};

export const CreateTestimonial = () => {
  const avatarInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [testimonial, setTestimonial] = useState(initialState);

  const [avatar, setAvatar] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState("");

  const [resourceFile, setResourceFile] = useState(null);

  const [resourcePreview, setResourcePreview] = useState("");

  const [resourceFileError, setResourceFileError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fullname, position, company, location, content, email, phone, rating, link, cost, type } = testimonial;

  const isProfessionalType = type === "feedback" || type === "inquiry";

  useEffect(() => {
    return () => {
      revokeObjectUrl(avatarPreview);
      revokeObjectUrl(resourcePreview);
    };
  }, [avatarPreview, resourcePreview]);

  const completion = useMemo(() => {
    const commonValues = [type, fullname, email, phone, location, content];

    const requiredValues = [...commonValues];

    if (type === "feedback") {
      requiredValues.push(position, company, link, rating);
    }

    if (type === "inquiry") {
      requiredValues.push(position, company, link, cost, resourceFile);
    }

    const completedValues = requiredValues.filter((value) => {
      if (value instanceof File) {
        return true;
      }

      return Boolean(String(value || "").trim());
    }).length;

    return {
      completed: completedValues,
      total: requiredValues.length,
      percentage: requiredValues.length > 0 ? Math.round((completedValues / requiredValues.length) * 100) : 0,
    };
  }, [type, fullname, email, phone, location, content, position, company, link, rating, cost, resourceFile]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setTestimonial((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const removeAvatar = useCallback(() => {
    revokeObjectUrl(avatarPreview);

    setAvatar(null);
    setAvatarPreview("");
  }, [avatarPreview]);

  const removeResource = useCallback(() => {
    revokeObjectUrl(resourcePreview);

    setResourceFile(null);
    setResourcePreview("");
    setResourceFileError("");
  }, [resourcePreview]);

  const handleTypeChange = (selectedType) => {
    setTestimonial((previousData) => {
      const updatedData = {
        ...previousData,
        type: selectedType,
      };

      if (selectedType === "contact") {
        updatedData.position = "";
        updatedData.company = "";
        updatedData.rating = "";
        updatedData.link = "";
        updatedData.cost = "";

        removeAvatar();
        removeResource();
      }

      if (selectedType === "feedback") {
        updatedData.cost = "";
        removeResource();
      }

      if (selectedType === "inquiry") {
        updatedData.rating = "";
      }

      return updatedData;
    });
  };

  const processAvatar = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      toast.error("Avatar must be a PNG, JPEG, or JPG image.");
      return;
    }

    if (selectedFile.size > MAX_AVATAR_SIZE) {
      toast.error("Avatar file size exceeds the 2MB limit.");
      return;
    }

    setAvatarPreview((currentPreview) => {
      revokeObjectUrl(currentPreview);

      return URL.createObjectURL(selectedFile);
    });

    setAvatar(selectedFile);
  }, []);

  const processResourceFile = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      const message = "Project document must be a PDF.";

      toast.error(message);
      setResourceFileError(message);
      return;
    }

    if (selectedFile.size > MAX_DOCUMENT_SIZE) {
      const message = "Project document exceeds the 5MB limit.";

      toast.error(message);
      setResourceFileError(message);
      return;
    }

    setResourcePreview((currentPreview) => {
      revokeObjectUrl(currentPreview);

      return URL.createObjectURL(selectedFile);
    });

    setResourceFile(selectedFile);
    setResourceFileError("");
  }, []);

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files?.[0];

    processAvatar(selectedFile);
    event.target.value = "";
  };

  const handleResourceFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    processResourceFile(selectedFile);
    event.target.value = "";
  };

  const handleDropAvatar = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      processAvatar(event.dataTransfer.files?.[0]);
    },
    [isSubmitting, processAvatar],
  );

  const handleDropResource = useCallback(
    (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      processResourceFile(event.dataTransfer.files?.[0]);
    },
    [isSubmitting, processResourceFile],
  );

  const validateForm = () => {
    if (!type) {
      toast.error("Please select a purpose of message.");
      return false;
    }

    const requiredFields = {
      "Full name": fullname,
      Email: email,
      Phone: phone,
      Address: location,
      Message: content,
    };

    for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
      if (!fieldValue.trim()) {
        toast.error(`${fieldName} is required.`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (isProfessionalType) {
      if (!position.trim()) {
        toast.error("Designation is required.");
        return false;
      }

      if (!company.trim()) {
        toast.error("Company name is required.");
        return false;
      }

      if (!link.trim()) {
        toast.error("Website URL is required.");
        return false;
      }

      if (!isValidWebsite(link.trim())) {
        toast.error("Please enter a valid website URL.");
        return false;
      }
    }

    if (type === "feedback") {
      const numericRating = Number(rating);

      if (!numericRating || numericRating < 1 || numericRating > 5) {
        toast.error("Please select a rating between 1 and 5.");
        return false;
      }
    }

    if (type === "inquiry") {
      if (!cost.trim()) {
        toast.error("Project budget is required.");
        return false;
      }

      if (!resourceFile) {
        toast.error("Project document is required.");
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    revokeObjectUrl(avatarPreview);
    revokeObjectUrl(resourcePreview);

    setTestimonial(initialState);
    setAvatar(null);
    setAvatarPreview("");
    setResourceFile(null);
    setResourcePreview("");
    setResourceFileError("");
  };

  const handleCreate = async () => {
    if (isSubmitting || !validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      const fields = {
        fullname,
        position,
        company,
        content,
        email,
        location,
        phone,
        rating,
        link,
        cost,
        type,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const trimmedValue = String(value || "").trim();

        if (trimmedValue) {
          formData.append(key, trimmedValue);
        }
      });

      if (avatar && isProfessionalType) {
        formData.append("avatar", avatar);
      }

      if (resourceFile && type === "inquiry") {
        formData.append("projectDoc", resourceFile);
      }

      const result = await executeThunk(dispatch, createTestimonial(formData));

      toast.success(result?.message || "Testimonial submitted successfully.");

      dispatch(getAllTestimonial());

      resetForm();
      navigate("/testimonial");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    revokeObjectUrl(avatarPreview);
    revokeObjectUrl(resourcePreview);

    navigate("/testimonial");
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>Create Testimonial</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-slate-400 dark:text-white/25 sm:block">Add a contact message, client feedback or project inquiry.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isSubmitting} onClick={handleCancel}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isSubmitting} onClick={handleCreate}>
            <span className="inline-flex items-center gap-2">
              <HiOutlinePaperAirplane size={14} />

              {isSubmitting ? "Submitting..." : "Submit"}
            </span>
          </TertiaryButton>
        </div>
      </StickyHeader>

      <section className="space-y-3 pb-8">
        {/* Compact overview */}
        <Wrapper className="overflow-hidden p-0">
          <div className="relative overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/35 p-5 dark:border-white/[0.045] dark:bg-white/[0.012] sm:p-6">
            <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.025] blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.018] blur-[100px]" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.075] text-indigo-700 shadow-[0_14px_32px_rgba(79,70,229,0.10)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                  <HiOutlineChatBubbleBottomCenterText size={24} />
                </span>

                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Communication studio</p>

                  <h1 className="mt-1 text-2xl font-black tracking-[-0.035em] text-slate-950 dark:text-white/90 sm:text-3xl">Create a New Submission</h1>

                  <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-white/35">
                    Enter contact information, professional details and the appropriate message information for your selected submission type.
                  </p>
                </div>
              </div>

              <div className="min-w-[280px] rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.045] p-4 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.028]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-indigo-700 dark:text-indigo-200/50">Form completion</p>

                    <p className="mt-1 text-[10px] font-semibold text-slate-700 dark:text-white/55">
                      {completion.completed} of {completion.total} required fields
                    </p>
                  </div>

                  <span className="text-lg font-black tabular-nums text-indigo-700 dark:text-indigo-200/70">{completion.percentage}%</span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 transition-[width] duration-500"
                    style={{
                      width: `${completion.percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Wrapper>

        {/* Purpose selection */}
        <Wrapper className="overflow-hidden p-0">
          <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-5">
            <SectionHeader
              icon={HiOutlineIdentification}
              eyebrow="Submission type"
              title="Purpose of Message"
              description="Choose the type of submission before completing the remaining fields."
              accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
              trailing={
                type && (
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                    <HiOutlineCheckBadge size={13} />
                    Type selected
                  </span>
                )
              }
            />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              {Object.keys(TYPE_CONFIG).map((value) => (
                <PurposeCard key={value} value={value} selected={type === value} onSelect={handleTypeChange} />
              ))}
            </div>
          </div>
        </Wrapper>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.38fr)_minmax(330px,0.72fr)]">
          <main className="min-w-0 space-y-3">
            {/* Contact information */}
            <Wrapper className="overflow-hidden p-0">
              <div className="relative rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-cyan-500/[0.016] blur-[90px]" />

                <div className="relative z-10">
                  <SectionHeader
                    icon={HiOutlineUser}
                    eyebrow="Personal details"
                    title="Contact Information"
                    description="Provide accurate personal and communication details."
                    accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      icon={HiOutlineUser}
                      label="Full Name"
                      accentClass="border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65"
                    >
                      <Input type="text" name="fullname" className="pl-12" value={fullname} handleChange={handleInputChange} placeholder="John Doe" disabled={isSubmitting} />
                    </FormField>

                    <FormField
                      icon={HiOutlineEnvelope}
                      label="Email Address"
                      accentClass="border-cyan-300/20 bg-cyan-500/[0.08] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65"
                    >
                      <Input type="email" name="email" className="pl-12" value={email} handleChange={handleInputChange} placeholder="example@gmail.com" disabled={isSubmitting} />
                    </FormField>

                    <FormField
                      icon={HiOutlinePhone}
                      label="Phone Number"
                      accentClass="border-blue-300/20 bg-blue-500/[0.08] text-blue-700 dark:border-blue-300/[0.08] dark:bg-blue-300/[0.04] dark:text-blue-200/65"
                    >
                      <Input type="tel" name="phone" className="pl-12" value={phone} handleChange={handleInputChange} placeholder="+61 400 000 000" disabled={isSubmitting} />
                    </FormField>

                    <FormField
                      icon={HiOutlineMapPin}
                      label="Location"
                      accentClass="border-violet-300/20 bg-violet-500/[0.08] text-violet-700 dark:border-violet-300/[0.08] dark:bg-violet-300/[0.04] dark:text-violet-200/65"
                    >
                      <Input type="text" name="location" className="pl-12" value={location} handleChange={handleInputChange} placeholder="Sydney, Australia" disabled={isSubmitting} />
                    </FormField>

                    {isProfessionalType && (
                      <div className="md:col-span-2">
                        <FormField
                          icon={HiOutlineGlobeAlt}
                          label="Website URL"
                          accentClass="border-indigo-300/20 bg-indigo-500/[0.08] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.04] dark:text-indigo-200/65"
                        >
                          <Input type="url" name="link" className="pl-12" value={link} handleChange={handleInputChange} placeholder="https://www.example.com" disabled={isSubmitting} />
                        </FormField>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Wrapper>

            {/* Professional details */}
            {isProfessionalType && (
              <Wrapper className="overflow-hidden p-0">
                <div className="relative rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
                  <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[90px]" />

                  <div className="relative z-10">
                    <SectionHeader
                      icon={HiOutlineBuildingOffice2}
                      eyebrow="Professional profile"
                      title="Company Information"
                      description="Add the organisation and professional role connected to this submission."
                      accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        icon={HiOutlineBuildingOffice2}
                        label="Company Name"
                        accentClass="border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.04] dark:text-amber-200/65"
                      >
                        <Input type="text" name="company" className="pl-12" value={company} handleChange={handleInputChange} placeholder="Google, Apple, Microsoft" disabled={isSubmitting} />
                      </FormField>

                      <FormField
                        icon={HiOutlineBriefcase}
                        label="Designation"
                        accentClass="border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65"
                      >
                        <Input type="text" name="position" className="pl-12" value={position} handleChange={handleInputChange} placeholder="Manager" disabled={isSubmitting} />
                      </FormField>
                    </div>
                  </div>
                </div>
              </Wrapper>
            )}

            {/* Message */}
            <Wrapper className="overflow-visible p-0">
              <div className="relative overflow-visible rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
                <SectionHeader
                  icon={HiOutlineChatBubbleBottomCenterText}
                  eyebrow="Submission content"
                  title="Message"
                  description="Write a clear and detailed message for this submission."
                  accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70"
                  trailing={
                    <span className="rounded-full border border-slate-200/70 bg-slate-50/55 px-3 py-1.5 text-[8px] font-semibold tabular-nums text-slate-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                      {content.length} characters
                    </span>
                  }
                />

                <textarea
                  name="content"
                  value={content}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  rows={10}
                  placeholder="Write your message here..."
                  className="min-h-56 w-full resize-y rounded-[22px] border border-slate-200/80 bg-slate-50/50 px-4 py-4 text-[10px] leading-6 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-white/[0.016] dark:text-white/60 dark:placeholder:text-white/20 dark:focus:border-indigo-300/[0.14]"
                />

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.035] px-3 py-2.5 text-[8px] leading-4 text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.022] dark:text-indigo-200/55">
                  <HiOutlineInformationCircle className="mt-0.5 shrink-0" />
                  Include relevant background information, expectations and any important project or feedback details.
                </div>
              </div>
            </Wrapper>
          </main>

          <aside className="min-w-0 space-y-3">
            {/* Live preview */}
            <Wrapper className="overflow-hidden p-0">
              <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-200/50">Live preview</p>

                    <h2 className="mt-1 text-[12px] font-black text-slate-900 dark:text-white/75">Submission Card</h2>
                  </div>

                  <span className="flex size-9 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                    <HiOutlineSparkles size={16} />
                  </span>
                </div>

                <LivePreview testimonial={testimonial} avatarPreview={avatarPreview} />
              </div>
            </Wrapper>

            {/* Avatar */}
            {isProfessionalType && (
              <Wrapper className="overflow-hidden p-0">
                <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008]">
                  <SectionHeader
                    icon={HiOutlinePhoto}
                    eyebrow="Profile media"
                    title="Avatar Image"
                    description="Optional profile image in PNG or JPG format, maximum 2MB."
                    accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                  />

                  <UploadZone
                    inputRef={avatarInputRef}
                    title="Drop avatar image here"
                    description="PNG, JPG or JPEG · Maximum 2MB"
                    accept="image/png,image/jpeg,image/jpg"
                    file={avatar}
                    preview={avatarPreview}
                    type="image"
                    disabled={isSubmitting}
                    onChange={handleAvatarChange}
                    onDrop={handleDropAvatar}
                    onRemove={removeAvatar}
                  />
                </div>
              </Wrapper>
            )}

            {/* Feedback rating */}
            {type === "feedback" && (
              <Wrapper className="overflow-hidden p-0">
                <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008]">
                  <SectionHeader
                    icon={FaStar}
                    eyebrow="Client experience"
                    title="Feedback Rating"
                    description="Select the rating associated with this testimonial."
                    accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70"
                  />

                  <RatingSelector
                    value={rating}
                    disabled={isSubmitting}
                    onChange={(value) =>
                      setTestimonial((previousData) => ({
                        ...previousData,
                        rating: value,
                      }))
                    }
                  />
                </div>
              </Wrapper>
            )}

            {/* Inquiry budget */}
            {type === "inquiry" && (
              <Wrapper className="overflow-hidden p-0">
                <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008]">
                  <SectionHeader
                    icon={HiOutlineCurrencyDollar}
                    eyebrow="Project estimate"
                    title="Project Budget"
                    description="Enter the proposed or estimated project budget."
                    accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
                  />

                  <FormField
                    icon={HiOutlineCurrencyDollar}
                    label="Budget"
                    accentClass="border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65"
                  >
                    <Input type="text" name="cost" className="pl-12" value={cost} handleChange={handleInputChange} placeholder="e.g. $5,000 – $10,000" disabled={isSubmitting} />
                  </FormField>
                </div>
              </Wrapper>
            )}

            {/* Inquiry PDF */}
            {type === "inquiry" && (
              <Wrapper className="overflow-hidden p-0">
                <div className="rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-4 dark:border-white/[0.045] dark:bg-white/[0.008]">
                  <SectionHeader
                    icon={HiOutlineDocumentArrowUp}
                    eyebrow="Project documentation"
                    title="Project Document"
                    description="Upload the project brief or requirements as a PDF, maximum 5MB."
                    accentClass="border-red-300/20 bg-red-500/[0.07] text-red-700 dark:border-red-300/[0.09] dark:bg-red-300/[0.04] dark:text-red-200/70"
                  />

                  <UploadZone
                    inputRef={resourceInputRef}
                    title="Drop project PDF here"
                    description="PDF document · Maximum 5MB"
                    accept="application/pdf"
                    file={resourceFile}
                    preview={resourcePreview}
                    type="document"
                    disabled={isSubmitting}
                    onChange={handleResourceFileChange}
                    onDrop={handleDropResource}
                    onRemove={removeResource}
                  />

                  {resourceFileError && <p className="mt-2 text-[8px] font-medium text-red-600 dark:text-red-200/65">{resourceFileError}</p>}
                </div>
              </Wrapper>
            )}
          </aside>
        </div>
      </section>
    </>
  );
};

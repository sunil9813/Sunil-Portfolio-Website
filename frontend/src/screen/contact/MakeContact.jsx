import { TertiaryButton } from "@/components/customeUI/Button";
import { Input } from "@/components/customeUI/Input";
import { InputLabel, InputTitle } from "@/components/customeUI/Title";
import { CommentEditor } from "@/components/comment/CommentEditor";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { createTestimonial, getAllTestimonial } from "@/redux/slices/portfolio/testimonialSlice";

import { useCallback, useEffect, useRef, useState } from "react";

import { BiPhoneCall, BiWorld } from "react-icons/bi";
import { BsEmojiExpressionless, BsEmojiFrown, BsEmojiHeartEyes, BsEmojiSmile, BsEmojiTear, BsFillBuildingsFill } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { FaFolder } from "react-icons/fa";
import { IoCameraSharp, IoMailUnread } from "react-icons/io5";
import { MdClose, MdLocationPin } from "react-icons/md";
import { PiHandbagFill } from "react-icons/pi";
import { TbCurrencyDollar } from "react-icons/tb";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const inputClassName =
  "w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-50/10 focus:border-gray-200 dark:focus:border-gray-50/40 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

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
  type: "feedback",
};

const purposeOptions = [
  { value: "contact", label: "General Contact" },
  { value: "inquiry", label: "Project Inquiry" },
  { value: "feedback", label: "Share Feedback" },
];

const ratingOptions = [
  { value: "1", label: "Poor", icon: BsEmojiTear },
  { value: "2", label: "Fair", icon: BsEmojiFrown },
  { value: "3", label: "Okay", icon: BsEmojiExpressionless },
  { value: "4", label: "Good", icon: BsEmojiSmile },
  { value: "5", label: "Great", icon: BsEmojiHeartEyes },
];

const hasEditorValue = (value = "") => {
  const cleanText = String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return cleanText.length > 0 || /<(img|video|iframe|figure)\b/i.test(String(value));
};

const isImageValid = (file) => {
  const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];

  return allowedFormats.includes(file.type);
};

const isResourceFileValid = (file) => {
  return file.type === "application/pdf";
};

/* ========================================================== */
/* MAKE CONTACT                                               */
/* ========================================================== */

export const MakeContact = () => {
  const avatarInputRef = useRef(null);
  const resourceInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [testimonial, setTestimonial] = useState(initialState);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);
  const [resourcePreview, setResourcePreview] = useState(null);
  const [resourceFileError, setResourceFileError] = useState("");

  const { fullname, position, company, location, content, email, phone, rating, link, cost, type } = testimonial;

  /* ======================================================== */
  /* INPUT CHANGE                                             */
  /* ======================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setTestimonial({
      ...testimonial,
      [name]: value,
    });
  };

  /* ======================================================== */
  /* CLEAN PREVIEW URLS                                       */
  /* ======================================================== */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      if (resourcePreview) {
        URL.revokeObjectURL(resourcePreview);
      }
    };
  }, [avatarPreview, resourcePreview]);

  /* ======================================================== */
  /* AVATAR                                                   */
  /* ======================================================== */

  const handleAvatarChange = useCallback((e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (!isImageValid(selectedFile)) {
        toast.error("Avatar must be a PNG, JPEG, or JPG image.");

        return;
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Avatar file size exceeds 2MB limit.");

        return;
      }

      setAvatar(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  /* ======================================================== */
  /* RESOURCE FILE                                            */
  /* ======================================================== */

  const handleResourceFileChange = useCallback((e) => {
    const file = e.target.files[0];

    if (file) {
      if (!isResourceFileValid(file)) {
        toast.error("Resource file must be a PDF.");

        setResourceFileError("Resource file must be a PDF.");

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resource file size exceeds 5MB limit.");

        setResourceFileError("Resource file size exceeds 5MB limit.");

        return;
      }

      setResourceFile(file);
      setResourcePreview(URL.createObjectURL(file));
      setResourceFileError("");
    }
  }, []);

  /* ======================================================== */
  /* DRAG / DROP                                              */
  /* ======================================================== */

  const handleDropAvatar = useCallback(
    (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files[0];

      if (file) {
        handleAvatarChange({
          target: {
            files: [file],
          },
        });
      }
    },
    [handleAvatarChange],
  );

  const handleDropResource = useCallback(
    (event) => {
      event.preventDefault();

      const file = event.dataTransfer.files[0];

      if (file) {
        handleResourceFileChange({
          target: {
            files: [file],
          },
        });
      }
    },
    [handleResourceFileChange],
  );

  /* ======================================================== */
  /* CREATE                                                   */
  /* ======================================================== */

  const handleCreate = async () => {
    if (!type) {
      toast.error("Please select a purpose of message (type).");

      return;
    }

    const commonFields = {
      fullname,
      email,
      phone,
      location,
    };

    for (const [key, value] of Object.entries(commonFields)) {
      if (!value.trim()) {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required.`);

        return;
      }
    }

    if (!hasEditorValue(content)) {
      toast.error("Content is required.");

      return;
    }

    /* ====================================================== */
    /* FEEDBACK                                               */
    /* ====================================================== */

    if (type === "feedback") {
      if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        toast.error("Rating is required for feedback and must be between 1 and 5.");

        return;
      }

      if (!position.trim()) {
        toast.error("Designation is required for feedback.");

        return;
      }

      if (!company.trim()) {
        toast.error("Company name is required for feedback.");

        return;
      }

      if (!link.trim()) {
        toast.error("Website URL is required for feedback.");

        return;
      }

      if (cost.trim()) {
        toast.error("Cost is not allowed for feedback.");

        return;
      }

      if (resourceFile) {
        toast.error("Project document is not allowed for feedback.");

        return;
      }
    } else if (type === "inquiry") {
      /* ====================================================== */
      /* INQUIRY                                                */
      /* ====================================================== */
      if (!position.trim()) {
        toast.error("Designation is required for inquiry.");

        return;
      }

      if (!company.trim()) {
        toast.error("Company name is required for inquiry.");

        return;
      }

      if (!link.trim()) {
        toast.error("Website URL is required for inquiry.");

        return;
      }

      if (!cost.trim()) {
        toast.error("Budget is required for inquiry.");

        return;
      }

      if (!resourceFile) {
        toast.error("Project document is required for inquiry.");

        return;
      }

      if (rating.trim()) {
        toast.error("Rating is not allowed for inquiry.");

        return;
      }
    } else if (type === "contact") {
      /* ====================================================== */
      /* CONTACT                                                */
      /* ====================================================== */
      if (avatar) {
        toast.error("Avatar is not allowed for contact.");

        return;
      }

      if (resourceFile) {
        toast.error("Project document is not allowed for contact.");

        return;
      }

      if (rating.trim() || position.trim() || company.trim() || link.trim() || cost.trim()) {
        toast.error("Rating, designation, company, website URL, and budget are not allowed for contact.");

        return;
      }
    }

    /* ====================================================== */
    /* SEND FORM                                              */
    /* ====================================================== */

    try {
      const formData = new FormData();

      if (fullname.trim()) {
        formData.append("fullname", fullname);
      }

      if (position.trim()) {
        formData.append("position", position);
      }

      if (company.trim()) {
        formData.append("company", company);
      }

      if (hasEditorValue(content)) {
        formData.append("content", content);
      }

      if (email.trim()) {
        formData.append("email", email);
      }

      if (location.trim()) {
        formData.append("location", location);
      }

      if (phone.trim()) {
        formData.append("phone", phone);
      }

      if (rating.trim()) {
        formData.append("rating", rating);
      }

      if (link.trim()) {
        formData.append("link", link);
      }

      if (cost.trim()) {
        formData.append("cost", cost);
      }

      if (type.trim()) {
        formData.append("type", type);
      }

      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (resourceFile) {
        formData.append("projectDoc", resourceFile);
      }

      const resultAction = await dispatch(createTestimonial(formData));

      if (createTestimonial.fulfilled.match(resultAction)) {
        await dispatch(getAllTestimonial());

        setTestimonial(initialState);
        setAvatar(null);
        setAvatarPreview(null);
        setResourceFile(null);
        setResourcePreview(null);

        navigate("/contact");
      } else {
        toast.error(resultAction.payload?.error);
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while submitting.");
    }
  };

  /* ======================================================== */
  /* UI                                                       */
  /* ======================================================== */

  return (
    <div className="contact-form p-5">
      {/* ambient background */}

      {/* ==================================================== */}
      {/* PURPOSE                                              */}
      {/* ==================================================== */}

      <div className="relative z-10 mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/60 shadow-[0_0_8px_rgba(103,232,249,0.25)]" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-cyan-200/35">Start here</span>
          </div>

          <InputTitle className="!mb-1 !text-[14px] !font-semibold !text-white/90">Purpose of Message</InputTitle>

          <p className="max-w-[440px] text-[10px] leading-5 text-white/28">Choose the option that best matches what you&apos;d like to discuss.</p>
        </div>

        <StepBadge step="01" />
      </div>

      <CustomDropdown
        value={type}
        onChange={(selectedType) => {
          setTestimonial((currentValue) => ({
            ...currentValue,
            type: selectedType,
          }));
        }}
        options={purposeOptions}
        align="left"
        className="w-full"
        buttonClassName="!h-12 !rounded-[16px] !border !border-gray-100 !bg-gray-900/5 !px-4 !text-[12px] !font-medium !text-white/65 !shadow-none dark:!border-gray-800/50 dark:!bg-gray-50/5 hover:!border-white/[0.10] hover:!bg-gray-50/5 focus:!border-cyan-300/20"
        menuClassName="!min-w-full"
      />

      {/* ==================================================== */}
      {/* MAIN CONTENT                                         */}
      {/* ==================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[1.28fr_0.82fr]">
        {/* ================================================== */}
        {/* LEFT                                               */}
        {/* ================================================== */}

        <div className="relative border-white/[0.045] p-5 sm:p-6 lg:border-r lg:p-7">
          {/* Contact Details */}

          <FormSection>
            <SectionHeading title="Contact details" description="Tell me how I can reach you." step="02" />

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <ContactField
                label="Full Name"
                icon={<CiUser size={16} />}
                input={<Input type="text" name="fullname" value={fullname} handleChange={handleInputChange} placeholder="John Doe" className="!pl-12" />}
              />

              <ContactField
                label="Email"
                icon={<IoMailUnread size={16} />}
                input={<Input type="email" name="email" value={email} handleChange={handleInputChange} placeholder="example@gmail.com" className="!pl-12" />}
              />

              <ContactField
                label="Address"
                icon={<MdLocationPin size={16} />}
                input={<Input type="text" name="location" value={location} handleChange={handleInputChange} placeholder="Sydney, Australia" className="!pl-12" />}
              />

              <ContactField
                label="Phone"
                icon={<BiPhoneCall size={16} />}
                input={<Input type="text" name="phone" value={phone} handleChange={handleInputChange} placeholder="+61 ..." className="!pl-12" />}
              />
            </div>
          </FormSection>

          {/* Professional */}

          {(type === "feedback" || type === "inquiry") && (
            <FormSection separated>
              <SectionHeading title="Professional details" description="A little context about you or your company." step="03" />

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <ContactField
                  label="Company Name"
                  icon={<BsFillBuildingsFill size={15} />}
                  input={<Input type="text" name="company" value={company} handleChange={handleInputChange} placeholder="Google, Apple..." className="!pl-12" />}
                />

                <ContactField
                  label="Designation"
                  icon={<PiHandbagFill size={15} />}
                  input={<Input type="text" name="position" value={position} handleChange={handleInputChange} placeholder="Manager" className="!pl-12" />}
                />

                <div className="md:col-span-2">
                  <ContactField
                    label="Website URL"
                    icon={<BiWorld size={16} />}
                    input={<Input type="text" name="link" value={link} handleChange={handleInputChange} placeholder="www.example.com" className="!pl-12" />}
                  />
                </div>
              </div>
            </FormSection>
          )}

          {/* Feedback */}

          {type === "feedback" && (
            <FormSection separated>
              <SectionHeading title="Feedback" description="How would you rate your experience?" step="04" />

              <RatingPicker
                value={rating}
                onChange={(selectedRating) => {
                  setTestimonial((currentValue) => ({
                    ...currentValue,
                    rating: selectedRating,
                  }));
                }}
              />
            </FormSection>
          )}

          {/* Inquiry */}

          {type === "inquiry" && (
            <FormSection separated>
              <SectionHeading title="Project details" description="Give me a quick idea of the project scope." step="04" />

              <div className="mt-5">
                <ContactField
                  label="Project Budget"
                  icon={<TbCurrencyDollar size={16} />}
                  input={<Input type="text" name="cost" value={cost} handleChange={handleInputChange} placeholder="e.g. 5000 AUD" className="!pl-12" />}
                />
              </div>
            </FormSection>
          )}
        </div>

        {/* ================================================== */}
        {/* RIGHT                                              */}
        {/* ================================================== */}

        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute -right-16 top-20 h-52 w-52 rounded-full bg-cyan-300/[0.018] blur-[80px]" />

          <div className="relative z-10">
            <SectionHeading title="Message" description="Share the details that matter most." step={type === "contact" ? "03" : "05"} />

            <CommentEditor
              value={content}
              onChange={(value) => {
                setTestimonial((currentValue) => ({
                  ...currentValue,
                  content: value,
                }));
              }}
              type="default"
              placeholder="Write your message here..."
              className={`mt-5 !overflow-hidden !rounded-[20px] !border-gray-100 !bg-gray-900/5 !shadow-none dark:!border-gray-800/50 dark:!bg-gray-50/5 dark:focus-within:!border-cyan-300/20 [&_.ProseMirror]:!text-white/70 [&_.ProseMirror]:focus:!outline-none [&_.comment-editor-content]:!bg-gray-900/5 dark:[&_.comment-editor-content]:!bg-gray-50/5 [&_.comment-editor-content]:!rounded-b-[20px] [&_.comment-editor-toolbar]:!rounded-t-[20px] [&_.comment-editor-toolbar]:!border-gray-100 [&_.comment-editor-toolbar]:!bg-gray-900/5 dark:[&_.comment-editor-toolbar]:!border-gray-800/50 dark:[&_.comment-editor-toolbar]:!bg-gray-50/5 ${
                type === "contact" ? "[&_.ProseMirror]:min-h-[185px]" : "[&_.ProseMirror]:min-h-[145px]"
              }`}
            />

            {/* Avatar */}

            {(type === "feedback" || type === "inquiry") && (
              <FormSection separated>
                <SectionHeading title="Avatar image" description="Optional profile image for this submission." />

                <UploadBox
                  preview={avatarPreview}
                  inputRef={avatarInputRef}
                  onDrop={handleDropAvatar}
                  onChange={handleAvatarChange}
                  onRemove={() => {
                    setAvatar(null);
                    setAvatarPreview(null);
                  }}
                  accept="image/png,image/jpeg,image/jpg"
                  type="image"
                />
              </FormSection>
            )}

            {/* Project Brief */}

            {type === "inquiry" && (
              <FormSection separated>
                <SectionHeading title="Project brief" description="Upload your project PDF, up to 5MB." />

                <UploadBox
                  preview={resourcePreview}
                  inputRef={resourceInputRef}
                  onDrop={handleDropResource}
                  onChange={handleResourceFileChange}
                  onRemove={() => {
                    setResourceFile(null);
                    setResourcePreview(null);
                    setResourceFileError("");
                  }}
                  fileName={resourceFile?.name}
                  fileSize={resourceFile?.size}
                  accept="application/pdf"
                  type="pdf"
                />

                {resourceFileError && <p className="mt-2 text-[10px] font-medium text-red-400/80">{resourceFileError}</p>}
              </FormSection>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FOOTER                                               */}
      {/* ==================================================== */}

      <div className="relative flex flex-col gap-4 border-t border-white/[0.045] bg-white/[0.008] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-300/[0.07] bg-emerald-300/[0.035]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.35)]" />
          </div>

          <div>
            <p className="text-[10px] font-medium text-white/40">Ready when you are.</p>

            <p className="mt-1 text-[9px] leading-4 text-white/18">Your details are only used to respond to your message.</p>
          </div>
        </div>

        <TertiaryButton onClick={handleCreate}>Send message</TertiaryButton>
      </div>
    </div>
  );
};

/* ========================================================== */
/* FORM SECTION                                               */
/* ========================================================== */

const FormSection = ({ children, separated = false }) => {
  return <div className={separated ? "mt-7 border-t border-white/[0.045] pt-7" : ""}>{children}</div>;
};

/* ========================================================== */
/* SECTION HEADING                                            */
/* ========================================================== */

const SectionHeading = ({ title, description, step }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <div>
          <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-white/88">{title}</h3>

          {description && <p className="mt-1 text-[10px] leading-5 text-white/25">{description}</p>}
        </div>
      </div>

      {step && <StepBadge step={step} />}
    </div>
  );
};

/* ========================================================== */
/* STEP BADGE                                                 */
/* ========================================================== */

const StepBadge = ({ step }) => {
  return (
    <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/[0.055] bg-white/[0.018] px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-[0.14em] text-white/22 sm:inline-flex">
      <span className="h-1 w-1 rounded-full bg-cyan-300/35" />
      Step {step}
    </span>
  );
};

/* ========================================================== */
/* CONTACT FIELD                                              */
/* ========================================================== */

const ContactField = ({ label, icon, input }) => {
  return (
    <div className="group/field w-full">
      <InputLabel className="!mb-2 !text-[9px] !font-medium !text-white/32">{label}</InputLabel>

      <div className="relative">
        {input}

        <div className="pointer-events-none absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/[0.07] bg-cyan-300/[0.035] text-cyan-200/48 transition-all duration-300 group-focus-within/field:border-cyan-300/[0.14] group-focus-within/field:bg-cyan-300/[0.065] group-focus-within/field:text-cyan-100/75">
          {icon}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent transition-all duration-300 group-focus-within/field:w-[70%]" />
      </div>
    </div>
  );
};

/* ========================================================== */
/* RATING PICKER                                              */
/* ========================================================== */

const RatingPicker = ({ value, onChange }) => {
  return (
    <div className="mt-5">
      <InputLabel className="!mb-2 !text-[9px] !font-medium !text-white/32">Rating</InputLabel>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {ratingOptions.map((option) => {
          const Icon = option.icon;
          const active = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group/rating flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-[16px] border px-2 text-center transition-all duration-300 ${
                active
                  ? "border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-100 shadow-[0_14px_34px_rgba(103,232,249,0.08)]"
                  : "border-gray-100 bg-gray-900/5 text-white/34 hover:border-white/[0.10] hover:bg-gray-50/5 hover:text-white/65 dark:border-gray-800/50 dark:bg-gray-50/5"
              }`}
              aria-pressed={active}
            >
              <Icon size={18} className={`shrink-0 transition-all duration-300 ${active ? "text-cyan-100" : "text-cyan-200/42 group-hover/rating:text-cyan-100/70"}`} />
              <span className="truncate text-[8px] font-semibold uppercase tracking-[0.08em]">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ========================================================== */
/* UPLOAD BOX                                                 */
/* ========================================================== */

const UploadBox = ({ preview, inputRef, onDrop, onChange, onRemove, fileName, fileSize, accept, type }) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="group/upload relative mt-5 flex min-h-[190px] cursor-pointer items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-gray-100 bg-gray-900/5 p-4 transition-all duration-300 hover:border-cyan-300/[0.18] hover:bg-cyan-300/[0.025] dark:border-gray-800/50 dark:bg-gray-50/5"
    >
      {/* glow */}

      <div className="pointer-events-none absolute left-1/2 top-[-80px] h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-300/[0.025] blur-[60px] transition-all duration-300 group-hover/upload:bg-cyan-300/[0.05]" />

      {/* corners */}

      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-white/[0.06]" />

      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-white/[0.06]" />

      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/[0.06]" />

      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/[0.06]" />

      {preview ? (
        type === "image" ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.12em] text-white/60 backdrop-blur-xl">Image selected</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/60 backdrop-blur-xl transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/80 hover:text-white"
            >
              <MdClose size={14} />
            </button>
          </>
        ) : (
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-cyan-300/[0.08] bg-cyan-300/[0.035] text-cyan-200/45">
              <FaFolder size={24} />
            </div>

            <p className="mt-4 max-w-[240px] truncate text-[11px] font-medium text-white/55">{fileName}</p>

            {fileSize && <p className="mt-1 text-[9px] text-white/20">{(fileSize / (1024 * 1024)).toFixed(2)} MB</p>}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="mt-4 rounded-full border border-red-400/[0.08] bg-red-400/[0.025] px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.1em] text-red-300/55 transition hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
            >
              Remove file
            </button>
          </div>
        )
      ) : (
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/[0.06] bg-white/[0.02] text-white/25 transition-all duration-300 group-hover/upload:border-cyan-300/[0.10] group-hover/upload:bg-cyan-300/[0.04] group-hover/upload:text-cyan-200/60">
            {type === "image" ? <IoCameraSharp size={24} /> : <FaFolder size={23} />}
          </div>

          <p className="mt-4 text-[11px] text-white/32">
            Drag &amp; drop or <span className="font-medium text-white/62">click to browse</span>
          </p>

          <p className="mt-1.5 text-[9px] text-white/18">{type === "image" ? "PNG, JPG or JPEG · max 2MB" : "PDF only · max 5MB"}</p>
        </div>
      )}

      <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={onChange} />
    </div>
  );
};

import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { BiWorld } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FiFileText, FiPlus, FiUploadCloud } from "react-icons/fi";
import { HiLink, HiOutlineCheckCircle, HiOutlineIdentification, HiOutlineSparkles } from "react-icons/hi2";
import { IoCameraSharp, IoLanguageOutline } from "react-icons/io5";
import { MdClose, MdEmail, MdLocationPin } from "react-icons/md";
import { PiHandbagFill } from "react-icons/pi";
import { LuNotepadTextDashed } from "react-icons/lu";

import { getIntro, updateIntro } from "@/redux/slices/portfolio/introSlice";
import { GhostButton, HeadingTwo, Input, InputLabel, InputTitle, StickyHeader, TertiaryButton, Wrapper } from "@/routes";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const MAX_CV_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

const initialState = {
  fullname: "",
  bio: "",
  description: "",
  position: "",
  country: "",
  address: "",
  emails: [],
  phones: [],
  languages: [],
  socialslinks: [],
};

const revokeObjectUrl = (url) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const formatFileSize = (size = 0) => {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.message || error?.error || error?.data?.message || fallback;
};

const SectionHeading = ({ icon: Icon, title, description, badge, accentClass }) => {
  return (
    <div className="mb-5 flex flex-col gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl border ${accentClass}`}>
          <Icon size={18} />
        </span>

        <div>
          <InputTitle className="mb-1">{title}</InputTitle>

          <p className="text-[9px] leading-4 text-gray-400 dark:text-white/25">{description}</p>
        </div>
      </div>

      {badge && (
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/60 px-3 py-1.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/30">
          <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300/70" />
          {badge}
        </span>
      )}
    </div>
  );
};

SectionHeading.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  badge: PropTypes.string,
  accentClass: PropTypes.string.isRequired,
};

const InlineDynamicGroup = ({ title, entries, field, itemKey, type, placeholder, icon: Icon, accentClass, emptyText, addLabel, disabled, onAdd, onChange, onRemove }) => {
  return (
    <div className="rounded-[22px] border border-gray-200/70 bg-gray-50/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.014]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <InputLabel>{title}</InputLabel>

        <span className="rounded-full border border-gray-200/70 bg-white/60 px-2 py-0.5 text-[8px] font-medium tabular-nums text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-white/25">
          {entries.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {entries.length > 0 ? (
          entries.map((entry, index) => (
            <div key={`${field}-${index}`} className="relative">
              <Input
                type={type}
                value={entry?.[itemKey] || ""}
                handleChange={(event) => onChange(index, field, itemKey, event.target.value)}
                placeholder={placeholder}
                className="pl-12 pr-12"
                disabled={disabled}
              />

              <span className={`absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border 3xl:size-10 ${accentClass}`}>
                <Icon size={15} />
              </span>

              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(field, index)}
                title={`Remove ${title}`}
                aria-label={`Remove ${title}`}
                className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full text-rose-600 transition-all hover:bg-rose-500/[0.08] disabled:cursor-not-allowed disabled:opacity-40 dark:text-rose-200/65 dark:hover:bg-rose-300/[0.06] 3xl:size-10"
              >
                <MdClose size={15} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex min-h-20 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-white/30 px-4 text-center dark:border-white/[0.07] dark:bg-white/[0.008]">
            <Icon size={17} className="text-gray-400 dark:text-white/20" />

            <p className="mt-2 text-[9px] text-gray-400 dark:text-white/25">{emptyText}</p>
          </div>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={() => onAdd(field, itemKey)}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.05] px-3 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.1] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/65 dark:hover:bg-indigo-300/[0.065]"
        >
          <FiPlus size={13} />
          {addLabel}
        </button>
      </div>
    </div>
  );
};

InlineDynamicGroup.propTypes = {
  title: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  field: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentClass: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  addLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const DynamicFieldSection = ({ title, description, entries, field, itemKey, type, placeholder, icon: Icon, accentClass, addLabel, disabled, onAdd, onChange, onRemove }) => {
  return (
    <Wrapper className="group relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.012] blur-[85px]" />

      <div className="relative z-10">
        <SectionHeading icon={Icon} title={title} description={description} accentClass={accentClass} />

        <div className="space-y-2.5">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <div key={`${field}-${index}`} className="relative">
                <Input
                  type={type}
                  value={entry?.[itemKey] || ""}
                  handleChange={(event) => onChange(index, field, itemKey, event.target.value)}
                  placeholder={placeholder}
                  className="pl-12 pr-12"
                  disabled={disabled}
                />

                <span className={`absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border 3xl:size-10 ${accentClass}`}>
                  <Icon size={15} />
                </span>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onRemove(field, index)}
                  title={`Remove ${title}`}
                  aria-label={`Remove ${title}`}
                  className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 transition-all hover:bg-rose-500/[0.13] disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65 dark:hover:bg-rose-300/[0.07] 3xl:size-10"
                >
                  <MdClose size={15} />
                </button>
              </div>
            ))
          ) : (
            <div className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/45 px-4 text-center dark:border-white/[0.07] dark:bg-white/[0.014]">
              <Icon size={18} className="text-gray-400 dark:text-white/25" />

              <p className="mt-2 text-[9px] text-gray-400 dark:text-white/25">No {title.toLowerCase()} added.</p>
            </div>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => onAdd(field, itemKey)}
            className="mt-2 inline-flex h-9 items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.055] px-3 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.1] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65 dark:hover:bg-indigo-300/[0.07]"
          >
            <FiPlus size={13} />
            {addLabel}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

DynamicFieldSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
  field: PropTypes.string.isRequired,
  itemKey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  accentClass: PropTypes.string.isRequired,
  addLabel: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const UpdateAboutSkeleton = () => {
  return (
    <section className="grid grid-cols-1 gap-3 pb-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.75fr)]">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <Wrapper key={index} className="p-5 sm:p-6">
              <div className="animate-pulse">
                <div className="mb-6 h-10 w-52 rounded-xl bg-gray-200 dark:bg-white/[0.04]" />

                <div className="space-y-4">
                  <div className="h-11 rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />
                  <div className="h-11 rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />
                </div>
              </div>
            </Wrapper>
          ))}
        </div>

        <Wrapper className="p-5 sm:p-6">
          <div className="animate-pulse">
            <div className="mb-6 h-10 w-56 rounded-xl bg-gray-200 dark:bg-white/[0.04]" />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="h-44 rounded-[22px] bg-gray-200 dark:bg-white/[0.035]" />
              <div className="h-44 rounded-[22px] bg-gray-200 dark:bg-white/[0.035]" />
            </div>
          </div>
        </Wrapper>

        <Wrapper className="p-5 sm:p-6">
          <div className="animate-pulse">
            <div className="mb-6 h-10 w-52 rounded-xl bg-gray-200 dark:bg-white/[0.04]" />
            <div className="h-11 rounded-2xl bg-gray-200 dark:bg-white/[0.035]" />
            <div className="mt-4 h-40 rounded-[22px] bg-gray-200 dark:bg-white/[0.035]" />
          </div>
        </Wrapper>
      </div>

      <div className="space-y-3">
        <Wrapper className="p-5">
          <div className="h-72 animate-pulse rounded-[26px] bg-gray-200 dark:bg-white/[0.035]" />
        </Wrapper>

        <Wrapper className="p-5">
          <div className="h-40 animate-pulse rounded-[24px] bg-gray-200 dark:bg-white/[0.035]" />
        </Wrapper>
      </div>
    </section>
  );
};

export const UpdateAbout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { intro, isLoading: fetchLoading } = useSelector((state) => state.intro);

  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);

  const [portfolioIntro, setPortfolioIntro] = useState(initialState);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [cv, setCv] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { bio, description, fullname, position, emails, phones, languages, country, address, socialslinks } = portfolioIntro;

  const currentAvatarUrl = intro?.avatar?.filePath || "";

  const currentCvName = intro?.cv?.fileName || "";

  const isBusy = isLoading || fetchLoading;

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(getIntro(id))
      .unwrap()
      .catch((error) => {
        toast.error(getErrorMessage(error, "Failed to fetch introduction."));
      });
  }, [dispatch, id]);

  useEffect(() => {
    if (!intro) {
      return;
    }

    setPortfolioIntro({
      fullname: intro.fullname || "",
      bio: intro.bio || "",
      description: intro.description || "",
      position: intro.position || "",
      country: intro.country || "",
      address: intro.address || "",
      emails: Array.isArray(intro.emails)
        ? intro.emails.map((emailObject) => ({
            email: emailObject?.email || "",
          }))
        : [],
      phones: Array.isArray(intro.phones)
        ? intro.phones.map((phoneObject) => ({
            phone: phoneObject?.phone || "",
          }))
        : [],
      languages: Array.isArray(intro.languages)
        ? intro.languages.map((languageObject) => ({
            language: languageObject?.language || "",
          }))
        : [],
      socialslinks: Array.isArray(intro.socialslinks)
        ? intro.socialslinks.map((linkObject) => ({
            link: linkObject?.link || "",
          }))
        : [],
    });

    setAvatar(null);
    setAvatarPreview(intro?.avatar?.filePath || "");
    setCv(null);
  }, [intro]);

  useEffect(() => {
    return () => {
      revokeObjectUrl(avatarPreview);
    };
  }, [avatarPreview]);

  const processAvatar = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!ALLOWED_IMAGE_FORMATS.includes(selectedFile.type)) {
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

  const processCv = useCallback((selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("CV must be a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_CV_SIZE) {
      toast.error("CV file size exceeds the 10MB limit.");
      return;
    }

    setCv(selectedFile);
  }, []);

  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processAvatar(selectedFile);
    }

    event.target.value = "";
  };

  const handleCvChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      processCv(selectedFile);
    }

    event.target.value = "";
  };

  const handleDropAvatar = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processAvatar(selectedFile);
      }
    },
    [processAvatar],
  );

  const handleDropCv = useCallback(
    (event) => {
      event.preventDefault();

      const selectedFile = event.dataTransfer.files?.[0];

      if (selectedFile) {
        processCv(selectedFile);
      }
    },
    [processCv],
  );

  const handleResetAvatar = (event) => {
    event.preventDefault();
    event.stopPropagation();

    revokeObjectUrl(avatarPreview);

    setAvatar(null);
    setAvatarPreview(currentAvatarUrl);
  };

  const handleRemoveSelectedCv = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setCv(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setPortfolioIntro((previousIntro) => ({
      ...previousIntro,
      [name]: value,
    }));
  };

  const handleArrayChange = (index, field, key, value) => {
    const normalizedValue = field === "phones" ? value.replace(/\s/g, "") : value;

    setPortfolioIntro((previousIntro) => {
      const updatedArray = [...previousIntro[field]];

      updatedArray[index] = {
        ...updatedArray[index],
        [key]: normalizedValue,
      };

      return {
        ...previousIntro,
        [field]: updatedArray,
      };
    });
  };

  const addArrayField = (field, key) => {
    setPortfolioIntro((previousIntro) => ({
      ...previousIntro,
      [field]: [...previousIntro[field], { [key]: "" }],
    }));
  };

  const removeArrayField = (field, index) => {
    setPortfolioIntro((previousIntro) => ({
      ...previousIntro,
      [field]: previousIntro[field].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleUpdate = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("fullname", fullname.trim());
      formData.append("bio", bio.trim());
      formData.append("description", description.trim());
      formData.append("position", position.trim());
      formData.append("country", country.trim());
      formData.append("address", address.trim());

      emails.forEach((emailObject, index) => {
        formData.append(`emails[${index}][email]`, emailObject?.email?.trim() || "");
      });

      phones.forEach((phoneObject, index) => {
        formData.append(`phones[${index}][phone]`, phoneObject?.phone?.trim().replace(/\s/g, "") || "");
      });

      languages.forEach((languageObject, index) => {
        formData.append(`languages[${index}][language]`, languageObject?.language?.trim() || "");
      });

      socialslinks.forEach((linkObject, index) => {
        formData.append(`socialslinks[${index}][link]`, linkObject?.link?.trim() || "");
      });

      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (cv) {
        formData.append("cv", cv);
      }

      await dispatch(
        updateIntro({
          formData,
          id,
        }),
      ).unwrap();

      toast.success("Introduction updated successfully.");

      navigate("/intro");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update introduction."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    revokeObjectUrl(avatarPreview);
    navigate("/intro");
  };

  return (
    <>
      <StickyHeader>
        <div>
          <HeadingTwo>Update Portfolio Introduction</HeadingTwo>

          <p className="mt-1 hidden text-[9px] text-gray-400 dark:text-white/25 sm:block">Refine your professional profile and portfolio information.</p>
        </div>

        <div className="flex items-center gap-2">
          <GhostButton type="button" disabled={isBusy} onClick={handleCancel}>
            Cancel
          </GhostButton>

          <TertiaryButton type="button" disabled={isBusy} onClick={handleUpdate}>
            {isLoading ? "Updating..." : "Update Introduction"}
          </TertiaryButton>
        </div>
      </StickyHeader>

      {fetchLoading && !intro ? (
        <UpdateAboutSkeleton />
      ) : (
        <section className="grid grid-cols-1 gap-3 pb-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,0.75fr)]">
          {/* Main information */}
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Identity */}
              <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[90px]" />

                <div className="relative z-10">
                  <SectionHeading
                    icon={HiOutlineIdentification}
                    title="Professional identity"
                    description="Update your name and professional designation."
                    badge="Existing profile"
                    accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                  />

                  <div>
                    <InputLabel className="mb-2">Full name</InputLabel>

                    <div className="relative">
                      <Input type="text" name="fullname" className="pl-12" value={fullname} handleChange={handleInputChange} placeholder="John Doe" disabled={isBusy} />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-indigo-300/20 bg-indigo-500/[0.09] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70 3xl:size-10">
                        <FaUser size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <InputLabel className="mb-2">Designation</InputLabel>

                    <div className="relative">
                      <Input type="text" name="position" className="pl-12" value={position} handleChange={handleInputChange} placeholder="Software Engineer" disabled={isBusy} />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/[0.09] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.045] dark:text-violet-200/70 3xl:size-10">
                        <PiHandbagFill size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </Wrapper>

              {/* Location */}
              <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
                <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.012] blur-[90px]" />

                <div className="relative z-10">
                  <SectionHeading
                    icon={BiWorld}
                    title="Location details"
                    description="Update your country and professional location."
                    accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                  />

                  <div>
                    <InputLabel className="mb-2">Country</InputLabel>

                    <div className="relative">
                      <Input type="text" name="country" className="pl-12" value={country} handleChange={handleInputChange} placeholder="Australia" disabled={isBusy} />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/[0.09] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.045] dark:text-cyan-200/70 3xl:size-10">
                        <BiWorld size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <InputLabel className="mb-2">Address</InputLabel>

                    <div className="relative">
                      <Input type="text" name="address" className="pl-12" value={address} handleChange={handleInputChange} placeholder="Sydney, New South Wales" disabled={isBusy} />

                      <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/[0.08] text-rose-700 dark:border-rose-300/[0.09] dark:bg-rose-300/[0.04] dark:text-rose-200/70 3xl:size-10">
                        <MdLocationPin size={17} />
                      </span>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </div>

            {/* Contact information */}
            <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-emerald-500/[0.012] blur-[90px]" />

              <div className="relative z-10">
                <SectionHeading
                  icon={MdEmail}
                  title="Contact information"
                  description="Manage the email addresses and phone numbers displayed on your portfolio."
                  accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
                />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <InlineDynamicGroup
                    title="Email addresses"
                    entries={emails}
                    field="emails"
                    itemKey="email"
                    type="email"
                    placeholder="example@domain.com"
                    icon={MdEmail}
                    accentClass="border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65"
                    emptyText="No email address added."
                    addLabel="Add email"
                    disabled={isBusy}
                    onAdd={addArrayField}
                    onChange={handleArrayChange}
                    onRemove={removeArrayField}
                  />

                  <InlineDynamicGroup
                    title="Phone numbers"
                    entries={phones}
                    field="phones"
                    itemKey="phone"
                    type="tel"
                    placeholder="+61412345678"
                    icon={BsTelephone}
                    accentClass="border-cyan-300/20 bg-cyan-500/[0.08] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65"
                    emptyText="No phone number added."
                    addLabel="Add phone"
                    disabled={isBusy}
                    onAdd={addArrayField}
                    onChange={handleArrayChange}
                    onRemove={removeArrayField}
                  />
                </div>
              </div>
            </Wrapper>

            {/* Summary */}
            <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute -bottom-28 -right-28 size-72 rounded-full bg-violet-500/[0.013] blur-[100px]" />

              <div className="relative z-10">
                <SectionHeading
                  icon={HiOutlineSparkles}
                  title="Professional summary"
                  description="Refine your short introduction and detailed portfolio biography."
                  accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70"
                />

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Short bio</InputLabel>

                    <span className="text-[8px] font-medium tabular-nums text-gray-400 dark:text-white/20">{bio.length} characters</span>
                  </div>

                  <div className="relative">
                    <Input type="text" name="bio" className="pl-12" value={bio} handleChange={handleInputChange} placeholder="A short professional introduction" disabled={isBusy} />

                    <span className="absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-violet-300/20 bg-violet-500/[0.08] text-violet-700 dark:border-violet-300/[0.08] dark:bg-violet-300/[0.04] dark:text-violet-200/65 3xl:size-10">
                      <LuNotepadTextDashed size={16} />
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <InputLabel>Detailed description</InputLabel>

                    <span className="text-[8px] font-medium tabular-nums text-gray-400 dark:text-white/20">{description.length} characters</span>
                  </div>

                  <textarea
                    rows={7}
                    name="description"
                    value={description}
                    onChange={handleInputChange}
                    disabled={isBusy}
                    placeholder="Tell visitors more about your background, experience, interests and professional goals."
                    className="min-h-40 w-full resize-y rounded-[22px] border border-gray-200/80 bg-gray-50/55 px-4 py-3 text-[11px] leading-6 text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-violet-400/40 focus:ring-4 focus:ring-violet-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/65 dark:placeholder:text-white/20 dark:focus:border-violet-300/[0.13]"
                  />
                </div>
              </div>
            </Wrapper>
          </div>

          {/* Profile assets */}
          <aside className="min-w-0 space-y-3">
            {/* Avatar */}
            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.014] blur-[80px]" />

              <div className="relative z-10">
                <SectionHeading
                  icon={IoCameraSharp}
                  title="Profile image"
                  description="Replace the current portfolio photograph."
                  badge={avatar ? "New image" : currentAvatarUrl ? "Current image" : undefined}
                  accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Replace profile image"
                  onClick={() => {
                    if (!isBusy) {
                      avatarInputRef.current?.click();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!isBusy && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      avatarInputRef.current?.click();
                    }
                  }}
                  onDrop={handleDropAvatar}
                  onDragOver={(event) => event.preventDefault()}
                  className="relative flex h-72 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border border-dashed border-gray-300/80 bg-gray-50/55 text-center transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/[0.025] focus:outline-none focus:ring-4 focus:ring-indigo-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-indigo-300/[0.15] dark:hover:bg-indigo-300/[0.025]"
                >
                  {avatarPreview ? (
                    <>
                      <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                        <div className="min-w-0 text-left">
                          <p className="truncate text-[10px] font-semibold text-white/90">{avatar?.name || "Current profile image"}</p>

                          <p className="mt-0.5 text-[8px] text-white/50">{avatar ? formatFileSize(avatar.size) : "Saved portfolio image"}</p>
                        </div>

                        <span className="shrink-0 rounded-lg border border-white/[0.12] bg-black/35 px-2.5 py-1.5 text-[8px] font-medium text-white/75 backdrop-blur-xl">Click to replace</span>
                      </div>

                      {avatar && (
                        <button
                          type="button"
                          onClick={handleResetAvatar}
                          title="Restore previous avatar"
                          aria-label="Restore previous avatar"
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/85 text-white shadow-lg backdrop-blur-xl transition-all hover:scale-105 hover:bg-rose-500"
                        >
                          <MdClose size={15} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex max-w-[250px] flex-col items-center px-5">
                      <span className="flex size-16 items-center justify-center rounded-[22px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-600 shadow-[0_12px_30px_rgba(79,70,229,0.1)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                        <IoCameraSharp size={27} />
                      </span>

                      <p className="mt-4 text-[11px] font-semibold text-gray-600 dark:text-white/50">Drop your image here</p>

                      <p className="mt-1.5 text-[8px] leading-4 text-gray-400 dark:text-white/25">PNG, JPG or JPEG · Maximum 2MB</p>
                    </div>
                  )}

                  <input ref={avatarInputRef} id="avatar" type="file" name="avatar" className="hidden" onChange={handleAvatarChange} accept="image/png,image/jpeg,image/jpg" />
                </div>
              </div>
            </Wrapper>

            {/* CV */}
            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-amber-500/[0.012] blur-[80px]" />

              <div className="relative z-10">
                <SectionHeading
                  icon={FiFileText}
                  title="Curriculum vitae"
                  description="Keep the current CV or upload a replacement."
                  badge={cv ? "Replacement selected" : currentCvName ? "Current CV" : undefined}
                  accentClass="border-amber-300/20 bg-amber-500/[0.07] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70"
                />

                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Replace CV file"
                  onClick={() => {
                    if (!isBusy) {
                      cvInputRef.current?.click();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!isBusy && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      cvInputRef.current?.click();
                    }
                  }}
                  onDrop={handleDropCv}
                  onDragOver={(event) => event.preventDefault()}
                  className="relative flex min-h-44 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-gray-300/80 bg-gray-50/55 p-4 text-center transition-all hover:border-amber-400/40 hover:bg-amber-500/[0.025] focus:outline-none focus:ring-4 focus:ring-amber-500/[0.05] dark:border-white/[0.08] dark:bg-white/[0.018] dark:hover:border-amber-300/[0.15] dark:hover:bg-amber-300/[0.025]"
                >
                  {cv || currentCvName ? (
                    <>
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                        <FiFileText size={21} />
                      </span>

                      <p className="mt-3 max-w-[230px] truncate text-[10px] font-semibold text-gray-700 dark:text-white/65">{cv?.name || currentCvName}</p>

                      <p className="mt-1 text-[8px] text-gray-400 dark:text-white/25">{cv ? formatFileSize(cv.size) : "Current saved document"}</p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-1.5 text-[8px] font-medium text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                        <HiOutlineCheckCircle size={13} />
                        {cv ? "Replacement ready" : "PDF attached"}
                      </div>

                      {cv && (
                        <button
                          type="button"
                          onClick={handleRemoveSelectedCv}
                          title="Keep existing CV"
                          aria-label="Remove replacement CV"
                          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-500/[0.08] text-rose-600 transition-all hover:bg-rose-500/[0.15] dark:border-rose-300/[0.08] dark:bg-rose-300/[0.04] dark:text-rose-200/65"
                        >
                          <MdClose size={15} />
                        </button>
                      )}

                      <span className="mt-3 text-[8px] font-medium text-amber-700 dark:text-amber-200/55">Click to replace this document</span>
                    </>
                  ) : (
                    <>
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.09] dark:bg-amber-300/[0.04] dark:text-amber-200/70">
                        <FiUploadCloud size={21} />
                      </span>

                      <p className="mt-3 text-[10px] font-semibold text-gray-600 dark:text-white/50">Drop your CV here</p>

                      <p className="mt-1 text-[8px] text-gray-400 dark:text-white/25">PDF document · Maximum 10MB</p>
                    </>
                  )}

                  <input ref={cvInputRef} id="cv" type="file" name="cv" className="hidden" onChange={handleCvChange} accept="application/pdf" />
                </div>
              </div>
            </Wrapper>

            <DynamicFieldSection
              title="Social links"
              description="Manage portfolio and professional profile URLs."
              entries={socialslinks}
              field="socialslinks"
              itemKey="link"
              type="url"
              placeholder="https://example.com"
              icon={HiLink}
              accentClass="border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.09] dark:bg-sky-300/[0.04] dark:text-sky-200/70"
              addLabel="Add social link"
              disabled={isBusy}
              onAdd={addArrayField}
              onChange={handleArrayChange}
              onRemove={removeArrayField}
            />

            <DynamicFieldSection
              title="Languages"
              description="Manage the languages displayed on your portfolio."
              entries={languages}
              field="languages"
              itemKey="language"
              type="text"
              placeholder="English"
              icon={IoLanguageOutline}
              accentClass="border-orange-300/20 bg-orange-500/[0.07] text-orange-700 dark:border-orange-300/[0.09] dark:bg-orange-300/[0.04] dark:text-orange-200/70"
              addLabel="Add language"
              disabled={isBusy}
              onAdd={addArrayField}
              onChange={handleArrayChange}
              onRemove={removeArrayField}
            />
          </aside>
        </section>
      )}
    </>
  );
};

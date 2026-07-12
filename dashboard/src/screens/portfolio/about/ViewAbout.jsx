import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

import { FiArrowLeft, FiBriefcase, FiCheckCircle, FiDownload, FiEdit2, FiExternalLink, FiFileText, FiGlobe, FiMail, FiMapPin, FiPhone, FiRefreshCw, FiTrash2, FiUser } from "react-icons/fi";
import { HiOutlineDocumentText, HiOutlineIdentification, HiOutlineLink, HiOutlineSparkles } from "react-icons/hi2";
import { IoLanguageOutline } from "react-icons/io5";

import { deleteIntro, getIntro } from "@/redux/slices/portfolio/introSlice";
import introService from "@/redux/services/portfolio/introOfPortfolioService";
import { Loader, Wrapper } from "@/routes";

const safeUrl = (value) => {
  if (!value) {
    return null;
  }

  try {
    const formattedValue = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

    const url = new URL(formattedValue);

    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

const getFileName = (response, fallback) => {
  const disposition = response.headers?.["content-disposition"];

  const match = disposition?.match(/filename[^;=\n]*=(?:UTF-8'')?["']?([^"';\n]+)/i);

  return match ? decodeURIComponent(match[1]) : fallback;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.message || error?.error || error?.response?.data?.error || error?.response?.data?.message || fallback;
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "P";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

const getSocialLabel = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External profile";
  }
};

const SectionHeader = ({ icon: Icon, eyebrow, title, description, accentClass, trailing }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl border ${accentClass}`}>
          <Icon size={18} />
        </span>

        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/25">{eyebrow}</p>

          <h2 className="mt-1 text-base font-black tracking-[-0.02em] text-gray-900 dark:text-white/90">{title}</h2>

          {description && <p className="mt-1 text-[9px] leading-4 text-gray-400 dark:text-white/25">{description}</p>}
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
  description: PropTypes.string,
  accentClass: PropTypes.string.isRequired,
  trailing: PropTypes.node,
};

const ProfileInfoRow = ({ icon: Icon, label, value, accentClass }) => {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3.5 dark:border-white/[0.05] dark:bg-white/[0.016]">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}>
        <Icon size={15} />
      </span>

      <div className="min-w-0">
        <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">{label}</p>

        <p className="mt-1 break-words text-[10px] font-semibold leading-5 text-gray-700 dark:text-white/60">{value || "Not provided"}</p>
      </div>
    </div>
  );
};

ProfileInfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  accentClass: PropTypes.string.isRequired,
};

const ContactCard = ({ icon: Icon, label, value, href, accentClass }) => {
  return (
    <a
      href={href}
      className="group/contact flex min-w-0 items-center gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/35 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:hover:border-indigo-300/[0.12] dark:hover:bg-white/[0.025]"
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/contact:scale-105 ${accentClass}`}>
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">{label}</p>

        <p className="mt-1 truncate text-[10px] font-semibold text-gray-700 transition-colors group-hover/contact:text-indigo-700 dark:text-white/60 dark:group-hover/contact:text-indigo-200/75">
          {value}
        </p>
      </div>
    </a>
  );
};

ContactCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
};

export const ViewAbout = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { intro, isLoading } = useSelector((state) => state.intro);

  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadIntro = useCallback(async () => {
    if (!id) {
      setError("Introduction ID is missing.");
      return;
    }

    try {
      setError("");
      await dispatch(getIntro(id)).unwrap();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load introduction details."));
    }
  }, [dispatch, id]);

  useEffect(() => {
    loadIntro();
  }, [loadIntro]);

  const emails = useMemo(() => (Array.isArray(intro?.emails) ? intro.emails.filter((item) => item?.email?.trim()) : []), [intro?.emails]);

  const phones = useMemo(() => (Array.isArray(intro?.phones) ? intro.phones.filter((item) => item?.phone?.trim()) : []), [intro?.phones]);

  const languages = useMemo(() => (Array.isArray(intro?.languages) ? intro.languages.map((item) => item?.language?.trim()).filter(Boolean) : []), [intro?.languages]);

  const socialLinks = useMemo(() => {
    if (!Array.isArray(intro?.socialslinks)) {
      return [];
    }

    return intro.socialslinks
      .map((item, index) => ({
        id: item?._id || `social-${index}`,
        original: item?.link,
        url: safeUrl(item?.link),
      }))
      .filter((item) => item.url);
  }, [intro?.socialslinks]);

  const avatarUrl = intro?.avatar?.filePath || intro?.avatar?.url || "";

  const hasCv = Boolean(intro?.cv?.fileName || intro?.cv?.filePath || intro?.cv);

  const handleDownloadCV = async () => {
    if (!id || downloading) {
      return;
    }

    try {
      setDownloading(true);

      const response = await introService.downloadCV(id);

      const contentType = response.headers?.["content-type"] || "application/pdf";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = getFileName(response, intro?.cv?.fileName || `${intro?.fullname || "portfolio"}-cv.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);

      toast.success("CV downloaded successfully.");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Unable to download CV."));
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = () => {
    if (!id || deleting) {
      return;
    }

    confirmAlert({
      title: "Delete introduction",
      message: `Delete ${intro?.fullname || "this introduction"} permanently?`,
      buttons: [
        {
          label: "Delete",
          onClick: async () => {
            try {
              setDeleting(true);

              await dispatch(deleteIntro(id)).unwrap();

              toast.success("Introduction deleted successfully.");

              navigate("/intro");
            } catch (requestError) {
              toast.error(getErrorMessage(requestError, "Unable to delete introduction."));
            } finally {
              setDeleting(false);
            }
          },
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  if (isLoading && !intro) {
    return <Loader />;
  }

  if (error) {
    return (
      <Wrapper className="relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden p-8 text-center">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-rose-500/[0.025] blur-[95px]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-indigo-500/[0.018] blur-[95px]" />

        <div className="relative z-10">
          <span className="mx-auto flex size-16 items-center justify-center rounded-[22px] border border-rose-300/20 bg-rose-500/[0.07] text-rose-600 dark:border-rose-300/[0.09] dark:bg-rose-300/[0.04] dark:text-rose-200/70">
            <FiUser size={27} />
          </span>

          <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-gray-900 dark:text-white/90">Introduction unavailable</h2>

          <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-gray-500 dark:text-white/35">{error}</p>

          <button
            type="button"
            onClick={loadIntro}
            className="mx-auto mt-5 inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.08] px-4 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.13] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70 dark:hover:bg-indigo-300/[0.08]"
          >
            <FiRefreshCw size={14} />
            Try again
          </button>
        </div>
      </Wrapper>
    );
  }

  if (!intro) {
    return null;
  }

  return (
    <div className="space-y-3 pb-8">
      {/* Page actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/35 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.012] sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/intro")}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl px-3 text-[9px] font-semibold text-gray-500 transition-all hover:bg-gray-100/80 hover:text-indigo-700 dark:text-white/35 dark:hover:bg-white/[0.035] dark:hover:text-indigo-200/70"
        >
          <FiArrowLeft size={14} />
          Back to introductions
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink
            to={`/update-intro/${id}`}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/60 px-4 text-[9px] font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-indigo-300/35 hover:text-indigo-700 dark:border-white/[0.06] dark:bg-white/[0.018] dark:text-white/45 dark:hover:border-indigo-300/[0.12] dark:hover:text-indigo-200/70"
          >
            <FiEdit2 size={13} />
            Edit profile
          </NavLink>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-500/[0.08] px-4 text-[9px] font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-500/[0.14] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 dark:border-rose-300/[0.09] dark:bg-rose-300/[0.04] dark:text-rose-200/70 dark:hover:bg-rose-300/[0.075]"
          >
            <FiTrash2 size={13} />

            {deleting ? "Deleting..." : "Delete profile"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[330px_minmax(0,1fr)]">
        {/* Identity panel */}
        <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
          <Wrapper className="group relative overflow-hidden p-4">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.018] blur-[95px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.014] blur-[95px]" />

            <div className="relative z-10">
              {/* Avatar */}
              <div className="relative overflow-hidden rounded-[26px] border border-gray-200/70 bg-gray-100 dark:border-white/[0.06] dark:bg-white/[0.018]">
                <div className="aspect-[4/4.3]">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={intro?.fullname || "Portfolio profile"} className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.20),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.16),transparent_42%),linear-gradient(145deg,#172033,#0a0f1b)]">
                      <span className="text-6xl font-black tracking-[-0.06em] text-white/[0.15]">{getInitials(intro?.fullname)}</span>
                    </div>
                  )}
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-black/30 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.11em] text-white/80 backdrop-blur-xl">
                  <FiCheckCircle size={12} />
                  Portfolio profile
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.13em] text-white/40">Professional identity</p>

                  <h1 className="mt-1.5 text-xl font-black capitalize leading-tight tracking-[-0.03em] text-white/90">{intro?.fullname || "Unnamed profile"}</h1>

                  <div className="mt-2 flex items-center gap-2 text-[9px] font-medium text-white/55">
                    <FiBriefcase className="shrink-0" />

                    <span className="truncate">{intro?.position || "Position not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {intro?.bio && (
                <div className="mt-4 rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 dark:border-white/[0.05] dark:bg-white/[0.014]">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-indigo-600 dark:text-indigo-200/50">Professional bio</p>

                  <p className="mt-2 text-[10px] font-medium leading-5 text-gray-600 dark:text-white/45">{intro.bio}</p>
                </div>
              )}

              {/* CV */}
              {hasCv && (
                <button
                  type="button"
                  onClick={handleDownloadCV}
                  disabled={downloading}
                  className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.06] p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300/35 hover:bg-indigo-500/[0.10] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.035] dark:hover:bg-indigo-300/[0.065]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/20 bg-indigo-500/[0.09] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.05] dark:text-indigo-200/70">
                      <FiFileText size={16} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-indigo-600 dark:text-indigo-200/45">Curriculum vitae</p>

                      <p className="mt-1 truncate text-[9px] font-semibold text-indigo-800 dark:text-indigo-100/70">{intro?.cv?.fileName || "Portfolio CV"}</p>
                    </div>
                  </div>

                  <FiDownload size={15} className="shrink-0 text-indigo-600 dark:text-indigo-200/65" />
                </button>
              )}

              {/* Quick details */}
              <div className="mt-3 space-y-2">
                <ProfileInfoRow
                  icon={FiGlobe}
                  label="Country"
                  value={intro?.country}
                  accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
                />

                <ProfileInfoRow
                  icon={FiMapPin}
                  label="Location"
                  value={intro?.address}
                  accentClass="border-rose-300/20 bg-rose-500/[0.07] text-rose-700 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65"
                />
              </div>
            </div>
          </Wrapper>
        </aside>

        {/* Main profile content */}
        <main className="min-w-0 space-y-3">
          {/* About */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-violet-500/[0.014] blur-[90px]" />

            <div className="relative z-10">
              <SectionHeader
                icon={HiOutlineSparkles}
                eyebrow="Profile narrative"
                title="About"
                description="Professional experience, interests and personal introduction."
                accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.09] dark:bg-violet-300/[0.04] dark:text-violet-200/70"
                trailing={
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/55 px-3 py-1.5 text-[8px] font-medium text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                    <HiOutlineIdentification size={13} />
                    Portfolio introduction
                  </span>
                }
              />

              <div className="mt-6 rounded-[22px] border border-gray-200/70 bg-gray-50/40 p-5 dark:border-white/[0.045] dark:bg-white/[0.012] sm:p-6">
                <p className="whitespace-pre-line text-[11px] leading-7 text-gray-600 dark:text-white/55">{intro?.description || "No description has been provided."}</p>
              </div>
            </div>
          </Wrapper>

          {/* Information and languages */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -bottom-20 -left-20 size-56 rounded-full bg-cyan-500/[0.012] blur-[80px]" />

              <div className="relative z-10">
                <SectionHeader
                  icon={HiOutlineIdentification}
                  eyebrow="Profile details"
                  title="Personal information"
                  description="Your primary professional and location details."
                  accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                />

                <div className="mt-5 space-y-2.5">
                  <ProfileInfoRow
                    icon={FiUser}
                    label="Full name"
                    value={intro?.fullname}
                    accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
                  />

                  <ProfileInfoRow
                    icon={FiBriefcase}
                    label="Designation"
                    value={intro?.position}
                    accentClass="border-violet-300/20 bg-violet-500/[0.07] text-violet-700 dark:border-violet-300/[0.08] dark:bg-violet-300/[0.035] dark:text-violet-200/65"
                  />

                  <ProfileInfoRow
                    icon={FiGlobe}
                    label="Country"
                    value={intro?.country}
                    accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
                  />

                  <ProfileInfoRow
                    icon={FiMapPin}
                    label="Address"
                    value={intro?.address}
                    accentClass="border-rose-300/20 bg-rose-500/[0.07] text-rose-700 dark:border-rose-300/[0.08] dark:bg-rose-300/[0.035] dark:text-rose-200/65"
                  />
                </div>
              </div>
            </Wrapper>

            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-orange-500/[0.012] blur-[80px]" />

              <div className="relative z-10">
                <SectionHeader
                  icon={IoLanguageOutline}
                  eyebrow="Communication"
                  title="Languages"
                  description="Languages available for professional communication."
                  accentClass="border-orange-300/20 bg-orange-500/[0.07] text-orange-700 dark:border-orange-300/[0.09] dark:bg-orange-300/[0.04] dark:text-orange-200/70"
                  trailing={
                    <span className="rounded-full border border-gray-200/70 bg-gray-50/55 px-2.5 py-1 text-[8px] font-semibold tabular-nums text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                      {languages.length}
                    </span>
                  }
                />

                <div className="mt-5">
                  {languages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {languages.map((language, index) => (
                        <div key={`${language}-${index}`} className="flex items-center gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3.5 dark:border-white/[0.05] dark:bg-white/[0.016]">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-500/[0.07] text-orange-700 dark:border-orange-300/[0.08] dark:bg-orange-300/[0.035] dark:text-orange-200/65">
                            <IoLanguageOutline size={15} />
                          </span>

                          <span className="truncate text-[10px] font-semibold capitalize text-gray-700 dark:text-white/60">{language}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/35 px-4 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
                      <IoLanguageOutline className="text-xl text-gray-400 dark:text-white/25" />

                      <p className="mt-2 text-[9px] text-gray-400 dark:text-white/25">No languages have been added.</p>
                    </div>
                  )}
                </div>
              </div>
            </Wrapper>
          </div>

          {/* Contact */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-emerald-500/[0.012] blur-[90px]" />

            <div className="relative z-10">
              <SectionHeader
                icon={FiMail}
                eyebrow="Communication channels"
                title="Contact information"
                description="Direct email addresses and phone numbers."
                accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
                trailing={
                  <span className="rounded-full border border-gray-200/70 bg-gray-50/55 px-3 py-1.5 text-[8px] font-medium text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                    {emails.length + phones.length} contact
                    {emails.length + phones.length === 1 ? "" : "s"}
                  </span>
                }
              />

              {emails.length > 0 || phones.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {emails.map((item, index) => (
                    <ContactCard
                      key={item?._id || `email-${index}`}
                      icon={FiMail}
                      label="Email address"
                      value={item.email}
                      href={`mailto:${item.email}`}
                      accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65"
                    />
                  ))}

                  {phones.map((item, index) => (
                    <ContactCard
                      key={item?._id || `phone-${index}`}
                      icon={FiPhone}
                      label="Phone number"
                      value={item.phone}
                      href={`tel:${item.phone}`}
                      accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/35 px-4 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
                  <FiMail className="text-xl text-gray-400 dark:text-white/25" />

                  <p className="mt-2 text-[9px] text-gray-400 dark:text-white/25">No contact information has been added.</p>
                </div>
              )}
            </div>
          </Wrapper>

          {/* Social profiles */}
          <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
            <div className="pointer-events-none absolute -left-24 -bottom-24 size-64 rounded-full bg-sky-500/[0.012] blur-[90px]" />

            <div className="relative z-10">
              <SectionHeader
                icon={HiOutlineLink}
                eyebrow="Online presence"
                title="Social and professional links"
                description="Portfolio websites and external professional profiles."
                accentClass="border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.09] dark:bg-sky-300/[0.04] dark:text-sky-200/70"
                trailing={
                  <span className="rounded-full border border-gray-200/70 bg-gray-50/55 px-2.5 py-1 text-[8px] font-semibold tabular-nums text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
                    {socialLinks.length}
                  </span>
                }
              />

              {socialLinks.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-300/35 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/[0.05] dark:bg-white/[0.016] dark:hover:border-sky-300/[0.12] dark:hover:bg-white/[0.025]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-500/[0.07] text-sky-700 dark:border-sky-300/[0.08] dark:bg-sky-300/[0.035] dark:text-sky-200/65">
                          <FiExternalLink size={14} />
                        </span>

                        <div className="min-w-0">
                          <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">External profile</p>

                          <p className="mt-1 truncate text-[10px] font-semibold text-gray-700 group-hover/link:text-sky-700 dark:text-white/60 dark:group-hover/link:text-sky-200/75">
                            {getSocialLabel(item.url)}
                          </p>
                        </div>
                      </div>

                      <FiExternalLink
                        size={13}
                        className="shrink-0 text-gray-300 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-sky-500 dark:text-white/15 dark:group-hover/link:text-sky-200/60"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300/80 bg-gray-50/35 px-4 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
                  <HiOutlineLink className="text-xl text-gray-400 dark:text-white/25" />

                  <p className="mt-2 text-[9px] text-gray-400 dark:text-white/25">No social links have been added.</p>
                </div>
              )}
            </div>
          </Wrapper>

          {/* CV document card */}
          {hasCv && (
            <Wrapper className="group relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-indigo-500/[0.014] blur-[80px]" />

              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                    <HiOutlineDocumentText size={19} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.13em] text-indigo-600 dark:text-indigo-200/50">Portfolio document</p>

                    <h2 className="mt-1 truncate text-[11px] font-bold text-gray-800 dark:text-white/65">{intro?.cv?.fileName || "Curriculum Vitae"}</h2>

                    <p className="mt-1 text-[8px] text-gray-400 dark:text-white/25">Download the attached professional CV.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadCV}
                  disabled={downloading}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.08] px-4 text-[9px] font-semibold text-indigo-700 transition-all hover:-translate-y-0.5 hover:bg-indigo-500/[0.13] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.045] dark:text-indigo-200/70 dark:hover:bg-indigo-300/[0.08]"
                >
                  <FiDownload size={14} />

                  {downloading ? "Downloading..." : "Download CV"}
                </button>
              </div>
            </Wrapper>
          )}
        </main>
      </div>
    </div>
  );
};

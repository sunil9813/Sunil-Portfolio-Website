import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiWorld } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";

import { getUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { generateItemColor } from "@/utils";
import { RichTextRenderer, Wrapper } from "@/routes";

const FALLBACK_BACKGROUND = "linear-gradient(135deg, #334155 0%, #3730a3 50%, #172554 100%)";

const normalizeExternalUrl = (url) => {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
};

export const UniversityDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { university } = useSelector((state) => state.university);

  useEffect(() => {
    if (slug) {
      dispatch(getUniversity(slug));
    }
  }, [dispatch, slug]);

  const heroBackground = useMemo(() => {
    try {
      if (!university?.name) {
        return FALLBACK_BACKGROUND;
      }

      return generateItemColor(university.name) || FALLBACK_BACKGROUND;
    } catch (error) {
      console.error("Error generating university background:", error);

      return FALLBACK_BACKGROUND;
    }
  }, [university?.name]);

  const websiteUrl = useMemo(() => {
    return normalizeExternalUrl(university?.website);
  }, [university?.website]);

  const locationUrl = useMemo(() => {
    const directLocationUrl = university?.locationUrl || university?.mapUrl;

    if (directLocationUrl) {
      return normalizeExternalUrl(directLocationUrl);
    }

    const locationText = university?.location || university?.address;

    if (!locationText) {
      return "";
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;
  }, [university?.locationUrl, university?.mapUrl, university?.location, university?.address]);

  const universityInitial = university?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <Wrapper className="group relative overflow-hidden">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-28 top-40 size-72 rounded-full bg-indigo-500/[0.016] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.012] blur-[100px]" />

      {/* University banner */}
      <section
        className="relative h-52 overflow-hidden rounded-t-2xl sm:h-60"
        style={{
          background: heroBackground,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/[0.05] via-transparent to-black/40" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_38%)]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.10]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="university-banner-pattern" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="36" stroke="currentColor" strokeWidth="0.7" className="text-white" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#university-banner-pattern)" />
          </svg>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full border border-white/[0.14] bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-xl sm:left-7 sm:top-7">
          University profile
        </div>
      </section>

      {/* University information */}
      <section className="relative z-10 px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col sm:flex-row sm:gap-5">
            {/* Logo */}
            <div className="-mt-12 size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-gray-100 shadow-[0_16px_40px_rgba(15,23,42,0.18)] dark:border-[#11151d] dark:bg-white/[0.035] dark:shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:-mt-14 sm:size-28">
              {university?.logo?.filePath ? (
                <img src={university.logo.filePath} alt={university?.logo?.publicId || `${university?.name || "University"} logo`} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                  style={{
                    background: heroBackground,
                  }}
                >
                  {universityInitial}
                </div>
              )}
            </div>

            {/* Name and established date */}
            <div className="min-w-0 pt-4 sm:pt-5">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-xl font-bold capitalize leading-tight tracking-[-0.025em] text-gray-900 dark:text-white/90 sm:text-2xl">{university?.name || "University name"}</h1>

                <VscVerifiedFilled size={21} title="Verified university" className="shrink-0 text-emerald-500 dark:text-emerald-300/80" />
              </div>

              {university?.edate && (
                <div className="mt-2 inline-flex items-center rounded-full border border-gray-200/70 bg-gray-50/60 px-3 py-1.5 text-[9px] font-medium text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/35">
                  Established in {university.edate}
                </div>
              )}
            </div>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-2 sm:pt-5">
            {locationUrl ? (
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View university location"
                title="View university location"
                className="group/location relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-rose-300/25 bg-rose-500/[0.10] text-rose-600 shadow-[0_8px_22px_rgba(190,70,90,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/[0.16] dark:border-rose-300/[0.11] dark:bg-rose-300/[0.06] dark:text-rose-200/75"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent" />

                <MdLocationPin size={18} className="relative z-10 transition-transform duration-300 group-hover/location:scale-110" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-label="University location unavailable"
                title="Location unavailable"
                className="flex size-10 cursor-not-allowed items-center justify-center rounded-xl border border-gray-200/70 bg-gray-100/60 text-gray-400 opacity-50 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30"
              >
                <MdLocationPin size={18} />
              </button>
            )}

            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit university website"
                title="Visit university website"
                className="group/website relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-teal-300/25 bg-teal-500/[0.10] text-teal-600 shadow-[0_8px_22px_rgba(20,184,166,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500/[0.16] dark:border-teal-300/[0.11] dark:bg-teal-300/[0.06] dark:text-teal-200/75"
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent" />

                <BiWorld size={19} className="relative z-10 transition-transform duration-300 group-hover/website:scale-110" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-label="University website unavailable"
                title="Website unavailable"
                className="flex size-10 cursor-not-allowed items-center justify-center rounded-xl border border-gray-200/70 bg-gray-100/60 text-gray-400 opacity-50 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30"
              >
                <BiWorld size={19} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-gray-200/70 pt-6 dark:border-white/[0.05]">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/45 p-5 dark:border-white/[0.045] dark:bg-white/[0.016] sm:p-6">
            <div
              className="absolute inset-y-5 left-0 w-0.5 rounded-full opacity-70"
              style={{
                background: heroBackground,
              }}
            />

            <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-indigo-500/[0.018] blur-[65px]" />

            <div className="relative z-10 text-gray-700 dark:text-white/65">
              <RichTextRenderer content={university?.description || ""} />
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

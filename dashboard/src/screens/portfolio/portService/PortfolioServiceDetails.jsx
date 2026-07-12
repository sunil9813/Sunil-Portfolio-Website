import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { HiOutlineBriefcase, HiOutlineCheckBadge, HiOutlineDocumentText, HiOutlinePhoto, HiOutlineSparkles, HiOutlineUser } from "react-icons/hi2";
import { VscVerifiedFilled } from "react-icons/vsc";

import { getService } from "@/redux/slices/portfolio/portServiceService";
import { generateItemColor } from "@/utils";
import { RichTextRenderer, Wrapper } from "@/routes";
import PropTypes from "prop-types";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3940/3940417.png";

const getInitials = (value = "") => {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "S";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

const ServiceDetailsSkeleton = () => {
  return (
    <div className="space-y-3 pb-8">
      <Wrapper className="p-3 sm:p-4">
        <div className="grid animate-pulse grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
          <div className="h-[360px] rounded-[26px] bg-gray-200 dark:bg-white/[0.035]" />

          <div className="min-h-[360px] rounded-[26px] bg-gray-200 dark:bg-white/[0.035]" />
        </div>
      </Wrapper>

      <Wrapper className="p-5 sm:p-6">
        <div className="animate-pulse">
          <div className="h-12 w-64 rounded-2xl bg-gray-200 dark:bg-white/[0.04]" />

          <div className="mt-6 space-y-3">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-4 rounded-lg bg-gray-200 dark:bg-white/[0.035]" />
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

const ServiceUnavailable = ({ message }) => {
  return (
    <Wrapper className="relative flex min-h-[420px] items-center justify-center overflow-hidden p-6 text-center">
      <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.02] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.016] blur-[100px]" />

      <div className="relative z-10 max-w-md">
        <span className="mx-auto flex size-16 items-center justify-center rounded-[22px] border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
          <HiOutlineBriefcase size={27} />
        </span>

        <h2 className="mt-5 text-lg font-black tracking-[-0.025em] text-gray-900 dark:text-white/90">Service unavailable</h2>

        <p className="mt-2 text-[10px] leading-5 text-gray-500 dark:text-white/35">{message}</p>
      </div>
    </Wrapper>
  );
};

ServiceUnavailable.propTypes = {
  message: PropTypes.string.isRequired,
};

export const PortfolioServiceDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { service, isLoading, loading, error } = useSelector((state) => state.service);

  const serviceLoading = Boolean(isLoading || loading);

  useEffect(() => {
    if (slug) {
      dispatch(getService(slug));
    }
  }, [dispatch, slug]);

  const providerName = service?.user?.name || service?.user?.fullname || service?.name || "Service provider";

  const providerAvatar = service?.user?.avatar?.url || service?.user?.avatar?.filePath || "";

  const providerAvatarId = service?.user?.avatar?.publicId || providerName;

  const shouldShowGeneratedAvatar = !providerAvatar || providerAvatar === DEFAULT_AVATAR;

  const providerBackground = useMemo(() => {
    try {
      return generateItemColor(providerName) || "linear-gradient(135deg, #6366f1, #06b6d4)";
    } catch {
      return "linear-gradient(135deg, #6366f1, #06b6d4)";
    }
  }, [providerName]);

  const serviceInitial = getInitials(service?.title);

  const displayedError = typeof error === "string" ? error : error?.message || error?.data?.message || "";

  if (serviceLoading && (!service || Object.keys(service).length === 0)) {
    return <ServiceDetailsSkeleton />;
  }

  if (displayedError && (!service || Object.keys(service).length === 0)) {
    return <ServiceUnavailable message={displayedError} />;
  }

  if (!service || Object.keys(service).length === 0) {
    return <ServiceUnavailable message="The requested portfolio service could not be found." />;
  }

  return (
    <div className="space-y-3 pb-8">
      {/* Service presentation */}
      <Wrapper className="group relative overflow-hidden p-3 sm:p-4">
        <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-indigo-500/[0.02] blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-cyan-500/[0.015] blur-[110px]" />

        <div className="relative z-10 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.82fr)]">
          {/* Service cover */}
          <section className="relative min-h-[330px] overflow-hidden rounded-[28px] border border-gray-200/70 bg-gray-100 shadow-[0_18px_42px_rgba(15,23,42,0.07)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_22px_52px_rgba(0,0,0,0.22)] sm:min-h-[400px]">
            {service?.cover?.filePath ? (
              <img
                src={service.cover.filePath}
                alt={service?.cover?.publicId || service?.title || "Service cover"}
                crossOrigin="anonymous"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.025]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_80%_14%,rgba(99,102,241,0.23),transparent_34%),radial-gradient(circle_at_12%_86%,rgba(6,182,212,0.18),transparent_40%),linear-gradient(145deg,#172033,#090e18)]">
                <span className="text-8xl font-black tracking-[-0.06em] text-white/[0.1]">{serviceInitial}</span>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/80" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-black/30 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] text-white/80 backdrop-blur-xl">
              <HiOutlinePhoto size={14} />
              Service showcase
            </div>

            <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/15 px-3 py-1.5 text-[8px] font-semibold text-emerald-100 backdrop-blur-xl">
                <VscVerifiedFilled size={13} />
                Verified portfolio service
              </div>

              <h1 className="mt-4 max-w-3xl text-2xl font-black capitalize leading-[1.08] tracking-[-0.04em] text-white/95 sm:text-3xl lg:text-4xl">{service?.title || "Portfolio service"}</h1>
            </div>
          </section>

          {/* Service information */}
          <section className="relative overflow-hidden rounded-[28px] border border-gray-200/70 bg-gray-50/45 p-5 shadow-[0_18px_42px_rgba(15,23,42,0.05)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:shadow-[0_22px_52px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.02] blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-cyan-500/[0.014] blur-[90px]" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/20 bg-indigo-500/[0.06] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
                  <HiOutlineBriefcase size={14} />
                  Portfolio service
                </span>

                <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/[0.06] text-emerald-600 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
                  <HiOutlineCheckBadge size={17} />
                </span>
              </div>

              <div className="my-auto py-8">
                <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-white/20">Professional service</p>

                <div className="mt-3 flex items-start gap-3">
                  <h2 className="text-2xl font-black capitalize leading-[1.1] tracking-[-0.04em] text-gray-950 dark:text-white/90 sm:text-3xl">{service?.title || "Portfolio service"}</h2>

                  <VscVerifiedFilled size={23} title="Verified service" className="mt-1 shrink-0 text-emerald-500 dark:text-emerald-300/75" />
                </div>

                <p className="mt-4 max-w-lg text-[10px] leading-5 text-gray-500 dark:text-white/35">Explore the complete service description, professional expertise and provider information below.</p>
              </div>

              {/* Provider */}
              <div className="border-t border-gray-200/70 pt-5 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                  {shouldShowGeneratedAvatar ? (
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black uppercase text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]"
                      style={{
                        background: providerBackground,
                      }}
                    >
                      {getInitials(providerName)}
                    </div>
                  ) : (
                    <div className="size-12 shrink-0 overflow-hidden rounded-2xl border border-gray-200/75 bg-gray-100 shadow-[0_8px_20px_rgba(15,23,42,0.08)] dark:border-white/[0.07] dark:bg-white/[0.025]">
                      <img src={providerAvatar} alt={providerAvatarId || "Service provider"} crossOrigin="anonymous" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <HiOutlineUser className="text-gray-400 dark:text-white/25" />

                      <p className="text-[7px] font-semibold uppercase tracking-[0.11em] text-gray-400 dark:text-white/20">Service provider</p>
                    </div>

                    <p className="mt-1 truncate text-[11px] font-bold capitalize text-gray-800 dark:text-white/65">{providerName}</p>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.045] px-3 py-1.5 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:bg-emerald-300/70" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Wrapper>

      {/* Quick service information */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Wrapper className="group relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-indigo-500/[0.018] blur-[65px]" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65">
              <HiOutlineBriefcase size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Service type</p>

              <p className="mt-1 truncate text-[10px] font-bold capitalize text-gray-700 dark:text-white/55">{service?.category?.name || service?.category?.title || "Professional service"}</p>
            </div>
          </div>
        </Wrapper>

        <Wrapper className="group relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-cyan-500/[0.018] blur-[65px]" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65">
              <HiOutlineUser size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Presented by</p>

              <p className="mt-1 truncate text-[10px] font-bold capitalize text-gray-700 dark:text-white/55">{providerName}</p>
            </div>
          </div>
        </Wrapper>

        <Wrapper className="group relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald-500/[0.018] blur-[65px]" />

          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65">
              <HiOutlineCheckBadge size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/20">Service status</p>

              <p className="mt-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-200/65">Verified and available</p>
            </div>
          </div>
        </Wrapper>
      </section>

      {/* Service description */}
      <Wrapper className="group relative overflow-hidden p-0">
        <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-indigo-500/[0.016] blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-28 -left-28 size-72 rounded-full bg-cyan-500/[0.012] blur-[100px]" />

        <div className="relative z-10">
          <header className="flex flex-col gap-4 border-b border-gray-200/70 px-5 py-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <HiOutlineDocumentText size={19} />
              </span>

              <div>
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-200/50">Service information</p>

                <h2 className="mt-1 text-lg font-black tracking-[-0.025em] text-gray-950 dark:text-white/90">About This Service</h2>

                <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Detailed information about the service, process and professional offering.</p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200/70 bg-gray-50/55 px-3 py-1.5 text-[8px] font-semibold text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/30">
              <HiOutlineSparkles size={13} />
              Service overview
            </span>
          </header>

          <article className="mx-auto max-w-6xl p-5 text-gray-700 dark:text-white/60 sm:p-7 lg:p-9">
            {service?.description ? (
              <RichTextRenderer content={service.description} />
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-300/80 bg-gray-50/35 px-5 text-center dark:border-white/[0.07] dark:bg-white/[0.01]">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-gray-200/70 bg-white/55 text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.018] dark:text-white/25">
                  <HiOutlineDocumentText size={20} />
                </span>

                <p className="mt-3 text-[10px] font-semibold text-gray-600 dark:text-white/45">No service description available</p>

                <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">Detailed information has not been added for this service.</p>
              </div>
            )}
          </article>
        </div>
      </Wrapper>
    </div>
  );
};

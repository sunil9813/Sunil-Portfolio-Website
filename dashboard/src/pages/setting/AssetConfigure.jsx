import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArchiveBox,
  HiOutlineArrowPath,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineChevronRight,
  HiOutlineCircleStack,
  HiOutlineCloudArrowUp,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineMinus,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi2";

import { addAssetsLimit, getAssetsLimit } from "@/redux/slices/settings/AssestLimitSlice";
import { CommonClassForInput } from "@/utils";
import { BreadcrumbsComponent, Wrapper } from "@/routes";

const PRESET_LIMITS = [5, 10, 15, 20];

const MAX_PREVIEW_SLOTS = 12;
const VISUAL_SCALE_MAX = 25;

const getErrorMessage = (error, fallback = "Unable to update the asset limit.") => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.data?.error || error?.data?.message || error?.message || error?.error || fallback;
};

const SectionHeader = ({ icon: Icon, eyebrow, title, description, accentClass, trailing }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm ${accentClass}`}>
          <Icon size={19} />
        </span>

        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25">{eyebrow}</p>

          <h2 className="mt-1 text-sm font-black tracking-[-0.02em] text-slate-900 dark:text-white/80">{title}</h2>

          <p className="mt-1 max-w-xl text-[8px] leading-4 text-slate-400 dark:text-white/25">{description}</p>
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

const MetricCard = ({ icon: Icon, label, value, description, accentClass }) => {
  return (
    <article className="group/metric relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09] dark:hover:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/metric:scale-105 ${accentClass}`}>
          <Icon size={17} />
        </span>

        <div className="min-w-0">
          <p className="text-lg font-black tabular-nums tracking-[-0.035em] text-slate-900 dark:text-white/85">{value}</p>

          <p className="mt-0.5 truncate text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">{label}</p>
        </div>
      </div>

      <p className="mt-3 border-t border-slate-200/70 pt-3 text-[8px] leading-4 text-slate-400 dark:border-white/[0.05] dark:text-white/25">{description}</p>
    </article>
  );
};

MetricCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
};

const GuidelineCard = ({ index, icon: Icon, title, description, accentClass }) => {
  return (
    <article className="group/guideline relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-white/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:hover:border-white/[0.09] dark:hover:bg-white/[0.02]">
      <div className="flex items-start gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover/guideline:scale-105 ${accentClass}`}>
          <Icon size={17} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[7px] font-semibold uppercase tracking-[0.1em] text-slate-400 dark:text-white/20">Guideline {index}</p>

              <h3 className="mt-1 text-[10px] font-bold text-slate-800 dark:text-white/70">{title}</h3>
            </div>

            <HiOutlineChevronRight className="mt-0.5 shrink-0 text-slate-300 transition-transform duration-300 group-hover/guideline:translate-x-1 dark:text-white/15" />
          </div>

          <p className="mt-2 text-[8px] leading-4 text-slate-400 dark:text-white/25">{description}</p>
        </div>
      </div>
    </article>
  );
};

GuidelineCard.propTypes = {
  index: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  accentClass: PropTypes.string.isRequired,
};

const PreviewSlot = ({ index, active }) => {
  return (
    <div
      className={`group/slot relative aspect-square overflow-hidden rounded-xl border transition-all duration-300 ${
        active
          ? "border-cyan-300/25 bg-cyan-500/[0.07] shadow-[0_8px_20px_rgba(6,182,212,0.06)] dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.035]"
          : "border-slate-200/70 bg-slate-100/45 dark:border-white/[0.05] dark:bg-white/[0.012]"
      }`}
    >
      <div className="flex h-full items-center justify-center">
        {active ? (
          <HiOutlinePhoto className="text-cyan-600/70 transition-transform duration-300 group-hover/slot:scale-110 dark:text-cyan-200/55" />
        ) : (
          <HiOutlinePlus className="text-slate-300 dark:text-white/15" />
        )}
      </div>

      <span className="absolute bottom-1 right-1 text-[6px] font-semibold tabular-nums text-slate-400 dark:text-white/20">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
};

PreviewSlot.propTypes = {
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

export const AssetConfigure = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [postLimitNo, setPostLimitNo] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { assetLimit, isLoading, loading } = useSelector((state) => state.assetlimit);

  const currentLimit = Number(assetLimit?.assetLimit ?? 0);

  const numericLimit = Number(postLimitNo);

  const isValidLimit = postLimitNo !== "" && /^[0-9]+$/.test(postLimitNo);

  const hasChanged = isValidLimit && numericLimit !== currentLimit;

  const proposedLimit = isValidLimit ? numericLimit : currentLimit;

  const difference = useMemo(() => {
    if (!isValidLimit) {
      return 0;
    }

    return numericLimit - currentLimit;
  }, [currentLimit, isValidLimit, numericLimit]);

  const pageLoading = Boolean(isLoading || loading);

  const activePreviewSlots = Math.min(Math.max(proposedLimit, 0), MAX_PREVIEW_SLOTS);

  const usageScalePercentage = Math.min(Math.max((proposedLimit / VISUAL_SCALE_MAX) * 100, 0), 100);

  const policyLevel = useMemo(() => {
    if (proposedLimit <= 5) {
      return {
        label: "Compact",
        description: "Suitable for projects with a small image gallery.",
        className: "border-cyan-300/20 bg-cyan-500/[0.05] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.03] dark:text-cyan-200/65",
      };
    }

    if (proposedLimit <= 15) {
      return {
        label: "Balanced",
        description: "A practical allowance for most portfolio projects.",
        className: "border-indigo-300/20 bg-indigo-500/[0.05] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/65",
      };
    }

    return {
      label: "Extended",
      description: "Designed for image-heavy projects and detailed galleries.",
      className: "border-emerald-300/20 bg-emerald-500/[0.05] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65",
    };
  }, [proposedLimit]);

  useEffect(() => {
    dispatch(getAssetsLimit());
  }, [dispatch]);

  const handleLimitChange = (event) => {
    const { value } = event.target;

    if (value === "" || /^[0-9]+$/.test(value)) {
      setPostLimitNo(value);
    }
  };

  const adjustLimit = (amount) => {
    const baseValue = isValidLimit ? numericLimit : currentLimit;

    const updatedValue = Math.max(0, baseValue + amount);

    setPostLimitNo(String(updatedValue));
  };

  const handleReset = () => {
    setPostLimitNo("");
  };

  const create = async (event) => {
    event.preventDefault();

    if (!isValidLimit) {
      toast.error("Please enter a valid whole number.");
      return;
    }

    if (!hasChanged) {
      toast.info("The entered limit is already active.");
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData = {
        assetLimit: numericLimit,
      };

      const resultAction = await dispatch(addAssetsLimit(requestData));

      if (addAssetsLimit.fulfilled.match(resultAction)) {
        toast.success(resultAction?.payload?.message || "Asset limit updated successfully.");

        setPostLimitNo("");

        await dispatch(getAssetsLimit());

        navigate("/assets-limit");
      } else {
        throw resultAction?.payload || resultAction?.error;
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-3 pb-8">
      {/* Page overview */}
      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/35 p-5 dark:border-white/[0.045] dark:bg-white/[0.012] sm:p-6">
          <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-indigo-500/[0.026] blur-[105px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-cyan-500/[0.018] blur-[105px]" />

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.018),transparent_45%,transparent_75%,rgba(6,182,212,0.012))]" />

          <div className="relative z-10">
            <BreadcrumbsComponent currentPage="Asset Limit" space={false} />

            <div className="mt-6 flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-[20px] border border-indigo-300/20 bg-indigo-500/[0.075] text-indigo-700 shadow-[0_14px_32px_rgba(79,70,229,0.09)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                  <HiOutlineAdjustmentsHorizontal size={24} />
                </span>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1.5 text-[7px] font-semibold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.03] dark:text-indigo-200/60">
                    <HiOutlineSparkles size={12} />
                    Upload configuration
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-white/90 sm:text-3xl">Asset Limit Control</h1>

                  <p className="mt-2 max-w-2xl text-[10px] leading-5 text-slate-500 dark:text-white/35">
                    Configure the maximum number of image assets that can be uploaded to each project while keeping project storage controlled and predictable.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:min-w-[570px]">
                <MetricCard
                  icon={HiOutlinePhoto}
                  label="Current limit"
                  value={pageLoading ? "—" : currentLimit}
                  description="The saved image allowance currently applied."
                  accentClass="border-cyan-300/20 bg-cyan-500/[0.08] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65"
                />

                <MetricCard
                  icon={HiOutlineCircleStack}
                  label="Preview limit"
                  value={pageLoading ? "—" : proposedLimit}
                  description="The live value displayed before saving."
                  accentClass="border-indigo-300/20 bg-indigo-500/[0.08] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.04] dark:text-indigo-200/65"
                />

                <MetricCard
                  icon={HiOutlineShieldCheck}
                  label="Policy status"
                  value="Active"
                  description="Upload protection is currently enabled."
                  accentClass="border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65"
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Configuration workspace */}
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,0.88fr)_minmax(460px,1.12fr)]">
        {/* Configuration editor */}
        <Wrapper className="overflow-hidden p-0">
          <div className="relative h-full overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/[0.018] blur-[90px]" />

            <div className="relative z-10">
              <SectionHeader
                icon={HiOutlineArchiveBox}
                eyebrow="Project policy"
                title="Configure Asset Limit"
                description="Enter a custom limit or choose one of the recommended presets."
                accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
                trailing={
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-500/[0.05] px-3 py-1.5 text-[8px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
                    Policy enabled
                  </span>
                }
              />

              <form onSubmit={create} className="mt-6">
                <label htmlFor="assetLimit" className="mb-2 block text-[9px] font-semibold text-slate-600 dark:text-white/45">
                  Maximum assets per project
                </label>

                <div className="flex items-stretch gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => adjustLimit(-1)}
                    aria-label="Decrease asset limit"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/55 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/30 hover:bg-amber-500/[0.05] hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/35 dark:hover:border-amber-300/[0.1] dark:hover:bg-amber-300/[0.035] dark:hover:text-amber-200/65"
                  >
                    <HiOutlineMinus size={17} />
                  </button>

                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute left-1 top-1 flex size-9 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/[0.08] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65 3xl:size-10">
                      <HiOutlineCircleStack size={15} />
                    </span>

                    <input
                      id="assetLimit"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      name="assetLimit"
                      value={postLimitNo}
                      onChange={handleLimitChange}
                      disabled={isSubmitting}
                      placeholder={`Current limit: ${currentLimit}`}
                      className={`${CommonClassForInput} !pl-12 !pr-20`}
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Images</span>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => adjustLimit(1)}
                    aria-label="Increase asset limit"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/55 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/30 hover:bg-emerald-500/[0.05] hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/35 dark:hover:border-emerald-300/[0.1] dark:hover:bg-emerald-300/[0.035] dark:hover:text-emerald-200/65"
                  >
                    <HiOutlinePlus size={17} />
                  </button>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-white/20">Quick presets</p>

                    <p className="text-[8px] text-slate-400 dark:text-white/20">Recommended limits</p>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_LIMITS.map((preset) => {
                      const isSelected = isValidLimit && numericLimit === preset;

                      return (
                        <button
                          key={preset}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setPostLimitNo(String(preset))}
                          className={`relative h-11 overflow-hidden rounded-xl border text-[9px] font-bold tabular-nums transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 ${
                            isSelected
                              ? "border-indigo-300/30 bg-indigo-500/[0.09] text-indigo-700 shadow-[0_8px_20px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.12] dark:bg-indigo-300/[0.05] dark:text-indigo-200/75"
                              : "border-slate-200/75 bg-white/50 text-slate-500 hover:border-indigo-300/30 hover:text-indigo-700 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/35 dark:hover:border-indigo-300/[0.1] dark:hover:bg-white/[0.02] dark:hover:text-indigo-200/65"
                          }`}
                        >
                          {isSelected && <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent dark:via-indigo-300/65" />}

                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`mt-5 overflow-hidden rounded-[20px] border ${
                    hasChanged
                      ? "border-cyan-300/20 bg-cyan-500/[0.045] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.025]"
                      : "border-slate-200/70 bg-slate-50/50 dark:border-white/[0.05] dark:bg-white/[0.012]"
                  }`}
                >
                  <div className="flex items-start gap-3 p-4">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl border ${
                        hasChanged
                          ? "border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65"
                          : "border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.04] dark:text-indigo-200/65"
                      }`}
                    >
                      {hasChanged ? <HiOutlineCheckBadge size={16} /> : <HiOutlineInformationCircle size={16} />}
                    </span>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-700 dark:text-white/55">
                        {isValidLimit ? (hasChanged ? `Limit will ${difference > 0 ? "increase" : "decrease"} by ${Math.abs(difference)}` : "This limit is already active") : "No unsaved changes"}
                      </p>

                      <p className="mt-1 text-[8px] leading-4 text-slate-400 dark:text-white/25">
                        {isValidLimit ? "The updated policy will apply to future project uploads." : "Enter a new number or select a preset to preview the change."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t border-slate-200/60 px-4 py-3 dark:border-white/[0.045]">
                    <div>
                      <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Current</p>

                      <p className="mt-1 text-xl font-black tabular-nums text-slate-900 dark:text-white/80">{currentLimit}</p>
                    </div>

                    <HiOutlineChevronRight className="text-slate-300 dark:text-white/15" />

                    <div className="text-right">
                      <p className="text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Proposed</p>

                      <p className="mt-1 text-xl font-black tabular-nums text-indigo-700 dark:text-indigo-200/70">{proposedLimit}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={isSubmitting || !postLimitNo}
                    onClick={handleReset}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white/55 px-4 text-[9px] font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 dark:border-white/[0.055] dark:bg-white/[0.014] dark:text-white/35 dark:hover:border-white/[0.09] dark:hover:bg-white/[0.02] dark:hover:text-white/60"
                  >
                    <HiOutlineArrowPath size={14} />
                    Reset
                  </button>

                  <button
                    type="submit"
                    disabled={!isValidLimit || !hasChanged || isSubmitting}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-500/[0.09] px-4 text-[9px] font-semibold text-indigo-700 shadow-[0_10px_24px_rgba(79,70,229,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500/[0.15] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.05] dark:text-indigo-200/75 dark:hover:bg-indigo-300/[0.08]"
                  >
                    {isSubmitting ? (
                      <>
                        <HiOutlineArrowPath className="animate-spin" />
                        Updating limit...
                      </>
                    ) : (
                      <>
                        <HiOutlineCheckBadge size={15} />
                        Save Asset Limit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Wrapper>

        {/* Live preview */}
        <Wrapper className="overflow-hidden p-0">
          <div className="relative flex h-full min-h-[500px] overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
            <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-cyan-500/[0.024] blur-[110px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-indigo-500/[0.018] blur-[110px]" />

            <div className="relative z-10 flex w-full flex-col">
              <SectionHeader
                icon={HiOutlinePhoto}
                eyebrow="Active configuration"
                title="Upload Capacity Preview"
                description="Review the current or proposed image allowance before saving."
                accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.09] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70"
                trailing={
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[8px] font-semibold ${policyLevel.className}`}>
                    <span className="size-1.5 rounded-full bg-current opacity-75 shadow-[0_0_8px_currentColor]" />
                    {policyLevel.label}
                  </span>
                }
              />

              <div className="mt-5 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[0.88fr_1.12fr]">
                {/* Main number visual */}
                <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[26px] border border-slate-200/70 bg-white/45 p-5 dark:border-white/[0.055] dark:bg-white/[0.014]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(6,182,212,0.09),transparent_58%)]" />

                  <div className="relative text-center">
                    <div className="relative mx-auto flex size-52 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-500/[0.035] shadow-[inset_0_0_70px_rgba(6,182,212,0.035),0_24px_60px_rgba(15,23,42,0.08)] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.02]">
                      <div className="absolute inset-3 rounded-full border border-dashed border-cyan-300/20 dark:border-cyan-300/[0.08]" />

                      <div className="absolute inset-7 rounded-full border border-cyan-300/10 dark:border-cyan-300/[0.045]" />

                      <div className="relative">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-500/[0.08] text-cyan-700 shadow-[0_10px_25px_rgba(6,182,212,0.08)] dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/70">
                          <HiOutlineCircleStack size={21} />
                        </span>

                        <p className="mt-4 text-7xl font-black tabular-nums tracking-[-0.08em] text-slate-950 dark:text-white/90">{pageLoading ? "—" : proposedLimit}</p>

                        <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-white/20">Images per project</p>
                      </div>
                    </div>

                    <div className="mx-auto mt-6 max-w-xs">
                      <div className="flex items-center justify-between text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">
                        <span>Capacity scale</span>
                        <span>{Math.round(usageScalePercentage)}%</span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.055]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 transition-[width] duration-500"
                          style={{
                            width: `${usageScalePercentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-4 text-[9px] leading-5 text-slate-500 dark:text-white/30">{policyLevel.description}</p>
                    </div>
                  </div>
                </div>

                {/* Gallery preview */}
                <div className="flex min-h-[320px] flex-col rounded-[26px] border border-slate-200/70 bg-white/45 p-5 dark:border-white/[0.055] dark:bg-white/[0.014]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-white/20">Gallery simulation</p>

                      <h3 className="mt-1 text-[11px] font-bold text-slate-800 dark:text-white/70">Project asset slots</h3>

                      <p className="mt-1 text-[8px] text-slate-400 dark:text-white/25">Visual preview of available image positions.</p>
                    </div>

                    <span className="rounded-full border border-slate-200/70 bg-slate-50/55 px-3 py-1.5 text-[8px] font-semibold text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                      {proposedLimit} slots
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-4 gap-2">
                    {Array.from({
                      length: MAX_PREVIEW_SLOTS,
                    }).map((_, index) => (
                      <PreviewSlot key={index} index={index} active={index < activePreviewSlots} />
                    ))}
                  </div>

                  {proposedLimit > MAX_PREVIEW_SLOTS && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-indigo-300/20 bg-indigo-500/[0.045] px-3 py-2.5 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.025]">
                      <span className="text-[8px] text-indigo-700 dark:text-indigo-200/55">Additional hidden slots</span>

                      <span className="text-[9px] font-black tabular-nums text-indigo-700 dark:text-indigo-200/70">+{proposedLimit - MAX_PREVIEW_SLOTS}</span>
                    </div>
                  )}

                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.012]">
                      <span className="flex size-8 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.04] dark:text-cyan-200/65">
                        <HiOutlinePhoto size={14} />
                      </span>

                      <p className="mt-3 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Counted type</p>

                      <p className="mt-1 text-[9px] font-bold text-slate-700 dark:text-white/55">Image assets</p>
                    </div>

                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/45 p-3 dark:border-white/[0.05] dark:bg-white/[0.012]">
                      <span className="flex size-8 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.04] dark:text-emerald-200/65">
                        <HiOutlineShieldCheck size={14} />
                      </span>

                      <p className="mt-3 text-[7px] font-semibold uppercase tracking-[0.09em] text-slate-400 dark:text-white/20">Applied scope</p>

                      <p className="mt-1 text-[9px] font-bold text-slate-700 dark:text-white/55">Every project</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>

      {/* Policy notice */}
      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[inherit] border border-amber-300/20 bg-amber-500/[0.035] p-4 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.02] sm:p-5">
          <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-amber-500/[0.04] blur-[75px]" />

          <div className="relative flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-500/[0.08] text-amber-700 dark:border-amber-300/[0.08] dark:bg-amber-300/[0.04] dark:text-amber-200/65">
              <HiOutlineExclamationTriangle size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-200/50">Important configuration behaviour</p>

              <p className="mt-1 text-[9px] leading-5 text-slate-600 dark:text-white/40">
                Reducing this limit does not remove previously uploaded images. It prevents additional uploads when a project has already reached or exceeded the newly configured allowance.
              </p>
            </div>
          </div>
        </div>
      </Wrapper>

      {/* Guidelines */}
      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/25 p-5 dark:border-white/[0.045] dark:bg-white/[0.008] sm:p-6">
          <div className="pointer-events-none absolute -right-24 -bottom-24 size-64 rounded-full bg-emerald-500/[0.014] blur-[90px]" />

          <div className="relative z-10">
            <SectionHeader
              icon={HiOutlineShieldCheck}
              eyebrow="Configuration guidance"
              title="Asset Limit Guidelines"
              description="Important rules and behaviour associated with this upload policy."
              accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.09] dark:bg-emerald-300/[0.04] dark:text-emerald-200/70"
              trailing={
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/55 px-3 py-1.5 text-[8px] font-semibold text-slate-500 dark:border-white/[0.055] dark:bg-white/[0.018] dark:text-white/35">
                  <HiOutlineChartBar size={13} />3 policy rules
                </span>
              }
            />

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <GuidelineCard
                index="01"
                icon={HiOutlineCircleStack}
                title="Maximum Capacity"
                description="The configured number defines the maximum quantity of image assets allowed inside each project."
                accentClass="border-indigo-300/20 bg-indigo-500/[0.07] text-indigo-700 dark:border-indigo-300/[0.08] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
              />

              <GuidelineCard
                index="02"
                icon={HiOutlineCloudArrowUp}
                title="Automatic Upload Protection"
                description="Once the project reaches its limit, the system prevents additional image uploads for that project."
                accentClass="border-emerald-300/20 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.035] dark:text-emerald-200/65"
              />

              <GuidelineCard
                index="03"
                icon={HiOutlinePhoto}
                title="Images Are Counted"
                description="Only image assets contribute to this limit. Other supported documents and resources are excluded."
                accentClass="border-cyan-300/20 bg-cyan-500/[0.07] text-cyan-700 dark:border-cyan-300/[0.08] dark:bg-cyan-300/[0.035] dark:text-cyan-200/65"
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

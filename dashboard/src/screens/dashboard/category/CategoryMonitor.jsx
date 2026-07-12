import { ChartNoAxesCombined, Target, TrendingUp } from "lucide-react";
import { Wrapper } from "@/routes";

/* ==========================================================================
   REUSABLE DARK CARD SURFACE
   ========================================================================== */

const baseCardClass = `
  group
  relative
  overflow-hidden
  border
  border-white/[0.055]
  !bg-[#101318]
  p-6
  shadow-[0_15px_36px_rgba(0,0,0,0.20)]
  transition-all
  duration-300
  hover:-translate-y-0.5
  hover:!bg-[#12161c]
  hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)]
`;

/* ==========================================================================
   CATEGORY MONITOR
   ========================================================================== */

export const CategoryMonitor = () => {
  return (
    <div className="my-3 space-y-3">
      {/* ================================================================
          MONTHLY PROGRESS
          ================================================================ */}

      <Wrapper
        className={`
          ${baseCardClass}
          hover:border-blue-300/[0.13]
        `}
      >
        {/* Restrained internal glows */}
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-blue-500/[0.025] blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:bg-blue-500/[0.04]" />

        <div className="pointer-events-none absolute -left-20 -top-24 h-60 w-60 rounded-full bg-violet-500/[0.02] blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:bg-violet-500/[0.032]" />

        {/* Neutral glass highlight */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_30%,transparent_72%,rgba(255,255,255,0.004))]" />

        {/* Inner border */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.015]" />

        {/* Top accent */}
        <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/25 to-transparent" />

        {/* Header */}
        <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-300/[0.11] bg-[linear-gradient(145deg,rgba(48,88,139,0.52),rgba(47,39,91,0.82))] text-blue-100/85 shadow-[0_9px_24px_rgba(49,76,141,0.18)]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

              <ChartNoAxesCombined className="relative z-10" size={18} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-white/90">Monthly Progress</h4>

              <p className="mt-0.5 text-[10px] font-medium text-white/28">Category goals and publishing performance</p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-300/[0.11] bg-blue-300/[0.045] px-2.5 py-1 text-[9px] font-semibold text-blue-200/70">
            <Target size={10} strokeWidth={2} />
            75% Complete
          </span>
        </div>

        {/* Progress information */}
        <div className="relative z-10 space-y-5">
          {/* Target */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-white/70">Monthly target</p>

                <p className="mt-0.5 text-[9px] text-white/25">15 of 20 categories completed</p>
              </div>

              <span className="text-[12px] font-bold tabular-nums text-blue-200/75">75%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full border border-white/[0.025] bg-black/25">
              <div
                className="relative h-full rounded-full bg-[linear-gradient(90deg,#356d91,#66579a)] shadow-[0_0_12px_rgba(77,103,160,0.22)]"
                style={{
                  width: "75%",
                }}
                role="progressbar"
                aria-label="Monthly target progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="75"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
              </div>
            </div>
          </div>

          {/* Published */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-white/70">Published this month</p>

                <p className="mt-0.5 text-[9px] text-white/25">12 categories are now active</p>
              </div>

              <span className="text-[12px] font-bold tabular-nums text-emerald-200/75">12</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full border border-white/[0.025] bg-black/25">
              <div
                className="relative h-full rounded-full bg-[linear-gradient(90deg,#34735f,#3e8a70)] shadow-[0_0_12px_rgba(52,128,100,0.20)]"
                style={{
                  width: "60%",
                }}
                role="progressbar"
                aria-label="Published categories this month"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="60"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3 text-[10px]">
          <span className="text-white/28">
            Monthly goal: <strong className="font-semibold text-white/48">20 categories</strong>
          </span>

          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-200/65">
            <TrendingUp size={11} strokeWidth={2} />
            +12% vs last month
          </span>
        </div>
      </Wrapper>
    </div>
  );
};

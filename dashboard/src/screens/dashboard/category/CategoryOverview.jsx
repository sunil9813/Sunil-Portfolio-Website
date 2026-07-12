import { FaExclamationTriangle } from "react-icons/fa";
import { CategoryActivityFeed } from "./CategoryActivityFeed";
import { CategoryMonitor } from "./CategoryMonitor";
import { CategoryStatsCards } from "./CategoryStatsCards";
import { CategoryTrendsChart } from "./CategoryTrendsChart";
import { PopularCategories } from "./PopularCategories";
import { Wrapper } from "@/routes";
import { CategoryInsightsPanel } from "./CategoryInsightsPanel";

export const CategoryOverview = () => {
  // Sample data for demonstration
  const totalCategories = 300;
  const publishedCategories = 60;
  const draftCategories = 135;
  const archivedCategories = 20;
  const publishedGrowth = 8.2;

  return (
    <>
      <CategoryStatsCards
        totalCategories={totalCategories}
        draftCategories={draftCategories}
        archivedCategories={archivedCategories}
        publishedCategories={publishedCategories}
        publishedGrowth={publishedGrowth}
      />

      <section className="flex justify-between gap-3">
        <div className="w-[70%]">
          <CategoryTrendsChart />
          <PopularCategories />
        </div>
        <div className="w-[30%]">
          {/* <Compoenets goes here /> */}

          <Wrapper className="group relative overflow-hidden border border-amber-400/[0.10] !bg-[#111419] p-6 shadow-[0_16px_38px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/[0.18] hover:shadow-[0_20px_46px_rgba(0,0,0,0.28)]">
            {/* Controlled internal lighting */}
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-amber-500/[0.035] opacity-70 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" />

            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-orange-500/[0.025] opacity-60 blur-3xl transition-all duration-700 group-hover:scale-110 group-hover:opacity-90" />

            {/* Subtle glass surface */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_30%,transparent_72%,rgba(255,255,255,0.005))]" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.015]" />

            {/* Top accent line */}
            <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent" />

            {/* Header */}
            <div className="relative z-10 mb-3 flex items-center gap-3">
              <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-300/[0.12] bg-[linear-gradient(145deg,rgba(133,89,26,0.42),rgba(48,35,20,0.82))] text-amber-200/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
                {/* Icon highlight */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

                <FaExclamationTriangle className="relative z-10" size={17} />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-semibold tracking-[-0.015em] text-white/90">Needs Attention</h4>

                <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-amber-200/45">Action required</p>
              </div>

              <span className="ml-auto rounded-full border border-amber-300/[0.10] bg-amber-300/[0.045] px-2.5 py-1 text-[9px] font-semibold text-amber-200/65">3 Pending</span>
            </div>

            {/* Message */}
            <p className="relative z-10 mb-4 text-xs leading-5 text-gray-600 dark:text-white/35">3 draft categories are currently waiting for review.</p>

            {/* Small status information */}
            <div className="relative z-10 mb-4 flex items-center justify-between rounded-xl border border-white/[0.045] bg-white/[0.022] px-3 py-2.5">
              <span className="text-[10px] font-medium text-white/30">Review status</span>

              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-200/65">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/75 shadow-[0_0_8px_rgba(251,191,36,0.25)]" />
                Awaiting approval
              </span>
            </div>

            {/* Action button */}
            <button
              type="button"
              className="relative z-10 flex w-full items-center justify-center overflow-hidden rounded-xl border border-amber-300/[0.14] bg-[linear-gradient(135deg,rgba(146,96,27,0.82),rgba(117,66,24,0.88))] px-4 py-2.5 text-xs font-semibold text-amber-50/90 shadow-[0_9px_24px_rgba(91,55,18,0.22)] transition-all duration-300 before:absolute before:inset-0 before:-translate-x-[120%] before:bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.12),transparent)] before:transition-transform before:duration-700 hover:-translate-y-0.5 hover:border-amber-300/[0.22] hover:brightness-110 hover:shadow-[0_12px_30px_rgba(91,55,18,0.3)] hover:before:translate-x-[120%] active:scale-[0.98]"
            >
              <span className="relative z-10">Review Now</span>
            </button>
          </Wrapper>

          <CategoryActivityFeed />
          <CategoryMonitor />
        </div>
      </section>
      <CategoryInsightsPanel />
    </>
  );
};

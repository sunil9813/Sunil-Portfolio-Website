import { ActiveReadingTimes } from "./ActiveReadingTimes";
import { BlogInsightsPanel } from "./BlogInsightsPanel";
import { BlogLeaderboard } from "./BlogLeaderboard";
import { BlogStatsCards } from "./BlogStatsCards";
import { BlogTrendsChart } from "./BlogTrendsChart";
import { BlogViewStats } from "./BlogViewStats";
import { CategoryAndTagCharts } from "./PopularPosts";
import { TotalLikesCard } from "./TotalLikesCard";
import { UserTypeViews } from "./UserTypeViews";
import PropTypes from "prop-types";
import { FaArrowDown, FaArrowUp, FaChartLine, FaEye } from "react-icons/fa";
import { Wrapper } from "@/routes";

const viewsTheme = {
  icon: "from-[#286f69] via-[#245f60] to-[#274d59]",
  iconBorder: "border-emerald-300/[0.12]",
  iconShadow: "shadow-[0_10px_24px_rgba(16,185,129,0.12)]",
  value: "text-emerald-700 dark:text-emerald-200/80",
  accent: "bg-[#579589]",
  glow: "bg-emerald-500/[0.025]",
  trend: "border-emerald-300/20 bg-emerald-500/[0.06] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.045] dark:text-emerald-200/70",
};

export const TotalViewsCard = ({ value = "87.2K", unit = "views", trend = "+15%", footerLeft = "All time", footerRight = "+15% YoY", compact = false }) => {
  const wrapperPadding = compact ? "p-4" : "p-6";
  const iconSize = compact ? "size-9" : "size-11";
  const iconInnerSize = compact ? 14 : 18;
  const valueSize = compact ? "text-2xl" : "text-4xl";
  const labelSize = compact ? "text-[8px]" : "text-[10px]";
  const trendSize = compact ? "text-[8px]" : "text-[9px]";
  const contentGap = compact ? "mb-2" : "mb-3";

  const trendValue = String(trend);
  const isPositive = trendValue.startsWith("+");
  const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <Wrapper className={`${wrapperPadding} group relative my-3 overflow-hidden transition-all duration-300 hover:shadow-[0_18px_44px_rgba(0,0,0,0.18)]`}>
      {/* Wrapper background remains unchanged */}

      {/* Subtle colour wash */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(16,185,129,0.018),transparent_38%,transparent_72%,rgba(6,182,212,0.012))] opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Background glows */}
      <div
        className={`pointer-events-none absolute ${compact ? "-bottom-16 -right-16 size-48" : "-bottom-24 -right-20 size-64"} ${
          viewsTheme.glow
        } rounded-full blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-emerald-500/[0.04]`}
      />

      <div
        className={`pointer-events-none absolute ${
          compact ? "-left-16 -top-16 size-48" : "-left-20 -top-24 size-64"
        } rounded-full bg-cyan-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-cyan-500/[0.025]`}
      />

      {/* Subtle top accent */}
      <div className="pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent" />

      {/* Header */}
      <div className={`relative z-10 flex items-start justify-between gap-3 ${contentGap}`}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={`${iconSize} relative flex items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br text-white/90 transition-all duration-300 group-hover:scale-105 ${viewsTheme.icon} ${viewsTheme.iconBorder} ${viewsTheme.iconShadow}`}
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-black/[0.08]" />

              <FaEye className="relative z-10" size={iconInnerSize} />
            </div>

            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-xl bg-emerald-400/[0.08] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div className="min-w-0">
            <h4 className={`truncate font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90 ${compact ? "text-xs" : "text-sm"}`}>Total Views</h4>

            <p className={`${labelSize} mt-0.5 flex items-center gap-1.5 text-gray-500 dark:text-white/30`}>
              <FaChartLine size={compact ? 8 : 9} className="text-emerald-600/60 dark:text-emerald-200/45" />
              Lifetime analytics
            </p>
          </div>
        </div>

        {/* Trend badge */}
        <span className={`${trendSize} inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold backdrop-blur-sm ${viewsTheme.trend}`}>
          <TrendIcon size={compact ? 8 : 9} />
          {trendValue}
        </span>
      </div>

      {/* Main value */}
      <div className="relative z-10 mb-3 transition-transform duration-300 group-hover:translate-x-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className={`${valueSize} font-extrabold leading-none tracking-[-0.045em] tabular-nums ${viewsTheme.value}`}>{value}</span>

          {unit && <span className={`${labelSize} font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-white/25`}>{unit}</span>}
        </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 mb-3">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className={`${labelSize} font-medium text-gray-500 dark:text-white/27`}>View performance</span>

          <span className={`${labelSize} font-semibold tabular-nums text-emerald-700 dark:text-emerald-200/65`}>75%</span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full border border-gray-200/50 bg-gray-200/70 dark:border-white/[0.025] dark:bg-black/25">
          <div
            className={`h-full w-3/4 rounded-full ${viewsTheme.accent} transition-all duration-700 group-hover:w-[78%]`}
            style={{
              boxShadow: "0 0 10px rgba(87,149,137,0.25)",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-3 flex items-center justify-between gap-2 border-t border-gray-200/70 pt-3 dark:border-white/[0.05]">
        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-200/60 bg-gray-50/55 px-2 py-1.5 dark:border-white/[0.04] dark:bg-white/[0.016]">
          <FaEye size={compact ? 8 : 9} className="shrink-0 text-emerald-600 dark:text-emerald-200/55" />

          <span className={`${labelSize} truncate text-gray-600 dark:text-white/35`}>{footerLeft}</span>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-200/60 bg-gray-50/55 px-2 py-1.5 dark:border-white/[0.04] dark:bg-white/[0.016]">
          <FaChartLine size={compact ? 8 : 9} className="shrink-0 text-emerald-600 dark:text-emerald-200/55" />

          <span className={`${labelSize} truncate font-medium text-gray-600 dark:text-white/35`}>{footerRight}</span>
        </div>
      </div>

      {/* Restrained hover shimmer */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
        <div className="absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.045] to-transparent transition-transform duration-1000 group-hover:translate-x-[400%]" />
      </div>
    </Wrapper>
  );
};

export const BlogOverview = () => {
  // Sample data for demonstration
  const totalPosts = 300;
  const publishedPosts = 60;
  const draftPosts = 135;
  const scheduledPosts = 20;
  const viewsGrowth = 8.2;

  return (
    <>
      <BlogStatsCards totalPosts={totalPosts} publishedPosts={publishedPosts} draftPosts={draftPosts} scheduledPosts={scheduledPosts} viewsGrowth={viewsGrowth} />
      <section className="flex justify-between gap-3">
        <div className="w-[70%]">
          {/* <CategoryTrendsChart /> */}

          <BlogTrendsChart />
          <BlogViewStats />
          <ActiveReadingTimes />
          <CategoryAndTagCharts />
        </div>
        <div className="w-[30%]">
          {/* <CategoryActivityFeed /> */}
          <BlogLeaderboard />
          <TotalViewsCard value="92.1K" trend="+18%" footerRight="+18% YoY" />

          <UserTypeViews />
          <TotalLikesCard />
        </div>
      </section>
      <BlogInsightsPanel />
    </>
  );
};

TotalViewsCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  footerLeft: PropTypes.string,
  footerRight: PropTypes.string,
  compact: PropTypes.bool,
};

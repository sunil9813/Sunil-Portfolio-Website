import { ActiveReadingTimes } from "./ActiveReadingTimes";
import { BlogInsightsPanel } from "./BlogInsightsPanel";
import { BlogLeaderboard } from "./BlogLeaderboard";
import { BlogStatsCards } from "./BlogStatsCards";
import { BlogTrendsChart } from "./BlogTrendsChart";
import { BlogViewStats } from "./BlogViewStats";
import { CategoryAndTagCharts } from "./PopularPosts";
import { TotalLikesCard } from "./TotalLikesCard";
import { UserTypeViews } from "./UserTypeViews";
import { Wrapper } from "@/utils/Router";

import { FaEye, FaArrowUp, FaArrowDown, FaChartLine, FaHeart } from "react-icons/fa";

// Fresh color palette for Total Views – emerald and cyan
const gradientMap = {
  views: "from-emerald-500 via-teal-500 to-cyan-500",
  likes: "from-rose-500 via-pink-500 to-fuchsia-500",
};

const textColorMap = {
  views: "text-emerald-600 dark:text-emerald-400",
  likes: "text-rose-600 dark:text-rose-400",
};

const glowMap = {
  views: "bg-emerald-500/10",
  likes: "bg-rose-500/10",
};

const accentColorMap = {
  views: "bg-emerald-500",
  likes: "bg-rose-500",
};

export const TotalViewsCard = ({ value = "87.2K", unit = "views", trend = "+15%", footerLeft = "All time", footerRight = "+15% YoY", compact = false }) => {
  // Size classes based on compact mode
  const wrapperPadding = compact ? "p-4" : "p-6";
  const iconSize = compact ? "size-8" : "size-10";
  const iconInnerSize = compact ? 14 : 18;
  const valueSize = compact ? "text-2xl" : "text-4xl";
  const labelSize = compact ? "text-[8px]" : "text-[10px]";
  const trendSize = compact ? "text-[8px]" : "text-[9px]";
  const glowSize = compact ? "w-48 h-48" : "w-64 h-64";
  const glowOffset = compact ? "-bottom-16 -right-16" : "-bottom-20 -right-20";
  const glowOffset2 = compact ? "-top-16 -left-16" : "-top-20 -left-20";

  // Determine trend direction
  const isPositive = trend.startsWith("+");
  const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <Wrapper className={`${wrapperPadding} relative overflow-hidden group my-3 hover:shadow-xl transition-all duration-300`}>
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 animate-pulse" />
      </div>

      {/* Floating glows with enhanced blur and animation */}
      <div className={`absolute ${glowOffset} ${glowSize} ${glowMap.views} rounded-full blur-3xl opacity-60 group-hover:scale-150 group-hover:opacity-80 transition-all duration-1000`} />
      <div className={`absolute ${glowOffset2} ${glowSize} ${glowMap.views} rounded-full blur-3xl opacity-60 group-hover:scale-150 group-hover:opacity-80 transition-all duration-1000`} />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
      </div>

      {/* Diagonal pattern overlay (refined) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="diagonal-views" patternUnits="userSpaceOnUse" width={compact ? 30 : 50} height={compact ? 30 : 50} patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2={compact ? 30 : 50} stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/30 dark:text-emerald-400/30" />
              <circle cx={compact ? 15 : 25} cy={compact ? 15 : 25} r={compact ? 1 : 2} fill="currentColor" className="text-emerald-500/20 dark:text-emerald-400/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-views)" />
        </svg>
      </div>

      {/* Header with enhanced styling */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`${iconSize} bg-gradient-to-br ${gradientMap.views} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <FaEye size={iconInnerSize} />
            </div>
            {/* Pulse ring effect */}
            <div className={`absolute -inset-0.5 ${accentColorMap.views} rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500 animate-pulse`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">Total Views</h4>
            <p className={`${labelSize} text-gray-500 dark:text-gray-400 flex items-center gap-1`}>
              <FaChartLine size={compact ? 8 : 10} className="opacity-50" />
              Lifetime analytics
            </p>
          </div>
        </div>

        {/* Trend badge with glass morphism */}
        <span
          className={`${trendSize} font-semibold px-2 py-1 rounded-full backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 ${textColorMap.views} flex items-center gap-1 shadow-sm`}
        >
          <TrendIcon size={compact ? 8 : 10} />
          {trend}
        </span>
      </div>

      {/* Value with enhanced styling */}
      <div className="mb-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10">
        <span className={`${valueSize} font-extrabold tracking-tight ${textColorMap.views} drop-shadow-lg`}>{value}</span>
        {unit && <span className={`${labelSize} text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider font-medium`}>{unit}</span>}
      </div>

      {/* Mini progress bar (visual interest) */}
      <div className="w-full h-1 bg-gray-200/50 dark:bg-gray-700/50 rounded-full mb-3 overflow-hidden">
        <div className={`h-full ${accentColorMap.views} rounded-full w-3/4 opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
      </div>

      {/* Footer with glass morphism */}
      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/30 flex justify-between text-[10px] backdrop-blur-sm rounded-b-lg relative z-10">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/30 dark:bg-gray-800/30">
          <FaEye size={compact ? 8 : 10} className="opacity-70 text-emerald-500 dark:text-emerald-400" />
          <span className={labelSize}>{footerLeft}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/30 dark:bg-gray-800/30">
          <FaChartLine size={compact ? 8 : 10} className="opacity-70 text-emerald-500 dark:text-emerald-400" />
          <span className={labelSize}>{footerRight}</span>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-100 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />
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

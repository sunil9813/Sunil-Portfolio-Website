import { useState } from "react";
import { Wrapper } from "@/utils/Router";
import { FaHeart, FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// Fresh color palette for Total Likes – red and crimson (custom hex codes)
const gradientMap = {
  likes: "from-[#DC2626] via-[#EF4444] to-[#F87171]",
};

const textColorMap = {
  likes: "text-[#DC2626] dark:text-[#F87171]",
};

const glowMap = {
  likes: "bg-[#DC2626]/10",
};

const accentColorMap = {
  likes: "bg-[#DC2626]",
};

// Sample trend data for the chart
const trendData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1350 },
  { month: "Mar", value: 1180 },
  { month: "Apr", value: 1420 },
  { month: "May", value: 1280 },
  { month: "Jun", value: 1510 },
  { month: "Jul", value: 1480 },
  { month: "Aug", value: 1620 },
  { month: "Sep", value: 1580 },
  { month: "Oct", value: 1710 },
  { month: "Nov", value: 1680 },
  { month: "Dec", value: 1840 },
];

export const TotalLikesCard = ({ value = "1,284", unit = "likes", trend = "+5%", footerLeft = "This month", footerRight = "Avg 42/day", compact = false }) => {
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
  const chartHeight = compact ? 100 : 160; // Large chart

  // Determine trend direction
  const isPositive = trend.startsWith("+");
  const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <Wrapper className={`${wrapperPadding} my-2 relative overflow-hidden group mb-3 hover:shadow-xl transition-all duration-300`}>
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-[#DC2626]/5 via-[#EF4444]/5 to-[#F87171]/5 animate-pulse" />
      </div>

      {/* Floating glows with enhanced blur and animation */}
      <div className={`absolute ${glowOffset} ${glowSize} ${glowMap.likes} rounded-full blur-3xl opacity-60 group-hover:scale-150 group-hover:opacity-80 transition-all duration-1000`} />
      <div className={`absolute ${glowOffset2} ${glowSize} ${glowMap.likes} rounded-full blur-3xl opacity-60 group-hover:scale-150 group-hover:opacity-80 transition-all duration-1000`} />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
      </div>

      {/* Diagonal pattern overlay (refined) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="diagonal-likes" patternUnits="userSpaceOnUse" width={compact ? 30 : 50} height={compact ? 30 : 50} patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2={compact ? 30 : 50} stroke="currentColor" strokeWidth="0.5" className="text-[#DC2626]/30 dark:text-[#F87171]/30" />
              <circle cx={compact ? 15 : 25} cy={compact ? 15 : 25} r={compact ? 1 : 2} fill="currentColor" className="text-[#DC2626]/20 dark:text-[#F87171]/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-likes)" />
        </svg>
      </div>

      {/* Header with enhanced styling */}
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`${iconSize} bg-gradient-to-br ${gradientMap.likes} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
            >
              <FaHeart size={iconInnerSize} />
            </div>
            {/* Pulse ring effect */}
            <div className={`absolute -inset-0.5 ${accentColorMap.likes} rounded-xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500 animate-pulse`} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#DC2626] dark:group-hover:text-[#F87171] transition-colors duration-300">Total Likes</h4>
            <p className={`${labelSize} text-gray-500 dark:text-gray-400 flex items-center gap-1`}>
              <FaChartLine size={compact ? 8 : 10} className="opacity-50" />
              Engagement metrics
            </p>
          </div>
        </div>

        {/* Trend badge with glass morphism */}
        <span
          className={`${trendSize} font-semibold px-2 py-1 rounded-full backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 border border-white/20 dark:border-gray-700/50 ${textColorMap.likes} flex items-center gap-1 shadow-sm`}
        >
          <TrendIcon size={compact ? 8 : 10} />
          {trend}
        </span>
      </div>

      {/* Value with enhanced styling */}
      <div className="mb-3 group-hover:translate-x-1 transition-transform duration-300 relative z-10">
        <span className={`${valueSize} font-extrabold tracking-tight ${textColorMap.likes} drop-shadow-lg`}>{value}</span>
        {unit && <span className={`${labelSize} text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider font-medium`}>{unit}</span>}
      </div>

      {/* Large Area Chart */}
      <div className="w-full h-[130px] mb-3 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="likesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#DC2626"
              strokeWidth={3}
              fill="url(#likesAreaGradient)"
              dot={false}
              activeDot={{ r: 6, fill: "#DC2626", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with glass morphism */}
      <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/30 flex justify-between text-[10px] backdrop-blur-sm rounded-b-lg relative z-10">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/30 dark:bg-gray-800/30">
          <FaHeart size={compact ? 8 : 10} className="opacity-70 text-[#DC2626] dark:text-[#F87171]" />
          <span className={labelSize}>{footerLeft}</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/30 dark:bg-gray-800/30">
          <FaChartLine size={compact ? 8 : 10} className="opacity-70 text-[#DC2626] dark:text-[#F87171]" />
          <span className={labelSize}>{footerRight}</span>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />
      </div>
    </Wrapper>
  );
};

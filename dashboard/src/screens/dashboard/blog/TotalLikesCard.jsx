import PropTypes from "prop-types";
import { FaArrowDown, FaArrowUp, FaChartLine, FaHeart } from "react-icons/fa";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Wrapper } from "@/routes";

/* ==========================================================================
   LIKES COLOUR THEME
   ========================================================================== */

const likesTheme = {
  gradient: "from-[#8F3F4A] via-[#A64D58] to-[#B85F68]",

  iconBorder: "border-rose-300/25 dark:border-rose-300/[0.12]",

  iconShadow: "shadow-[0_10px_26px_rgba(159,65,78,0.22)]",

  value: "text-rose-700 dark:text-rose-200/80",

  accent: "bg-[#A94F5D]",

  glow: "bg-rose-500/[0.035]",

  trendPositive: "border-emerald-300/25 bg-emerald-500/[0.07] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.045] dark:text-emerald-200/70",

  trendNegative: "border-rose-300/25 bg-rose-500/[0.07] text-rose-700 dark:border-rose-300/[0.10] dark:bg-rose-300/[0.045] dark:text-rose-200/70",

  chartStroke: "#B75B68",

  chartStart: "#B75B68",

  chartEnd: "#713A44",
};

/* ==========================================================================
   TREND DATA
   ========================================================================== */

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

/* ==========================================================================
   CHART TOOLTIP
   ========================================================================== */

const LikesTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0]?.payload;

  return (
    <div className="min-w-[150px] overflow-hidden rounded-xl border border-gray-200/80 bg-white/95 shadow-[0_16px_38px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#11151d]/95 dark:shadow-[0_20px_48px_rgba(0,0,0,0.42)]">
      <div className="h-px bg-gradient-to-r from-transparent via-rose-300/45 to-transparent" />

      <div className="p-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/25">{item?.month}</p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-[10px] text-gray-500 dark:text-white/35">Likes</span>

          <span className="text-[12px] font-bold tabular-nums text-rose-700 dark:text-rose-200/80">{Number(item?.value || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

LikesTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      payload: PropTypes.shape({
        month: PropTypes.string,
        value: PropTypes.number,
      }),
    }),
  ),
};

/* ==========================================================================
   TOTAL LIKES CARD
   ========================================================================== */

export const TotalLikesCard = ({ value = "1,284", unit = "likes", trend = "+5%", footerLeft = "This month", footerRight = "Avg 42/day", compact = false }) => {
  const wrapperPadding = compact ? "p-4" : "p-6";
  const iconSize = compact ? "size-9" : "size-11";
  const iconInnerSize = compact ? 14 : 18;
  const valueSize = compact ? "text-2xl" : "text-4xl";
  const labelSize = compact ? "text-[8px]" : "text-[10px]";
  const trendSize = compact ? "text-[8px]" : "text-[9px]";
  const chartHeight = compact ? "h-[100px]" : "h-[150px]";

  const trendValue = String(trend);
  const isPositive = trendValue.startsWith("+");
  const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

  return (
    <Wrapper className={`${wrapperPadding} group relative my-2 mb-3 overflow-hidden transition-all duration-300 hover:shadow-[0_18px_44px_rgba(0,0,0,0.20)]`}>
      {/* Wrapper background remains unchanged */}

      {/* Existing animated background retained */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-rose-500/[0.025] via-red-500/[0.035] to-pink-500/[0.025]" />
      </div>

      {/* Existing floating glows retained */}
      <div
        className={`pointer-events-none absolute ${compact ? "-bottom-16 -right-16 size-48" : "-bottom-24 -right-20 size-64"} ${
          likesTheme.glow
        } rounded-full opacity-60 blur-[85px] transition-all duration-1000 group-hover:scale-125 group-hover:bg-rose-500/[0.055] group-hover:opacity-90`}
      />

      <div
        className={`pointer-events-none absolute ${
          compact ? "-left-16 -top-16 size-48" : "-left-20 -top-24 size-64"
        } rounded-full bg-pink-500/[0.022] opacity-60 blur-[85px] transition-all duration-1000 group-hover:scale-125 group-hover:bg-pink-500/[0.04] group-hover:opacity-90`}
      />

      {/* Existing noise texture retained */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
      </div>

      {/* Existing diagonal pattern retained */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-20">
        <svg className="h-full w-full">
          <defs>
            <pattern id="diagonal-likes" patternUnits="userSpaceOnUse" width={compact ? 30 : 50} height={compact ? 30 : 50} patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2={compact ? 30 : 50} stroke="currentColor" strokeWidth="0.5" className="text-rose-500/25 dark:text-rose-300/20" />

              <circle cx={compact ? 15 : 25} cy={compact ? 15 : 25} r={compact ? 1 : 2} fill="currentColor" className="text-rose-500/20 dark:text-rose-300/15" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#diagonal-likes)" />
        </svg>
      </div>

      {/* Subtle top accent */}
      <div className="pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/25 to-transparent" />

      {/* Header */}
      <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <div
              className={`${iconSize} relative flex items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br text-white/90 transition-all duration-300 group-hover:scale-105 group-hover:rotate-2 ${likesTheme.gradient} ${likesTheme.iconBorder} ${likesTheme.iconShadow}`}
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.10]" />

              <FaHeart className="relative z-10" size={iconInnerSize} />
            </div>

            {/* Existing pulse effect retained */}
            <div className="pointer-events-none absolute -inset-1 -z-10 rounded-xl bg-rose-500/[0.10] opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <div className="min-w-0">
            <h4
              className={`truncate font-semibold tracking-[-0.015em] text-gray-900 transition-colors duration-300 dark:text-white/90 dark:group-hover:text-rose-200/80 ${
                compact ? "text-xs" : "text-sm"
              }`}
            >
              Total Likes
            </h4>

            <p className={`${labelSize} mt-0.5 flex items-center gap-1.5 text-gray-500 dark:text-white/30`}>
              <FaChartLine size={compact ? 8 : 9} className="text-rose-600/60 dark:text-rose-200/45" />
              Engagement metrics
            </p>
          </div>
        </div>

        {/* Trend badge */}
        <span
          className={`${trendSize} inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold shadow-sm backdrop-blur-sm ${
            isPositive ? likesTheme.trendPositive : likesTheme.trendNegative
          }`}
        >
          <TrendIcon size={compact ? 8 : 9} />

          {trendValue}
        </span>
      </div>

      {/* Value */}
      <div className="relative z-10 mb-3 transition-transform duration-300 group-hover:translate-x-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className={`${valueSize} font-extrabold leading-none tracking-[-0.045em] tabular-nums ${likesTheme.value}`}>{value}</span>

          {unit && <span className={`${labelSize} font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-white/25`}>{unit}</span>}
        </div>
      </div>

      {/* Existing area chart retained and enhanced */}
      <div className={`${chartHeight} relative z-10 mb-3 overflow-hidden rounded-2xl border border-rose-200/50 bg-rose-50/35 px-1 pt-2 dark:border-rose-300/[0.06] dark:bg-rose-400/[0.018]`}>
        <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/25 to-transparent" />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{
              top: 8,
              right: 2,
              left: 2,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="likesAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={likesTheme.chartStart} stopOpacity={0.38} />

                <stop offset="55%" stopColor={likesTheme.chartStart} stopOpacity={0.1} />

                <stop offset="100%" stopColor={likesTheme.chartEnd} stopOpacity={0} />
              </linearGradient>
            </defs>

            <Tooltip
              content={<LikesTooltip />}
              cursor={{
                stroke: "rgba(251,113,133,0.12)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              wrapperStyle={{
                outline: "none",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={likesTheme.chartStroke}
              strokeWidth={2.4}
              fill="url(#likesAreaGradient)"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: likesTheme.chartStroke,
                stroke: "rgba(255,255,255,0.60)",
                strokeWidth: 1.5,
              }}
              isAnimationActive
              animationDuration={750}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Existing footer backgrounds retained */}
      <div className="relative z-10 mt-2 flex items-center justify-between gap-2 border-t border-gray-200/60 pt-3 text-[10px] dark:border-white/[0.05]">
        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-rose-200/50 bg-rose-50/60 px-2 py-1.5 backdrop-blur-sm dark:border-rose-300/[0.055] dark:bg-rose-400/[0.025]">
          <FaHeart size={compact ? 8 : 9} className="shrink-0 text-rose-600 dark:text-rose-200/60" />

          <span className={`${labelSize} truncate text-gray-600 dark:text-white/35`}>{footerLeft}</span>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-rose-200/50 bg-rose-50/60 px-2 py-1.5 backdrop-blur-sm dark:border-rose-300/[0.055] dark:bg-rose-400/[0.025]">
          <FaChartLine size={compact ? 8 : 9} className="shrink-0 text-rose-600 dark:text-rose-200/60" />

          <span className={`${labelSize} truncate text-gray-600 dark:text-white/35`}>{footerRight}</span>
        </div>
      </div>

      {/* Existing shimmer retained */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
        <div className="absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.045] to-transparent transition-transform duration-1000 group-hover:translate-x-[400%]" />
      </div>
    </Wrapper>
  );
};

TotalLikesCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  footerLeft: PropTypes.string,
  footerRight: PropTypes.string,
  compact: PropTypes.bool,
};

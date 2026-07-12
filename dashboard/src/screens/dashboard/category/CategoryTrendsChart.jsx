import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaList } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wrapper } from "@/routes";

/* ==========================================================================
   MUTED DARK-THEME COLOURS
   ========================================================================== */

const colors = {
  total: {
    current: "#3D8293",
    soft: "#315F6B",
    glow: "rgba(61, 130, 147, 0.22)",
  },

  published: {
    current: "#42806E",
    soft: "#315F53",
    glow: "rgba(66, 128, 110, 0.20)",
  },

  draft: {
    current: "#9A7446",
    soft: "#705433",
    glow: "rgba(154, 116, 70, 0.20)",
  },

  archived: {
    current: "#74659A",
    soft: "#544A70",
    glow: "rgba(116, 101, 154, 0.20)",
  },
};

/*
 * Static classes are used so Tailwind keeps every colour
 * when the production build is generated.
 */
const COLOR_CLASSES = {
  total: {
    active: "border-cyan-300/[0.12] bg-cyan-300/[0.055] text-cyan-100/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",

    inactive: "border-transparent text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 dark:text-white/25 dark:hover:bg-white/[0.035] dark:hover:text-white/55",
  },

  published: {
    active: "border-emerald-300/[0.12] bg-emerald-300/[0.055] text-emerald-100/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",

    inactive: "border-transparent text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 dark:text-white/25 dark:hover:bg-white/[0.035] dark:hover:text-white/55",
  },

  draft: {
    active: "border-amber-300/[0.12] bg-amber-300/[0.055] text-amber-100/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",

    inactive: "border-transparent text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 dark:text-white/25 dark:hover:bg-white/[0.035] dark:hover:text-white/55",
  },

  archived: {
    active: "border-violet-300/[0.12] bg-violet-300/[0.055] text-violet-100/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",

    inactive: "border-transparent text-gray-600 hover:bg-gray-100/60 hover:text-gray-900 dark:text-white/25 dark:hover:bg-white/[0.035] dark:hover:text-white/55",
  },
};

const getSeriesLabel = (dataKey) => {
  switch (dataKey) {
    case "total":
      return "Total Categories";

    case "published":
      return "Published";

    case "draft":
      return "Draft";

    case "archived":
      return "Archived";

    default:
      return dataKey;
  }
};

/* ==========================================================================
   CUSTOM TOOLTIP
   ========================================================================== */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[245px] overflow-hidden rounded-[17px] border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#0d1117]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      {/* Muted top highlight */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

      <div className="p-3.5">
        {/* Tooltip header */}
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-cyan-300/[0.11] bg-[linear-gradient(145deg,rgba(39,102,116,0.32),rgba(18,24,32,0.88))] text-cyan-100/75 shadow-[0_8px_20px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),transparent_48%)]" />

            <FaList className="relative" size={14} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-gray-900 dark:text-white/90">{label}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.13em] text-gray-500 dark:text-white/25">Category performance</p>
          </div>
        </div>

        {/* Tooltip series */}
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div
              key={`${entry.dataKey}-${index}`}
              className="flex items-center justify-between gap-6 rounded-[11px] border border-gray-200/60 bg-gray-50/80 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: entry.color,
                    boxShadow: `0 0 8px ${entry.color}45`,
                  }}
                />

                <span className="truncate text-[10px] font-medium text-gray-600 dark:text-white/35">{getSeriesLabel(entry.dataKey)}</span>
              </div>

              <span className="shrink-0 text-[14px] font-bold tabular-nums tracking-[-0.02em] text-gray-900 dark:text-white/85">{Number(entry.value).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

/* ==========================================================================
   REAL-TIME DATA
   ========================================================================== */

const useRealTimeData = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((previousData) => {
        if (!previousData.length) {
          return previousData;
        }

        const updatedData = [...previousData];

        const lastIndex = updatedData.length - 1;

        updatedData[lastIndex] = {
          ...updatedData[lastIndex],

          total: Math.max(200, updatedData[lastIndex].total + Math.floor(Math.random() * 10) - 5),

          published: Math.max(30, updatedData[lastIndex].published + Math.floor(Math.random() * 5) - 2),

          draft: Math.max(120, updatedData[lastIndex].draft + Math.floor(Math.random() * 8) - 4),

          archived: Math.max(20, updatedData[lastIndex].archived + Math.floor(Math.random() * 5) - 2),
        };

        return updatedData;
      });
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);

  return data;
};

/* ==========================================================================
   INITIAL DATA
   ========================================================================== */

const generateCategoryData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return months.map((month, index) => ({
    month,

    total: 200 + Math.floor(Math.random() * 150),

    published: 30 + Math.floor(Math.random() * 40),

    draft: 150 + Math.floor(Math.random() * 50),

    archived: 20 + Math.floor(Math.random() * 20),

    timestamp: new Date(2024, index).getTime(),
  }));
};

/* ==========================================================================
   CATEGORY TREND CHART
   ========================================================================== */

export const CategoryTrendsChart = () => {
  const [showDraftTrend, setShowDraftTrend] = useState(true);

  const [showPublishedTrend, setShowPublishedTrend] = useState(true);

  const [showTotalTrend, setShowTotalTrend] = useState(true);

  const [showArchivedTrend, setShowArchivedTrend] = useState(false);

  const [chartType, setChartType] = useState("area");

  /*
   * Generates chart data only once.
   */
  const initialData = useMemo(() => generateCategoryData(), []);

  const yearlyData = useRealTimeData(initialData);

  const avgTotal = yearlyData.length ? Math.round(yearlyData.reduce((total, item) => total + item.total, 0) / yearlyData.length) : 0;

  const peakMonthData = [...yearlyData].sort((firstItem, secondItem) => secondItem.total - firstItem.total)[0];

  const peakMonth = peakMonthData?.month || "—";

  const axisTick = {
    fill: "#69717E",
    fontSize: 10,
    fontWeight: 500,
  };

  const chartMargin = {
    top: 14,
    right: 8,
    left: 0,
    bottom: 4,
  };

  const tooltipCursor = {
    stroke: "rgba(148,163,184,0.10)",
    strokeWidth: 1,
    strokeDasharray: "4 4",
  };

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Restrained background glow */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-cyan-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-cyan-500/[0.027]" />

      <div className="pointer-events-none absolute -left-20 -top-24 h-60 w-60 rounded-full bg-violet-500/[0.014] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-violet-500/[0.022]" />

      {/* Neutral glass surface */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_28%,transparent_72%,rgba(255,255,255,0.004))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/[0.09] bg-[linear-gradient(145deg,rgba(39,101,116,0.34),rgba(22,28,37,0.9))] text-cyan-100/75 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),transparent_48%)]" />

            <FaList className="relative" size={16} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Category Performance Analytics</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Real-time category trends</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Series visibility */}
          <div className="flex flex-wrap rounded-full border border-gray-200 bg-gray-50/60 p-1 dark:border-white/[0.055] dark:bg-black/15">
            <button
              type="button"
              onClick={() => setShowTotalTrend((current) => !current)}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-2 text-[10px] font-medium transition-all duration-300 ${
                showTotalTrend ? COLOR_CLASSES.total.active : COLOR_CLASSES.total.inactive
              }`}
            >
              {showTotalTrend ? <FaEye size={11} /> : <FaEyeSlash size={11} />}

              <span>Total</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPublishedTrend((current) => !current)}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-2 text-[10px] font-medium transition-all duration-300 ${
                showPublishedTrend ? COLOR_CLASSES.published.active : COLOR_CLASSES.published.inactive
              }`}
            >
              {showPublishedTrend ? <FaEye size={11} /> : <FaEyeSlash size={11} />}

              <span>Published</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDraftTrend((current) => !current)}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-2 text-[10px] font-medium transition-all duration-300 ${
                showDraftTrend ? COLOR_CLASSES.draft.active : COLOR_CLASSES.draft.inactive
              }`}
            >
              {showDraftTrend ? <FaEye size={11} /> : <FaEyeSlash size={11} />}

              <span>Draft</span>
            </button>

            <button
              type="button"
              onClick={() => setShowArchivedTrend((current) => !current)}
              className={`flex items-center gap-2 rounded-full border px-2.5 py-2 text-[10px] font-medium transition-all duration-300 ${
                showArchivedTrend ? COLOR_CLASSES.archived.active : COLOR_CLASSES.archived.inactive
              }`}
            >
              {showArchivedTrend ? <FaEye size={11} /> : <FaEyeSlash size={11} />}

              <span>Archived</span>
            </button>
          </div>

          {/* Chart type selector */}
          <div className="flex rounded-full border border-gray-200 bg-gray-50/60 p-1 dark:border-white/[0.055] dark:bg-black/15">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`rounded-full px-4 py-2 text-[10px] font-medium transition-all duration-300 ${
                chartType === "area"
                  ? "bg-gray-200/80 text-gray-900 shadow-sm dark:bg-white/[0.065] dark:text-white/80"
                  : "text-gray-600 hover:text-gray-900 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/50"
              }`}
            >
              Area
            </button>

            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`rounded-full px-4 py-2 text-[10px] font-medium transition-all duration-300 ${
                chartType === "line"
                  ? "bg-gray-200/80 text-gray-900 shadow-sm dark:bg-white/[0.065] dark:text-white/80"
                  : "text-gray-600 hover:text-gray-900 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/50"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Chart surface */}
      <div className="relative z-10 overflow-hidden rounded-[18px] border border-gray-200/60 bg-gray-50/40 px-1 pb-1 pt-3 dark:border-white/[0.045] dark:bg-black/[0.08]">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={yearlyData} margin={chartMargin}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.total.current} stopOpacity={0.22} />

                    <stop offset="55%" stopColor={colors.total.soft} stopOpacity={0.07} />

                    <stop offset="100%" stopColor={colors.total.soft} stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="publishedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.published.current} stopOpacity={0.2} />

                    <stop offset="55%" stopColor={colors.published.soft} stopOpacity={0.065} />

                    <stop offset="100%" stopColor={colors.published.soft} stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="draftGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.draft.current} stopOpacity={0.19} />

                    <stop offset="55%" stopColor={colors.draft.soft} stopOpacity={0.06} />

                    <stop offset="100%" stopColor={colors.draft.soft} stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="archivedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors.archived.current} stopOpacity={0.18} />

                    <stop offset="55%" stopColor={colors.archived.soft} stopOpacity={0.055} />

                    <stop offset="100%" stopColor={colors.archived.soft} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.06)" vertical={false} />

                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTick} height={30} dy={6} />

                <YAxis axisLine={false} tickLine={false} tick={axisTick} width={34} dx={-4} />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={tooltipCursor}
                  wrapperStyle={{
                    outline: "none",
                  }}
                />

                {showTotalTrend && (
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke={colors.total.current}
                    fill="url(#totalGradient)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4.5,
                      fill: colors.total.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Total Categories"
                  />
                )}

                {showPublishedTrend && (
                  <Area
                    type="monotone"
                    dataKey="published"
                    stroke={colors.published.current}
                    fill="url(#publishedGradient)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4.5,
                      fill: colors.published.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Published"
                  />
                )}

                {showDraftTrend && (
                  <Area
                    type="monotone"
                    dataKey="draft"
                    stroke={colors.draft.current}
                    fill="url(#draftGradient)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4.5,
                      fill: colors.draft.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Draft"
                  />
                )}

                {showArchivedTrend && (
                  <Area
                    type="monotone"
                    dataKey="archived"
                    stroke={colors.archived.current}
                    fill="url(#archivedGradient)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4.5,
                      fill: colors.archived.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Archived"
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={yearlyData} margin={chartMargin}>
                <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.06)" vertical={false} />

                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTick} height={30} dy={6} />

                <YAxis axisLine={false} tickLine={false} tick={axisTick} width={34} dx={-4} />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={tooltipCursor}
                  wrapperStyle={{
                    outline: "none",
                  }}
                />

                {showTotalTrend && (
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={colors.total.current}
                    strokeWidth={2.1}
                    dot={{
                      r: 2.1,
                      fill: colors.total.current,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 4.5,
                      fill: colors.total.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Total Categories"
                  />
                )}

                {showPublishedTrend && (
                  <Line
                    type="monotone"
                    dataKey="published"
                    stroke={colors.published.current}
                    strokeWidth={2.1}
                    dot={{
                      r: 2.1,
                      fill: colors.published.current,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 4.5,
                      fill: colors.published.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Published"
                  />
                )}

                {showDraftTrend && (
                  <Line
                    type="monotone"
                    dataKey="draft"
                    stroke={colors.draft.current}
                    strokeWidth={2.1}
                    dot={{
                      r: 2.1,
                      fill: colors.draft.current,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 4.5,
                      fill: colors.draft.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Draft"
                  />
                )}

                {showArchivedTrend && (
                  <Line
                    type="monotone"
                    dataKey="archived"
                    stroke={colors.archived.current}
                    strokeWidth={2.1}
                    dot={{
                      r: 2.1,
                      fill: colors.archived.current,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 4.5,
                      fill: colors.archived.current,
                      stroke: "rgba(255,255,255,0.5)",
                      strokeWidth: 1,
                    }}
                    animationDuration={700}
                    name="Archived"
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/27">
        <span>
          Peak month: <strong className="font-semibold text-gray-700 dark:text-white/48">{peakMonth}</strong>
        </span>

        <span>
          Avg. total: <strong className="font-semibold text-gray-700 dark:text-white/48">{avgTotal.toLocaleString()} categories</strong>
        </span>
      </div>
    </Wrapper>
  );
};

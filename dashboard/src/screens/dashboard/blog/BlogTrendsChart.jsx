import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaFileAlt } from "react-icons/fa";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wrapper } from "@/routes";

/* ==========================================================================
   MUTED DARK-THEME COLOURS
   ========================================================================== */

const colors = {
  total: {
    current: "#6C8FB2",
    gradientStart: "#6C8FB2",
    gradientEnd: "#3E5873",
    label: "Total Posts",
  },
  published: {
    current: "#60A088",
    gradientStart: "#60A088",
    gradientEnd: "#365F52",
    label: "Published",
  },
  draft: {
    current: "#B08858",
    gradientStart: "#B08858",
    gradientEnd: "#6E5132",
    label: "Drafts",
  },
  scheduled: {
    current: "#897BB3",
    gradientStart: "#897BB3",
    gradientEnd: "#554B75",
    label: "Scheduled",
  },
};

const toggleStyles = {
  total: {
    active: "border-blue-300/[0.11] bg-blue-300/[0.055] text-blue-700 dark:text-blue-200/75",
  },
  published: {
    active: "border-emerald-300/[0.11] bg-emerald-300/[0.055] text-emerald-700 dark:text-emerald-200/75",
  },
  draft: {
    active: "border-amber-300/[0.11] bg-amber-300/[0.055] text-amber-700 dark:text-amber-200/75",
  },
  scheduled: {
    active: "border-violet-300/[0.11] bg-violet-300/[0.055] text-violet-700 dark:text-violet-200/75",
  },
};

const inactiveToggleStyle = "border-transparent text-gray-500 hover:bg-gray-100/60 hover:text-gray-700 dark:text-white/25 dark:hover:bg-white/[0.025] dark:hover:text-white/50";

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const getSeriesDetails = (dataKey) => {
  return (
    colors[dataKey] || {
      current: "#94A3B8",
      label: dataKey,
    }
  );
};

/* ==========================================================================
   CUSTOM TOOLTIP
   ========================================================================== */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[250px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
      <div className="h-px bg-gradient-to-r from-transparent via-blue-300/35 to-violet-300/30" />

      <div className="p-3.5">
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-300/[0.11] bg-[linear-gradient(145deg,rgba(48,83,130,0.55),rgba(42,39,75,0.92))] text-blue-100/85">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaFileAlt className="relative" size={16} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white/88">{label}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-gray-500 dark:text-white/25">Blog performance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {payload.map((entry) => {
            const series = getSeriesDetails(entry.dataKey);

            return (
              <div key={entry.dataKey} className="rounded-xl border border-gray-200/60 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: series.current,
                      boxShadow: `0 0 7px ${series.current}45`,
                    }}
                  />

                  <span className="truncate text-[9px] font-medium text-gray-500 dark:text-white/30">{series.label}</span>
                </div>

                <p className="mt-2 text-lg font-bold leading-none tabular-nums text-gray-900 dark:text-white/80">{formatNumber(entry.value)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

/* ==========================================================================
   REAL-TIME DATA
   ========================================================================== */

const useRealTimeData = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setData((previousData) => {
        const updatedData = [...previousData];
        const lastIndex = updatedData.length - 1;

        if (lastIndex < 0) {
          return updatedData;
        }

        updatedData[lastIndex] = {
          ...updatedData[lastIndex],
          total: Math.max(50, updatedData[lastIndex].total + Math.floor(Math.random() * 3) - 1),
          published: Math.max(20, updatedData[lastIndex].published + Math.floor(Math.random() * 2) - 1),
          draft: Math.max(10, updatedData[lastIndex].draft + Math.floor(Math.random() * 2) - 1),
          scheduled: Math.max(5, updatedData[lastIndex].scheduled + Math.floor(Math.random() * 2) - 1),
          growthRate: Math.floor(Math.random() * 30) - 10,
        };

        return updatedData;
      });
    }, interval);

    return () => window.clearInterval(intervalId);
  }, [interval]);

  return data;
};

const generateBlogData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return months.map((month, index) => ({
    month,
    total: 50 + Math.floor(Math.random() * 30),
    published: 25 + Math.floor(Math.random() * 20),
    draft: 15 + Math.floor(Math.random() * 15),
    scheduled: 8 + Math.floor(Math.random() * 10),
    growthRate: Math.floor(Math.random() * 30) - 10,
    timestamp: new Date(2024, index).getTime(),
  }));
};

/* ==========================================================================
   VISIBILITY BUTTON
   ========================================================================== */

const TrendToggle = ({ label, series, isVisible, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isVisible}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-semibold transition-all duration-300 ${
        isVisible ? toggleStyles[series].active : inactiveToggleStyle
      }`}
    >
      {isVisible ? <FaEye size={10} /> : <FaEyeSlash size={10} />}

      <span>{label}</span>
    </button>
  );
};

TrendToggle.propTypes = {
  label: PropTypes.string.isRequired,
  series: PropTypes.oneOf(["total", "published", "draft", "scheduled"]).isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

/* ==========================================================================
   BLOG TRENDS CHART
   ========================================================================== */

export const BlogTrendsChart = () => {
  const initialData = useMemo(() => generateBlogData(), []);
  const yearlyData = useRealTimeData(initialData);

  const [showDraftTrend, setShowDraftTrend] = useState(true);
  const [showPublishedTrend, setShowPublishedTrend] = useState(true);
  const [showTotalTrend, setShowTotalTrend] = useState(true);
  const [showScheduledTrend, setShowScheduledTrend] = useState(true);
  const [chartType, setChartType] = useState("area");

  const { avgTotal, avgPublished } = useMemo(() => {
    if (!yearlyData.length) {
      return {
        avgTotal: 0,
        avgPublished: 0,
      };
    }

    return {
      avgTotal: Math.round(yearlyData.reduce((total, item) => total + item.total, 0) / yearlyData.length),
      avgPublished: Math.round(yearlyData.reduce((total, item) => total + item.published, 0) / yearlyData.length),
    };
  }, [yearlyData]);

  const chartCommonElements = (
    <>
      <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.07)" vertical={false} />

      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        height={32}
        dy={6}
        tick={{
          fill: "#707985",
          fontSize: 10,
          fontWeight: 500,
        }}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        width={34}
        dx={-3}
        tick={{
          fill: "#707985",
          fontSize: 9,
          fontWeight: 500,
        }}
      />

      <Tooltip
        content={<CustomTooltip />}
        cursor={{
          stroke: "rgba(148,163,184,0.10)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        }}
        wrapperStyle={{
          outline: "none",
        }}
      />
    </>
  );

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Subtle background glows */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-blue-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-blue-500/[0.026]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-violet-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-violet-500/[0.024]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-300/[0.10] bg-[linear-gradient(145deg,rgba(48,83,130,0.58),rgba(66,54,112,0.92))] text-blue-100/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaFileAlt className="relative" size={17} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Blog Performance Analytics</h4>

            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-[10px] text-gray-500 dark:text-white/27">Real-time post trends</p>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/[0.10] bg-emerald-300/[0.04] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-200/60">
                <span className="size-1 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.45)]" />
                Live
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Visibility controls */}
          <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-gray-200/70 bg-gray-50/45 p-1.5 dark:border-white/[0.05] dark:bg-white/[0.016]">
            <TrendToggle label="Total" series="total" isVisible={showTotalTrend} onClick={() => setShowTotalTrend((current) => !current)} />

            <TrendToggle label="Published" series="published" isVisible={showPublishedTrend} onClick={() => setShowPublishedTrend((current) => !current)} />

            <TrendToggle label="Drafts" series="draft" isVisible={showDraftTrend} onClick={() => setShowDraftTrend((current) => !current)} />

            <TrendToggle label="Scheduled" series="scheduled" isVisible={showScheduledTrend} onClick={() => setShowScheduledTrend((current) => !current)} />
          </div>

          {/* Chart type */}
          <div className="flex w-fit rounded-full border border-gray-200/70 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
            {["area", "line"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className={`rounded-full px-4 py-2 text-[9px] font-semibold capitalize transition-all ${
                  chartType === type ? "bg-white text-gray-900 shadow-sm dark:bg-white/[0.07] dark:text-white/80" : "text-gray-500 hover:text-gray-800 dark:text-white/27 dark:hover:text-white/55"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart panel */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-gray-200/70 bg-gray-50/50 px-2 pb-2 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.012)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/25 to-violet-300/20" />

        <div className="h-[310px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={yearlyData}
                margin={{
                  top: 18,
                  right: 10,
                  left: 0,
                  bottom: 2,
                }}
              >
                <defs>
                  {Object.entries(colors).map(([key, value]) => (
                    <linearGradient key={key} id={`${key}BlogGradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={value.gradientStart} stopOpacity={0.3} />
                      <stop offset="55%" stopColor={value.gradientEnd} stopOpacity={0.08} />
                      <stop offset="100%" stopColor={value.gradientEnd} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>

                {chartCommonElements}

                {showTotalTrend && (
                  <Area type="monotone" dataKey="total" stroke={colors.total.current} fill="url(#totalBlogGradient)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive />
                )}

                {showPublishedTrend && (
                  <Area type="monotone" dataKey="published" stroke={colors.published.current} fill="url(#publishedBlogGradient)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive />
                )}

                {showDraftTrend && (
                  <Area type="monotone" dataKey="draft" stroke={colors.draft.current} fill="url(#draftBlogGradient)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive />
                )}

                {showScheduledTrend && (
                  <Area type="monotone" dataKey="scheduled" stroke={colors.scheduled.current} fill="url(#scheduledBlogGradient)" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} isAnimationActive />
                )}
              </AreaChart>
            ) : (
              <LineChart
                data={yearlyData}
                margin={{
                  top: 18,
                  right: 10,
                  left: 0,
                  bottom: 2,
                }}
              >
                {chartCommonElements}

                {showTotalTrend && <Line type="monotone" dataKey="total" stroke={colors.total.current} strokeWidth={2.4} dot={false} activeDot={{ r: 4.5 }} isAnimationActive />}

                {showPublishedTrend && <Line type="monotone" dataKey="published" stroke={colors.published.current} strokeWidth={2.4} dot={false} activeDot={{ r: 4.5 }} isAnimationActive />}

                {showDraftTrend && <Line type="monotone" dataKey="draft" stroke={colors.draft.current} strokeWidth={2.4} dot={false} activeDot={{ r: 4.5 }} isAnimationActive />}

                {showScheduledTrend && <Line type="monotone" dataKey="scheduled" stroke={colors.scheduled.current} strokeWidth={2.4} dot={false} activeDot={{ r: 4.5 }} isAnimationActive />}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Average total: <strong className="font-semibold tabular-nums text-blue-700 dark:text-blue-200/65">{avgTotal} posts/month</strong>
        </span>

        <span>
          Average published: <strong className="font-semibold tabular-nums text-emerald-700 dark:text-emerald-200/65">{avgPublished} posts/month</strong>
        </span>
      </div>
    </Wrapper>
  );
};

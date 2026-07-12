import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Activity, BarChart3, CalendarDays, Filter, Rocket, Target, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wrapper } from "@/routes";
import { FilterDropdownbyDays } from "@/components/common/dropdown/CustomeDropDown";

/* ==========================================================================
   USER ANALYTICS DATA
   ========================================================================== */

const userInsightsData = [
  {
    month: "Jan",
    currentYear: {
      total: 152000,
      new: 12500,
      active: 124000,
    },
    lastYear: {
      total: 142000,
      new: 12500,
      active: 114000,
    },
    retention: 85.2,
    engagement: 72.4,
  },
  {
    month: "Feb",
    currentYear: {
      total: 155000,
      new: 16500,
      active: 128000,
    },
    lastYear: {
      total: 144000,
      new: 15000,
      active: 116000,
    },
    retention: 86.5,
    engagement: 73.8,
  },
  {
    month: "Mar",
    currentYear: {
      total: 158000,
      new: 18000,
      active: 130000,
    },
    lastYear: {
      total: 148000,
      new: 17000,
      active: 120000,
    },
    retention: 87.1,
    engagement: 74.5,
  },
  {
    month: "Apr",
    currentYear: {
      total: 162000,
      new: 19500,
      active: 134000,
    },
    lastYear: {
      total: 151000,
      new: 18000,
      active: 123000,
    },
    retention: 87.8,
    engagement: 75.2,
  },
  {
    month: "May",
    currentYear: {
      total: 165000,
      new: 21000,
      active: 138000,
    },
    lastYear: {
      total: 155000,
      new: 19000,
      active: 126000,
    },
    retention: 88.3,
    engagement: 76.1,
  },
  {
    month: "Jun",
    currentYear: {
      total: 168000,
      new: 22000,
      active: 142000,
    },
    lastYear: {
      total: 158000,
      new: 20000,
      active: 129000,
    },
    retention: 89,
    engagement: 76.8,
  },
  {
    month: "Jul",
    currentYear: {
      total: 172000,
      new: 23000,
      active: 145000,
    },
    lastYear: {
      total: 161000,
      new: 21000,
      active: 132000,
    },
    retention: 89.5,
    engagement: 77.4,
  },
  {
    month: "Aug",
    currentYear: {
      total: 175000,
      new: 24000,
      active: 148000,
    },
    lastYear: {
      total: 165000,
      new: 22000,
      active: 135000,
    },
    retention: 90.1,
    engagement: 78,
  },
  {
    month: "Sep",
    currentYear: {
      total: 178000,
      new: 25000,
      active: 151000,
    },
    lastYear: {
      total: 168000,
      new: 23000,
      active: 138000,
    },
    retention: 90.7,
    engagement: 78.7,
  },
  {
    month: "Oct",
    currentYear: {
      total: 182000,
      new: 26000,
      active: 155000,
    },
    lastYear: {
      total: 171000,
      new: 24000,
      active: 141000,
    },
    retention: 91.2,
    engagement: 79.3,
  },
  {
    month: "Nov",
    currentYear: {
      total: 185000,
      new: 27000,
      active: 158000,
    },
    lastYear: {
      total: 174000,
      new: 25000,
      active: 144000,
    },
    retention: 91.8,
    engagement: 80,
  },
  {
    month: "Dec",
    currentYear: {
      total: 188000,
      new: 28000,
      active: 162000,
    },
    lastYear: {
      total: 178000,
      new: 26000,
      active: 147000,
    },
    retention: 92.5,
    engagement: 80.8,
  },
];

/* ==========================================================================
   METRIC THEMES
   ========================================================================== */

const metricThemes = {
  total: {
    current: "#438A7B",
    light: "#68A998",
    previous: "#294F48",

    activeButton: "border-emerald-300/[0.13] bg-emerald-300/[0.055] text-emerald-200/75",

    iconBackground: "bg-[linear-gradient(145deg,rgba(40,105,83,0.58),rgba(24,57,48,0.90))]",

    iconBorder: "border-emerald-300/[0.11]",

    iconText: "text-emerald-100/85",

    accent: "via-emerald-300/25",
  },

  new: {
    current: "#706AA5",
    light: "#928BC2",
    previous: "#433F68",

    activeButton: "border-indigo-300/[0.13] bg-indigo-300/[0.055] text-indigo-200/75",

    iconBackground: "bg-[linear-gradient(145deg,rgba(77,68,137,0.58),rgba(42,37,78,0.90))]",

    iconBorder: "border-indigo-300/[0.11]",

    iconText: "text-indigo-100/85",

    accent: "via-indigo-300/25",
  },

  active: {
    current: "#A27A49",
    light: "#BD9561",
    previous: "#624B31",

    activeButton: "border-amber-300/[0.13] bg-amber-300/[0.055] text-amber-200/75",

    iconBackground: "bg-[linear-gradient(145deg,rgba(126,86,39,0.58),rgba(67,47,27,0.90))]",

    iconBorder: "border-amber-300/[0.11]",

    iconText: "text-amber-100/85",

    accent: "via-amber-300/25",
  },
};

/* ==========================================================================
   CARD THEMES
   ========================================================================== */

const analyticsCardThemes = {
  current: {
    value: "text-emerald-600 dark:text-emerald-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(38,105,82,0.58),rgba(24,58,48,0.90))]",

    iconBorder: "border-emerald-300/[0.11]",

    iconText: "text-emerald-100/85",

    badge: "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70",

    glow: "bg-emerald-500/[0.025]",

    accent: "via-emerald-300/25",

    hoverBorder: "hover:border-emerald-300/[0.13]",
  },

  previous: {
    value: "text-slate-600 dark:text-slate-200/80",

    iconBackground: "bg-[linear-gradient(145deg,rgba(75,87,103,0.58),rgba(39,45,56,0.90))]",

    iconBorder: "border-slate-300/[0.10]",

    iconText: "text-slate-200/80",

    badge: "border-slate-300/[0.10] bg-slate-300/[0.045] text-slate-600 dark:text-slate-300/65",

    glow: "bg-slate-500/[0.022]",

    accent: "via-slate-300/20",

    hoverBorder: "hover:border-slate-300/[0.12]",
  },

  growth: {
    value: "text-cyan-700 dark:text-cyan-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(39,95,117,0.58),rgba(25,52,67,0.90))]",

    iconBorder: "border-cyan-300/[0.11]",

    iconText: "text-cyan-100/85",

    badge: "border-cyan-300/[0.10] bg-cyan-300/[0.045] text-cyan-700 dark:text-cyan-200/70",

    glow: "bg-cyan-500/[0.025]",

    accent: "via-cyan-300/25",

    hoverBorder: "hover:border-cyan-300/[0.13]",
  },

  retention: {
    value: "text-violet-700 dark:text-violet-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(79,66,130,0.58),rgba(44,38,74,0.90))]",

    iconBorder: "border-violet-300/[0.11]",

    iconText: "text-violet-100/85",

    badge: "border-violet-300/[0.10] bg-violet-300/[0.045] text-violet-700 dark:text-violet-200/70",

    glow: "bg-violet-500/[0.025]",

    accent: "via-violet-300/25",

    hoverBorder: "hover:border-violet-300/[0.13]",
  },
};

const summaryCardThemes = {
  active: analyticsCardThemes.current,

  growth: analyticsCardThemes.growth,

  new: {
    value: "text-amber-700 dark:text-amber-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(126,85,38,0.58),rgba(67,46,26,0.90))]",

    iconBorder: "border-amber-300/[0.11]",

    iconText: "text-amber-100/85",

    badge: "border-amber-300/[0.10] bg-amber-300/[0.045] text-amber-700 dark:text-amber-200/70",

    glow: "bg-amber-500/[0.025]",

    accent: "via-amber-300/25",

    hoverBorder: "hover:border-amber-300/[0.13]",
  },
};

/* ==========================================================================
   SHARED INNER CARD STYLE
   ========================================================================== */

const analyticsCardClass = `
  group/card
  relative
  overflow-hidden
  rounded-2xl
  border
  border-gray-200/70
  bg-gray-50/65
  p-5
  shadow-[0_10px_28px_rgba(15,23,42,0.06)]
  transition-all
  duration-300
  hover:-translate-y-0.5
  hover:bg-white/80
  hover:shadow-[0_15px_34px_rgba(15,23,42,0.10)]
  dark:border-white/[0.055]
  dark:bg-white/[0.022]
  dark:shadow-[0_13px_32px_rgba(0,0,0,0.16)]
  dark:hover:bg-white/[0.035]
  dark:hover:shadow-[0_18px_42px_rgba(0,0,0,0.24)]
`;

/* ==========================================================================
   HELPERS
   ========================================================================== */

const metricLabels = {
  total: "Total Users",
  new: "New Users",
  active: "Active Users",
};

const formatCompactNumber = (value) => {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
};

const formatFullNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const calculateGrowth = (currentValue, previousValue) => {
  const current = Number(currentValue) || 0;

  const previous = Number(previousValue) || 0;

  if (previous === 0) {
    return 0;
  }

  return ((current - previous) / previous) * 100;
};

const formatSignedPercent = (value) => {
  const safeValue = Number(value) || 0;

  return `${safeValue > 0 ? "+" : ""}${safeValue.toFixed(1)}%`;
};

/* ==========================================================================
   TOOLTIP
   ========================================================================== */

const EnhancedTooltip = ({ active, payload, label, activeChart, compareMode, viewMode }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  const currentYearData = payload.find((item) => item.dataKey === "currentYear");

  const lastYearData = payload.find((item) => item.dataKey === "lastYear");

  const growthValue = Number(data.growthValue) || 0;

  const isPositive = growthValue >= 0;

  const theme = metricThemes[activeChart];

  return (
    <div className="min-w-[270px] overflow-hidden rounded-[18px] border border-white/[0.075] bg-[#10141b]/95 shadow-[0_26px_65px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${theme.current}A0,
            transparent
          )`,
        }}
      />

      <div className="p-4">
        {/* Tooltip header */}
        <div className="mb-3 flex items-center gap-3 border-b border-white/[0.055] pb-3">
          <div
            className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
            style={{
              color: theme.light,
              borderColor: `${theme.current}35`,

              background: `linear-gradient(
                145deg,
                ${theme.current}42,
                rgba(22,27,35,0.92)
              )`,
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

            <CalendarDays className="relative" size={16} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-white/90">{label}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.13em] text-white/25">{metricLabels[activeChart]}</p>
          </div>
        </div>

        {/* Comparison values */}
        {viewMode === "bar" && (
          <div className={`grid gap-2 ${compareMode ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-3">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: theme.current,

                    boxShadow: `0 0 8px ${theme.current}50`,
                  }}
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-white/28">Current year</span>
              </div>

              <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-white/88">{formatCompactNumber(currentYearData?.value ?? data.currentYear)}</p>
            </div>

            {compareMode && lastYearData && (
              <div className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor: theme.previous,
                    }}
                  />

                  <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-white/28">Last year</span>
                </div>

                <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-white/60">{formatCompactNumber(lastYearData.value)}</p>
              </div>
            )}
          </div>
        )}

        {/* Growth */}
        <div className="mt-2.5 rounded-xl border border-white/[0.045] bg-white/[0.025] p-3">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-medium text-white/35">
              <BarChart3 size={13} strokeWidth={2} />
              Year-over-year growth
            </span>

            <span className={`inline-flex items-center gap-1 text-[12px] font-bold ${isPositive ? "text-emerald-200/75" : "text-rose-200/75"}`}>
              {isPositive ? <TrendingUp size={13} strokeWidth={2} /> : <TrendingDown size={13} strokeWidth={2} />}

              {formatSignedPercent(growthValue)}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
            <div
              className={`h-full rounded-full ${isPositive ? "bg-[linear-gradient(90deg,#34735f,#4d967c)]" : "bg-[linear-gradient(90deg,#864355,#b05b70)]"}`}
              style={{
                width: `${Math.min(Math.abs(growthValue) * 5, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Retention and engagement */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.055] pt-3">
          <div>
            <span className="text-[9px] uppercase tracking-[0.08em] text-white/23">Retention</span>

            <div className="mt-1 flex items-center gap-1.5">
              <Target className="text-emerald-200/60" size={12} />

              <span className="text-[12px] font-semibold text-white/75">{data.retention}%</span>
            </div>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-[0.08em] text-white/23">Engagement</span>

            <div className="mt-1 flex items-center gap-1.5">
              <Activity className="text-violet-200/60" size={12} />

              <span className="text-[12px] font-semibold text-white/75">{data.engagement}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

EnhancedTooltip.propTypes = {
  active: PropTypes.bool,

  payload: PropTypes.arrayOf(PropTypes.object),

  label: PropTypes.string,

  activeChart: PropTypes.oneOf(["total", "new", "active"]).isRequired,

  compareMode: PropTypes.bool.isRequired,

  viewMode: PropTypes.oneOf(["bar", "growth"]).isRequired,
};

/* ==========================================================================
   METRIC BUTTON
   ========================================================================== */

const MetricButton = ({ activeChart, type, label, icon: Icon, onClick }) => {
  const isSelected = activeChart === type;

  const theme = metricThemes[type];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-semibold transition-all duration-300 ${
        isSelected ? theme.activeButton : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white/27 dark:hover:bg-white/[0.035] dark:hover:text-white/55"
      }`}
    >
      <Icon size={13} strokeWidth={2} />

      {label}
    </button>
  );
};

MetricButton.propTypes = {
  activeChart: PropTypes.string.isRequired,

  type: PropTypes.string.isRequired,

  label: PropTypes.string.isRequired,

  icon: PropTypes.elementType.isRequired,

  onClick: PropTypes.func.isRequired,
};

/* ==========================================================================
   MAIN ANALYTICS METRIC CARD
   ========================================================================== */

const AnalyticsMetricCard = ({ title, subtitle, value, badge, footerLeft, footerRight, icon: Icon, themeName, positive = false }) => {
  const theme = analyticsCardThemes[themeName];

  return (
    <div className={`${analyticsCardClass} ${theme.hoverBorder}`}>
      {/* Card glows */}
      <div
        className={`pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full opacity-60 blur-[72px] transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-90 ${theme.glow}`}
      />

      <div className={`pointer-events-none absolute -left-16 -top-20 size-40 rounded-full opacity-30 blur-[70px] transition-all duration-700 group-hover/card:opacity-50 ${theme.glow}`} />

      {/* Surface highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.025),transparent_35%,transparent_75%,rgba(255,255,255,0.005))]" />

      {/* Accent line */}
      <div className={`pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${theme.accent}`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-[0_8px_22px_rgba(0,0,0,0.20)] ${theme.iconBackground} ${theme.iconBorder} ${theme.iconText}`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

              <Icon className="relative" size={17} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h5 className="truncate text-[12px] font-semibold tracking-[-0.01em] text-gray-900 dark:text-white/88">{title}</h5>

              <p className="mt-0.5 truncate text-[9px] text-gray-500 dark:text-white/26">{subtitle}</p>
            </div>
          </div>

          <span className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] ${theme.badge}`}>{badge}</span>
        </div>

        {/* Main value */}
        <div className="mt-5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/20">Current result</span>

          <p className={`mt-1.5 text-[30px] font-extrabold leading-none tracking-[-0.045em] tabular-nums ${theme.value}`}>{value}</p>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-200/70 pt-3 text-[9px] dark:border-white/[0.05]">
          <span className="truncate text-gray-500 dark:text-white/28">{footerLeft}</span>

          <span className={`inline-flex shrink-0 items-center gap-1 font-semibold ${positive ? "text-emerald-600 dark:text-emerald-200/65" : "text-gray-700 dark:text-white/45"}`}>
            {positive && <TrendingUp size={10} strokeWidth={2} />}

            {footerRight}
          </span>
        </div>
      </div>
    </div>
  );
};

AnalyticsMetricCard.propTypes = {
  title: PropTypes.string.isRequired,

  subtitle: PropTypes.string.isRequired,

  value: PropTypes.string.isRequired,

  badge: PropTypes.string.isRequired,

  footerLeft: PropTypes.string.isRequired,

  footerRight: PropTypes.string.isRequired,

  icon: PropTypes.elementType.isRequired,

  themeName: PropTypes.oneOf(["current", "previous", "growth", "retention"]).isRequired,

  positive: PropTypes.bool,
};

/* ==========================================================================
   USER INSIGHTS
   ========================================================================== */

export const UserInsights = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [activeChart, setActiveChart] = useState("total");

  const [compareMode, setCompareMode] = useState(true);

  const [viewMode, setViewMode] = useState("bar");

  const chartData = useMemo(() => {
    return userInsightsData.map((item) => {
      const currentYear = item.currentYear[activeChart];

      const lastYear = item.lastYear[activeChart];

      const growthValue = calculateGrowth(currentYear, lastYear);

      return {
        month: item.month,
        currentYear,
        lastYear,

        growthValue: Number(growthValue.toFixed(1)),

        growthLabel: formatSignedPercent(growthValue),

        retention: item.retention,

        engagement: item.engagement,
      };
    });
  }, [activeChart]);

  const metrics = useMemo(() => {
    const calculateMetric = (metric) => {
      const current = userInsightsData.reduce((sum, item) => sum + item.currentYear[metric], 0);

      const previous = userInsightsData.reduce((sum, item) => sum + item.lastYear[metric], 0);

      return {
        current,
        previous,

        growth: calculateGrowth(current, previous),
      };
    };

    const averageRetention = userInsightsData.reduce((sum, item) => sum + item.retention, 0) / userInsightsData.length;

    const averageEngagement = userInsightsData.reduce((sum, item) => sum + item.engagement, 0) / userInsightsData.length;

    return {
      total: calculateMetric("total"),

      new: calculateMetric("new"),

      active: calculateMetric("active"),

      averageRetention,

      averageEngagement,
    };
  }, []);

  const selectedMetric = metrics[activeChart];

  const selectedTheme = metricThemes[activeChart];

  const difference = selectedMetric.current - selectedMetric.previous;

  const averageGrowth = chartData.reduce((sum, item) => sum + item.growthValue, 0) / chartData.length;

  const peakGrowth = Math.max(...chartData.map((item) => item.growthValue));

  return (
    <Wrapper className="group relative mb-3 overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Restrained decorative glows */}
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-72 rounded-full bg-teal-500/[0.018] blur-[90px] transition-all duration-700 group-hover:scale-110 group-hover:bg-teal-500/[0.026]" />

      <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-indigo-500/[0.014] blur-[90px] transition-all duration-700 group-hover:scale-110 group-hover:bg-indigo-500/[0.022]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-teal-300/[0.10] bg-[linear-gradient(145deg,rgba(35,103,96,0.48),rgba(48,42,87,0.90))] text-teal-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

            <Users className="relative" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Advanced User Analytics</h4>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/[0.09] bg-emerald-300/[0.04] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-200/60">
                <span className="size-1.5 rounded-full bg-emerald-400/75 shadow-[0_0_7px_rgba(52,211,153,0.35)]" />
                Live
              </span>
            </div>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Year-over-year user performance</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:flex-row">
          {/* Metric selector */}
          <div className="flex flex-wrap rounded-full border border-gray-200 bg-gray-50/60 p-1 dark:border-white/[0.055] dark:bg-black/15">
            <MetricButton activeChart={activeChart} type="total" label="Total" icon={Users} onClick={() => setActiveChart("total")} />

            <MetricButton activeChart={activeChart} type="new" label="New" icon={UserPlus} onClick={() => setActiveChart("new")} />

            <MetricButton activeChart={activeChart} type="active" label="Active" icon={Activity} onClick={() => setActiveChart("active")} />
          </div>

          {/* View mode selector */}
          <div className="flex rounded-full border border-gray-200 bg-gray-50/60 p-1 dark:border-white/[0.055] dark:bg-black/15">
            <button
              type="button"
              onClick={() => setViewMode("bar")}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
                viewMode === "bar"
                  ? "bg-gray-200/80 text-gray-900 shadow-sm dark:bg-white/[0.075] dark:text-white/82"
                  : "text-gray-600 hover:text-gray-900 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/52"
              }`}
            >
              Values
            </button>

            <button
              type="button"
              onClick={() => setViewMode("growth")}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
                viewMode === "growth"
                  ? "bg-gray-200/80 text-gray-900 shadow-sm dark:bg-white/[0.075] dark:text-white/82"
                  : "text-gray-600 hover:text-gray-900 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/52"
              }`}
            >
              Growth
            </button>
          </div>

          {/* Compare button */}
          <button
            type="button"
            onClick={() => setCompareMode((current) => !current)}
            aria-pressed={compareMode}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold transition-all duration-300 ${
              compareMode
                ? "border-blue-300/[0.13] bg-blue-300/[0.05] text-blue-700 dark:text-blue-200/70"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-white/[0.055] dark:bg-black/15 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/52"
            }`}
          >
            <Filter size={12} strokeWidth={2} />

            {compareMode ? "Comparing" : "Compare"}
          </button>
        </div>
      </div>

      {/* Analytics cards */}
      <div className="relative z-10 mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsMetricCard
          title="Current Year"
          subtitle={metricLabels[activeChart]}
          value={formatCompactNumber(selectedMetric.current)}
          badge="Current"
          footerLeft="Difference vs last year"
          footerRight={`+${formatCompactNumber(difference)}`}
          icon={CalendarDays}
          themeName="current"
          positive
        />

        <AnalyticsMetricCard
          title="Last Year"
          subtitle="Comparison baseline"
          value={formatCompactNumber(selectedMetric.previous)}
          badge="Baseline"
          footerLeft="Previous annual result"
          footerRight={formatFullNumber(selectedMetric.previous)}
          icon={CalendarDays}
          themeName="previous"
        />

        <AnalyticsMetricCard
          title="Average Growth"
          subtitle="Monthly YoY average"
          value={formatSignedPercent(averageGrowth)}
          badge="Growth"
          footerLeft="Peak monthly growth"
          footerRight={formatSignedPercent(peakGrowth)}
          icon={TrendingUp}
          themeName="growth"
          positive={averageGrowth >= 0}
        />

        <AnalyticsMetricCard
          title="Avg Retention"
          subtitle="User retention rate"
          value={`${metrics.averageRetention.toFixed(1)}%`}
          badge="Healthy"
          footerLeft="Average engagement"
          footerRight={`${metrics.averageEngagement.toFixed(1)}%`}
          icon={Target}
          themeName="retention"
        />
      </div>

      {/* Chart surface */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-gray-200/70 bg-gray-50/55 px-2 pb-1 pt-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.012)]">
        <div className="pointer-events-none absolute inset-x-6 top-5 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent dark:via-white/[0.035]" />

        <div className="h-[410px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barSize={34}
              barGap={7}
              margin={{
                top: 30,
                right: 12,
                left: 2,
                bottom: 4,
              }}
            >
              <defs>
                <linearGradient id="currentUserGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedTheme.light} stopOpacity={0.96} />

                  <stop offset="52%" stopColor={selectedTheme.current} stopOpacity={0.82} />

                  <stop offset="100%" stopColor={selectedTheme.current} stopOpacity={0.38} />
                </linearGradient>

                <linearGradient id="previousUserGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedTheme.previous} stopOpacity={0.65} />

                  <stop offset="100%" stopColor={selectedTheme.previous} stopOpacity={0.2} />
                </linearGradient>

                <linearGradient id="growthUserGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5BA187" stopOpacity={0.94} />

                  <stop offset="100%" stopColor="#34705D" stopOpacity={0.38} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.065)" vertical={false} />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#707985",
                  fontSize: 10,
                  fontWeight: 500,
                }}
                dy={7}
                height={34}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={46}
                tick={{
                  fill: "#707985",
                  fontSize: 10,
                  fontWeight: 500,
                }}
                tickFormatter={(value) => (viewMode === "growth" ? `${value}%` : formatCompactNumber(value))}
              />

              <Tooltip
                content={<EnhancedTooltip activeChart={activeChart} compareMode={compareMode} viewMode={viewMode} />}
                cursor={{
                  fill: "rgba(148,163,184,0.045)",
                  radius: 10,
                }}
                wrapperStyle={{
                  outline: "none",
                }}
              />

              {viewMode === "bar" ? (
                <>
                  <Bar dataKey="currentYear" name="Current Year" fill="url(#currentUserGradient)" radius={[9, 9, 3, 3]} animationDuration={700} animationEasing="ease-out">
                    {chartData.map((item, index) => {
                      const isActive = activeIndex === index;

                      const isDimmed = activeIndex !== null && !isActive;

                      return (
                        <Cell
                          key={`current-${item.month}`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                          opacity={isDimmed ? 0.34 : isActive ? 1 : 0.9}
                          style={{
                            filter: isActive ? `drop-shadow(0 9px 14px ${selectedTheme.current}35)` : "none",

                            transition: "opacity 200ms ease",
                          }}
                        />
                      );
                    })}

                    <LabelList dataKey="growthLabel" position="top" fill="#619B83" fontSize={9} fontWeight={600} />
                  </Bar>

                  {compareMode && (
                    <Bar dataKey="lastYear" name="Last Year" fill="url(#previousUserGradient)" radius={[9, 9, 3, 3]} animationDuration={700} animationEasing="ease-out">
                      {chartData.map((item, index) => {
                        const isActive = activeIndex === index;

                        const isDimmed = activeIndex !== null && !isActive;

                        return (
                          <Cell key={`previous-${item.month}`} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} opacity={isDimmed ? 0.18 : isActive ? 0.82 : 0.6} />
                        );
                      })}
                    </Bar>
                  )}

                  <Legend
                    verticalAlign="bottom"
                    height={34}
                    iconType="circle"
                    iconSize={7}
                    formatter={(value) => <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">{value}</span>}
                  />
                </>
              ) : (
                <Bar dataKey="growthValue" name="YoY Growth" fill="url(#growthUserGradient)" radius={[9, 9, 3, 3]} animationDuration={700} animationEasing="ease-out">
                  {chartData.map((item, index) => {
                    const isActive = activeIndex === index;

                    const isDimmed = activeIndex !== null && !isActive;

                    return (
                      <Cell
                        key={`growth-${item.month}`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        opacity={isDimmed ? 0.32 : isActive ? 1 : 0.9}
                        style={{
                          filter: isActive ? "drop-shadow(0 9px 14px rgba(63,137,102,0.25))" : "none",
                        }}
                      />
                    );
                  })}

                  <LabelList dataKey="growthLabel" position="top" fill="#68A38A" fontSize={9} fontWeight={600} />
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/27">
        <span>
          Year-over-year growth: <strong className="font-semibold text-emerald-600 dark:text-emerald-200/65">{formatSignedPercent(selectedMetric.growth)}</strong>
        </span>

        <span>
          Average engagement: <strong className="font-semibold text-gray-700 dark:text-white/48">{metrics.averageEngagement.toFixed(1)}%</strong>
        </span>
      </div>
    </Wrapper>
  );
};

/* ==========================================================================
   USER INSIGHTS SUMMARY CARD
   ========================================================================== */

const SummaryCard = ({ title, value, change, changeLabel, icon: Icon, rightItems, themeName }) => {
  const theme = summaryCardThemes[themeName];

  const changeValue = Number.parseFloat(change) || 0;

  const isPositive = changeValue >= 0;

  return (
    <div className={`${analyticsCardClass} ${theme.hoverBorder}`}>
      {/* Card lighting */}
      <div
        className={`pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full opacity-60 blur-[72px] transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-90 ${theme.glow}`}
      />

      <div className={`pointer-events-none absolute -left-16 -top-20 size-40 rounded-full opacity-30 blur-[70px] transition-all duration-700 group-hover/card:opacity-50 ${theme.glow}`} />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.025),transparent_35%,transparent_75%,rgba(255,255,255,0.005))]" />

      <div className={`pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${theme.accent}`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-[0_8px_22px_rgba(0,0,0,0.20)] ${theme.iconBackground} ${theme.iconBorder} ${theme.iconText}`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

              <Icon className="relative" size={17} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h5 className="truncate text-[12px] font-semibold tracking-[-0.01em] text-gray-900 dark:text-white/88">{title}</h5>

              <p className="mt-0.5 truncate text-[9px] text-gray-500 dark:text-white/26">{changeLabel}</p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-semibold ${
              isPositive
                ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70"
                : "border-rose-300/[0.10] bg-rose-300/[0.045] text-rose-700 dark:text-rose-200/70"
            }`}
          >
            {isPositive ? <TrendingUp size={9} strokeWidth={2} /> : <TrendingDown size={9} strokeWidth={2} />}

            {isPositive ? "+" : ""}
            {change}
          </span>
        </div>

        {/* Value */}
        <div className="mt-5">
          <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/20">Current result</span>

          <p className={`mt-1.5 text-[30px] font-extrabold leading-none tracking-[-0.045em] tabular-nums ${theme.value}`}>{value}</p>
        </div>

        {/* Footer data */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-200/70 pt-3 dark:border-white/[0.05]">
          {rightItems.map((item) => (
            <div key={item.label}>
              <span className="block text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/21">{item.label}</span>

              <span className={`mt-1 block text-[10px] font-semibold ${item.change >= 0 ? "text-emerald-600 dark:text-emerald-200/62" : "text-rose-600 dark:text-rose-200/62"}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,

  value: PropTypes.string.isRequired,

  change: PropTypes.string.isRequired,

  changeLabel: PropTypes.string.isRequired,

  icon: PropTypes.elementType.isRequired,

  rightItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,

      value: PropTypes.string.isRequired,

      change: PropTypes.number.isRequired,
    }),
  ).isRequired,

  themeName: PropTypes.oneOf(["active", "growth", "new"]).isRequired,
};

/* ==========================================================================
   USER INSIGHTS SUMMARY
   ========================================================================== */

export const UserInsightsSummary = () => {
  const summaryCards = [
    {
      title: "Active Users",
      value: "162k",
      change: "10.2%",
      changeLabel: "Compared with last year",

      icon: Users,
      themeName: "active",

      rightItems: [
        {
          label: "Last year",
          value: "147k",
          change: 10.2,
        },
        {
          label: "YoY growth",
          value: "+15k",
          change: 10.2,
        },
      ],
    },

    {
      title: "Growth Rate",
      value: "12.5%",
      change: "3.2%",
      changeLabel: "Compared with last year",

      icon: TrendingUp,
      themeName: "growth",

      rightItems: [
        {
          label: "Last year",
          value: "9.3%",
          change: 3.2,
        },
        {
          label: "YoY change",
          value: "+3.2%",
          change: 3.2,
        },
      ],
    },

    {
      title: "New Users",
      value: "28k",
      change: "7.7%",
      changeLabel: "Compared with last year",

      icon: Rocket,
      themeName: "new",

      rightItems: [
        {
          label: "Last year",
          value: "26k",
          change: 7.7,
        },
        {
          label: "YoY growth",
          value: "+2k",
          change: 7.7,
        },
      ],
    },
  ];

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Restrained background lighting */}
      <div className="pointer-events-none absolute -bottom-28 -right-24 size-72 rounded-full bg-orange-500/[0.016] blur-[90px] transition-all duration-700 group-hover:scale-110 group-hover:bg-orange-500/[0.024]" />

      <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-amber-500/[0.014] blur-[90px] transition-all duration-700 group-hover:scale-110 group-hover:bg-amber-500/[0.022]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-300/[0.10] bg-[linear-gradient(145deg,rgba(126,82,38,0.50),rgba(67,47,27,0.90))] text-amber-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

            <Users className="relative" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">User Insights</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Comprehensive user analysis</p>
          </div>
        </div>

        <FilterDropdownbyDays name="visibility" />
      </div>

      {/* Summary cards */}
      <div className="relative z-10 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>
    </Wrapper>
  );
};

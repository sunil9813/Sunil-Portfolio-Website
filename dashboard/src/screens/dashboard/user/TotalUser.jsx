import PropTypes from "prop-types";
import { ChartNoAxesCombined, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FilterDropdownbyDays } from "@/components/common/dropdown/CustomeDropDown";
import { Wrapper } from "@/routes";

/* ==========================================================================
   MINI CHART DATA
   ========================================================================== */

const increasingData = [
  { value: 2500 },
  { value: 3600 },
  { value: 2550 },
  { value: 5700 },
  { value: 2650 },
  { value: 800 },
  { value: 2750 },
  { value: 2900 },
  { value: 4850 },
  { value: 3000 },
  { value: 2950 },
  { value: 7200 },
];

const decreasingData = [
  { value: 220 },
  { value: 210 },
  { value: 315 },
  { value: 200 },
  { value: 205 },
  { value: 90 },
  { value: 195 },
  { value: 80 },
  { value: 5 },
  { value: 170 },
  { value: 75 },
  { value: 60 },
];

/* ==========================================================================
   YEARLY USER DATA
   ========================================================================== */

const yearlyData = [
  { month: "Jan", total: 400, new: 400 },
  { month: "Feb", total: 600, new: 480 },
  { month: "Mar", total: 100, new: 520 },
  { month: "Apr", total: 200, new: 490 },
  { month: "May", total: 450, new: 210 },
  { month: "Jun", total: 200, new: 495 },
  { month: "Jul", total: 100, new: 185 },
  { month: "Aug", total: 350, new: 170 },
  { month: "Sep", total: 300, new: 360 },
  { month: "Oct", total: 100, new: 455 },
  { month: "Nov", total: 300, new: 450 },
  { month: "Dec", total: 500, new: 440 },
];

/* ==========================================================================
   COLOUR THEMES
   ========================================================================== */

const metricThemes = {
  total: {
    line: "#4C8B78",
    lineLight: "#6DAA96",

    value: "text-emerald-700 dark:text-emerald-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(39,105,82,0.58),rgba(24,58,48,0.90))]",

    iconBorder: "border-emerald-300/[0.11]",

    iconText: "text-emerald-100/85",

    badge: "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70",

    glow: "bg-emerald-500/[0.028]",

    accent: "via-emerald-300/25",

    hoverBorder: "hover:border-emerald-300/[0.14]",
  },

  new: {
    line: "#9B5969",
    lineLight: "#BC7384",

    value: "text-rose-700 dark:text-rose-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(120,54,72,0.58),rgba(67,32,45,0.90))]",

    iconBorder: "border-rose-300/[0.11]",

    iconText: "text-rose-100/85",

    badge: "border-rose-300/[0.10] bg-rose-300/[0.045] text-rose-700 dark:text-rose-200/70",

    glow: "bg-rose-500/[0.028]",

    accent: "via-rose-300/25",

    hoverBorder: "hover:border-rose-300/[0.14]",
  },
};

const chartColors = {
  total: {
    stroke: "#7466A2",
    light: "#9487BE",
  },

  new: {
    stroke: "#438796",
    light: "#67A5B2",
  },
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

/* ==========================================================================
   OVERVIEW METRIC CARD
   ========================================================================== */

const OverviewMetricCard = ({ type, title, subtitle, value, change, data, icon: Icon }) => {
  const theme = metricThemes[type];
  const isPositive = change >= 0;

  return (
    <div
      className={`
        group/card
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-200/70
        bg-gray-50/60
        p-5
        shadow-[0_10px_28px_rgba(15,23,42,0.06)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-white/80
        hover:shadow-[0_16px_36px_rgba(15,23,42,0.10)]
        dark:border-white/[0.055]
        dark:bg-white/[0.022]
        dark:shadow-[0_14px_34px_rgba(0,0,0,0.16)]
        dark:hover:bg-white/[0.035]
        dark:hover:shadow-[0_19px_42px_rgba(0,0,0,0.24)]
        ${theme.hoverBorder}
      `}
    >
      {/* Muted card glows */}
      <div
        className={`pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full opacity-60 blur-[72px] transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-90 ${theme.glow}`}
      />

      <div className={`pointer-events-none absolute -left-16 -top-20 size-40 rounded-full opacity-30 blur-[70px] transition-all duration-700 group-hover/card:opacity-50 ${theme.glow}`} />

      {/* Surface lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.025),transparent_34%,transparent_75%,rgba(255,255,255,0.004))]" />

      {/* Top accent */}
      <div className={`pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${theme.accent}`} />

      <div className="relative z-10 grid min-h-[200px] grid-cols-1 gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(160px,1.15fr)] sm:items-center">
        {/* Metric information */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 sm:block">
            <div
              className={`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border shadow-[0_8px_22px_rgba(0,0,0,0.20)] ${theme.iconBackground} ${theme.iconBorder} ${theme.iconText}`}
            >
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

              <Icon className="relative" size={18} strokeWidth={1.9} />
            </div>

            <span className={`rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] sm:hidden ${theme.badge}`}>{isPositive ? "Growing" : "Declining"}</span>
          </div>

          <p className="mt-4 text-[10px] font-medium text-gray-500 dark:text-white/27">{subtitle}</p>

          <h3 className="mt-1 text-[13px] font-semibold text-gray-900 dark:text-white/88">{title}</h3>

          <p className={`mt-2 text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums ${theme.value}`}>{value}</p>

          <div className="mt-4 flex items-center gap-2 text-[10px]">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 font-semibold ${
                isPositive
                  ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70"
                  : "border-rose-300/[0.10] bg-rose-300/[0.045] text-rose-700 dark:text-rose-200/70"
              }`}
            >
              {isPositive ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />}
              {Math.abs(change)}%
            </span>

            <span className="text-gray-500 dark:text-white/27">vs last year</span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="relative h-[145px] min-w-0 overflow-hidden rounded-xl border border-gray-200/60 bg-white/45 dark:border-white/[0.04] dark:bg-black/[0.08]">
          <div className="pointer-events-none absolute inset-x-5 top-4 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent dark:via-white/[0.04]" />

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 18,
                right: 12,
                left: 12,
                bottom: 12,
              }}
            >
              <defs>
                <linearGradient id={`${type}LineGradient`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={theme.line} stopOpacity={0.5} />

                  <stop offset="100%" stopColor={theme.lineLight} stopOpacity={1} />
                </linearGradient>
              </defs>

              <Line
                type="monotone"
                dataKey="value"
                stroke={`url(#${type}LineGradient)`}
                strokeWidth={2.25}
                dot={false}
                activeDot={false}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>

          <span className={`absolute right-3 top-3 hidden rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.07em] sm:block ${theme.badge}`}>
            {isPositive ? "Growing" : "Declining"}
          </span>
        </div>
      </div>
    </div>
  );
};

OverviewMetricCard.propTypes = {
  type: PropTypes.oneOf(["total", "new"]).isRequired,

  title: PropTypes.string.isRequired,

  subtitle: PropTypes.string.isRequired,

  value: PropTypes.string.isRequired,

  change: PropTypes.number.isRequired,

  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,

  icon: PropTypes.elementType.isRequired,
};

/* ==========================================================================
   YEARLY TOOLTIP
   ========================================================================== */

const YearlyTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[230px] overflow-hidden rounded-[17px] border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.50)]">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-300/35 to-cyan-300/30" />

      <div className="p-3.5">
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.11] bg-[linear-gradient(145deg,rgba(76,67,137,0.42),rgba(28,48,65,0.90))] text-violet-100/80">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

            <ChartNoAxesCombined className="relative" size={15} strokeWidth={1.9} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white/90">{label}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-white/25">Monthly performance</p>
          </div>
        </div>

        <div className="space-y-1.5">
          {payload.map((entry) => {
            const isTotal = entry.dataKey === "total";

            return (
              <div
                key={entry.dataKey}
                className="flex items-center justify-between gap-6 rounded-xl border border-gray-200/60 bg-gray-50/80 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      backgroundColor: isTotal ? chartColors.total.stroke : chartColors.new.stroke,

                      boxShadow: `0 0 8px ${isTotal ? chartColors.total.stroke : chartColors.new.stroke}45`,
                    }}
                  />

                  <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">{isTotal ? "Total Users" : "New Users"}</span>
                </div>

                <span className="text-[13px] font-bold tabular-nums text-gray-900 dark:text-white/82">{formatNumber(entry.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

YearlyTooltip.propTypes = {
  active: PropTypes.bool,

  payload: PropTypes.arrayOf(PropTypes.object),

  label: PropTypes.string,
};

/* ==========================================================================
   OVERVIEW USER
   ========================================================================== */

export const OverviewUser = () => {
  return (
    <>
      <Wrapper className="group relative overflow-hidden p-6">
        {/* Wrapper background is intentionally unchanged */}

        {/* Restrained decorative lighting */}
        <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-emerald-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-emerald-500/[0.024]" />

        <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-indigo-500/[0.014] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-indigo-500/[0.022]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

        {/* Header */}
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-300/[0.10] bg-[linear-gradient(145deg,rgba(37,103,81,0.50),rgba(46,42,82,0.90))] text-emerald-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

              <Users className="relative" size={18} strokeWidth={1.9} />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">User Overview</h4>

              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Customer growth and acquisition</p>
            </div>
          </div>

          <FilterDropdownbyDays name="visibility" />
        </div>

        {/* Overview cards */}
        <div className="relative z-10 mt-5 grid grid-cols-1 gap-3 xl:grid-cols-2">
          <OverviewMetricCard type="total" title="Total Customers" subtitle="All registered customers" value="320k" change={36.8} data={increasingData} icon={Users} />

          <OverviewMetricCard type="new" title="New Customers" subtitle="Recently acquired customers" value="45k" change={-12.5} data={decreasingData} icon={UserPlus} />
        </div>
      </Wrapper>

      <YearlyUserTrends />
    </>
  );
};

/* ==========================================================================
   YEARLY USER TRENDS
   ========================================================================== */

export const YearlyUserTrends = () => {
  return (
    <Wrapper className="group relative mt-3 overflow-hidden p-6">
      {/* Wrapper background is intentionally unchanged */}

      {/* Restrained decorative glows */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-violet-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-violet-500/[0.027]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-cyan-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-cyan-500/[0.025]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.10] bg-[linear-gradient(145deg,rgba(77,67,137,0.52),rgba(30,66,79,0.90))] text-violet-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

            <ChartNoAxesCombined className="relative" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Yearly User Trends</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Monthly customer performance</p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/[0.10] bg-emerald-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-200/65">
          <span className="size-1.5 rounded-full bg-emerald-400/75 shadow-[0_0_7px_rgba(52,211,153,0.32)]" />
          Updated
        </span>
      </div>

      {/* Chart surface */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-gray-200/70 bg-gray-50/55 px-2 pb-1 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.012)]">
        <div className="pointer-events-none absolute inset-x-6 top-4 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent dark:via-white/[0.035]" />

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={yearlyData}
              margin={{
                top: 20,
                right: 10,
                left: 0,
                bottom: 4,
              }}
            >
              <defs>
                <linearGradient id="totalUserGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.total.light} stopOpacity={0.28} />

                  <stop offset="55%" stopColor={chartColors.total.stroke} stopOpacity={0.08} />

                  <stop offset="100%" stopColor={chartColors.total.stroke} stopOpacity={0} />
                </linearGradient>

                <linearGradient id="newUserGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.new.light} stopOpacity={0.26} />

                  <stop offset="55%" stopColor={chartColors.new.stroke} stopOpacity={0.075} />

                  <stop offset="100%" stopColor={chartColors.new.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.06)" vertical={false} />

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
                tick={{
                  fill: "#707985",
                  fontSize: 9,
                  fontWeight: 500,
                }}
                tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
                width={32}
                dx={-3}
              />

              <Tooltip
                content={<YearlyTooltip />}
                cursor={{
                  stroke: "rgba(148,163,184,0.10)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                wrapperStyle={{
                  outline: "none",
                }}
              />

              <Area
                type="monotone"
                dataKey="total"
                name="Total Users"
                stroke={chartColors.total.stroke}
                strokeWidth={2.2}
                fill="url(#totalUserGradient)"
                dot={false}
                activeDot={{
                  r: 4.5,
                  fill: chartColors.total.stroke,
                  stroke: "rgba(255,255,255,0.55)",
                  strokeWidth: 1,
                }}
                isAnimationActive
                animationDuration={750}
                animationEasing="ease-out"
              />

              <Area
                type="monotone"
                dataKey="new"
                name="New Users"
                stroke={chartColors.new.stroke}
                strokeWidth={2.2}
                fill="url(#newUserGradient)"
                dot={false}
                activeDot={{
                  r: 4.5,
                  fill: chartColors.new.stroke,
                  stroke: "rgba(255,255,255,0.55)",
                  strokeWidth: 1,
                }}
                isAnimationActive
                animationDuration={750}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor: chartColors.total.stroke,

              boxShadow: `0 0 7px ${chartColors.total.stroke}40`,
            }}
          />

          <span>
            Total users: <strong className="font-semibold text-gray-700 dark:text-white/48">3.8M</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor: chartColors.new.stroke,

              boxShadow: `0 0 7px ${chartColors.new.stroke}40`,
            }}
          />

          <span>
            New users: <strong className="font-semibold text-gray-700 dark:text-white/48">4.2K average/month</strong>
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

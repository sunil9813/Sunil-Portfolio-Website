import PropTypes from "prop-types";
import { useState } from "react";
import { FaArrowDown, FaArrowUp, FaChartLine } from "react-icons/fa";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wrapper } from "@/routes";

/* ==========================================================================
   CHART DATA
   ========================================================================== */

const monthlyData = [
  { month: "Jan", views: 425000 },
  { month: "Feb", views: 388000 },
  { month: "Mar", views: 452000 },
  { month: "Apr", views: 489000 },
  { month: "May", views: 523000 },
  { month: "Jun", views: 568000 },
  { month: "Jul", views: 612000 },
  { month: "Aug", views: 658000 },
  { month: "Sep", views: 695000 },
  { month: "Oct", views: 742000 },
  { month: "Nov", views: 798000 },
  { month: "Dec", views: 856000 },
];

const quarterlyData = [
  { quarter: "Q1", views: 1265000 },
  { quarter: "Q2", views: 1580000 },
  { quarter: "Q3", views: 1965000 },
  { quarter: "Q4", views: 2396000 },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

/* ==========================================================================
   CUSTOM TOOLTIP
   ========================================================================== */

const ViewsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value || 0;

  return (
    <div className="min-w-[200px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
      <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-rose-300/30" />

      <div className="p-3.5">
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-300/[0.11] bg-[linear-gradient(145deg,rgba(130,75,38,0.58),rgba(78,43,45,0.92))] text-orange-100/85">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaChartLine className="relative" size={15} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{label}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-gray-500 dark:text-white/25">Blog traffic</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 rounded-xl border border-gray-200/60 bg-gray-50/75 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
          <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">Total views</span>

          <span className="text-[13px] font-bold tabular-nums text-orange-700 dark:text-orange-200/80">{formatNumber(value)}</span>
        </div>
      </div>
    </div>
  );
};

ViewsTooltip.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
    }),
  ),
};

/* ==========================================================================
   TOGGLE BUTTON
   ========================================================================== */

const ToggleButton = ({ active, children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-[9px] font-semibold transition-all duration-200 ${
        active
          ? "bg-white text-gray-900 shadow-sm dark:bg-white/[0.07] dark:text-white/80"
          : "text-gray-500 hover:bg-gray-100/60 hover:text-gray-800 dark:text-white/27 dark:hover:bg-white/[0.025] dark:hover:text-white/55"
      }`}
    >
      {children}
    </button>
  );
};

ToggleButton.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

/* ==========================================================================
   BLOG VIEW STATISTICS
   ========================================================================== */

export const BlogViewStats = () => {
  const [timeframe, setTimeframe] = useState("yearly");
  const [viewType, setViewType] = useState("monthly");

  const formattedTotal = "7.2m";
  const trendPercentage = 24.8;
  const isTrendPositive = trendPercentage > 0;

  const chartData = viewType === "monthly" ? monthlyData : quarterlyData;

  const dataKey = viewType === "monthly" ? "month" : "quarter";

  const avgMonthly = "600k";
  const bestMonth = "Dec";
  const quarterlyGrowth = "+32%";

  return (
    <Wrapper className="group relative my-3 overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Restrained decorative lighting */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-rose-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-rose-500/[0.026]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-orange-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-orange-500/[0.024]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-orange-300/[0.10] bg-[linear-gradient(145deg,rgba(130,75,38,0.58),rgba(92,46,63,0.92))] text-orange-100/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaChartLine className="relative" size={17} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Blog Views</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Annual traffic performance</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Monthly / Quarterly */}
          <div className="flex rounded-full border border-gray-200/70 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
            <ToggleButton active={viewType === "monthly"} onClick={() => setViewType("monthly")}>
              Monthly
            </ToggleButton>

            <ToggleButton active={viewType === "quarterly"} onClick={() => setViewType("quarterly")}>
              Quarterly
            </ToggleButton>
          </div>

          {/* Year selector */}
          <div className="flex rounded-full border border-gray-200/70 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
            <ToggleButton active={timeframe === "yearly"} onClick={() => setTimeframe("yearly")}>
              2024
            </ToggleButton>

            <ToggleButton active={timeframe === "lastYear"} onClick={() => setTimeframe("lastYear")}>
              2023
            </ToggleButton>
          </div>
        </div>
      </div>

      {/* Main statistics */}
      <div className="relative z-10 mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/20">Total annual views</p>

          <div className="mt-2 flex items-end gap-3">
            <span className="text-4xl font-extrabold leading-none tracking-[-0.045em] text-gray-900 dark:text-white">{formattedTotal}</span>

            <span
              className={`mb-0.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${
                isTrendPositive
                  ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70"
                  : "border-rose-300/[0.10] bg-rose-300/[0.045] text-rose-700 dark:text-rose-200/70"
              }`}
            >
              {isTrendPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}
              {trendPercentage}%
            </span>
          </div>

          <p className="mt-2 text-[10px] text-gray-500 dark:text-white/27">Compared with the previous year</p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-300/[0.10] bg-orange-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-orange-700 dark:text-orange-200/65">
          <span className="size-1.5 rounded-full bg-orange-400/75 shadow-[0_0_7px_rgba(251,146,60,0.32)]" />
          Growing traffic
        </span>
      </div>

      {/* Chart panel */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-gray-200/70 bg-gray-50/50 px-2 pb-2 pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.012)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/25 to-rose-300/20" />

        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 16,
                right: 10,
                left: 2,
                bottom: 4,
              }}
            >
              <defs>
                <linearGradient id="viewsLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A65F46" stopOpacity={0.7} />

                  <stop offset="100%" stopColor="#C57868" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 7" stroke="rgba(148,163,184,0.065)" vertical={false} />

              <XAxis
                dataKey={dataKey}
                axisLine={false}
                tickLine={false}
                height={30}
                dy={6}
                interval={viewType === "monthly" ? 1 : 0}
                tick={{
                  fill: "#707985",
                  fontSize: 9,
                  fontWeight: 500,
                }}
              />

              <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />

              <Tooltip
                content={<ViewsTooltip />}
                cursor={{
                  stroke: "rgba(148,163,184,0.10)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                wrapperStyle={{
                  outline: "none",
                }}
              />

              <Line
                type="monotone"
                dataKey="views"
                stroke="url(#viewsLineGradient)"
                strokeWidth={2.4}
                dot={{
                  r: 2.5,
                  fill: "#B86D55",
                  stroke: "rgba(255,255,255,0.28)",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 4.5,
                  fill: "#C57868",
                  stroke: "rgba(255,255,255,0.55)",
                  strokeWidth: 1,
                }}
                isAnimationActive
                animationDuration={750}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="relative z-10 mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 p-3 dark:border-white/[0.045] dark:bg-white/[0.016]">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Average monthly</p>

          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[13px] font-bold text-gray-900 dark:text-white/72">{avgMonthly}</p>

            <span className="text-[8px] text-gray-400 dark:text-white/20">views</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 p-3 dark:border-white/[0.045] dark:bg-white/[0.016]">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Peak month</p>

          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[13px] font-bold text-orange-700 dark:text-orange-200/75">{bestMonth}</p>

            <span className="text-[8px] text-gray-400 dark:text-white/20">highest</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/70 bg-gray-50/50 p-3 dark:border-white/[0.045] dark:bg-white/[0.016]">
          <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Q4 growth</p>

          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-200/70">{quarterlyGrowth}</p>

            <FaArrowUp className="mb-0.5 text-emerald-600 dark:text-emerald-200/55" size={9} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500/80 shadow-[0_0_7px_rgba(16,185,129,0.30)]" />
          Peak season:
          <strong className="font-semibold text-gray-700 dark:text-white/48">Q4 (Oct–Dec)</strong>
        </span>

        <span>
          Annual growth:
          <strong className={`ml-1 font-semibold ${isTrendPositive ? "text-emerald-700 dark:text-emerald-200/65" : "text-rose-700 dark:text-rose-200/65"}`}>
            {isTrendPositive ? "+" : ""}
            {trendPercentage}%
          </strong>
        </span>
      </div>
    </Wrapper>
  );
};

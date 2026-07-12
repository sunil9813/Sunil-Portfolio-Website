import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Monitor, PieChart as PieChartIcon, Smartphone, Tablet, UsersRound } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { Wrapper } from "@/routes";

/* ==========================================================================
   DEVICE DATA
   ========================================================================== */

const deviceData = [
  {
    name: "Mobile",
    value: 400,
    color: "#7465A0",
    lightColor: "#9486BC",
    icon: Smartphone,
    theme: "violet",
  },
  {
    name: "Tablet",
    value: 300,
    color: "#438A7B",
    lightColor: "#68A999",
    icon: Tablet,
    theme: "teal",
  },
  {
    name: "Desktop",
    value: 300,
    color: "#9A7446",
    lightColor: "#BC9461",
    icon: Monitor,
    theme: "amber",
  },
];

const deviceThemeMap = {
  violet: {
    text: "text-violet-700 dark:text-violet-200/80",

    icon: "text-violet-700 dark:text-violet-200/75",

    iconSurface: "border-violet-300/[0.10] bg-violet-300/[0.045]",

    activeSurface: "border-violet-300/[0.13] bg-violet-300/[0.055]",

    glow: "bg-violet-500/[0.025]",
  },

  teal: {
    text: "text-teal-700 dark:text-teal-200/80",

    icon: "text-teal-700 dark:text-teal-200/75",

    iconSurface: "border-teal-300/[0.10] bg-teal-300/[0.045]",

    activeSurface: "border-teal-300/[0.13] bg-teal-300/[0.055]",

    glow: "bg-teal-500/[0.025]",
  },

  amber: {
    text: "text-amber-700 dark:text-amber-200/80",

    icon: "text-amber-700 dark:text-amber-200/75",

    iconSurface: "border-amber-300/[0.10] bg-amber-300/[0.045]",

    activeSurface: "border-amber-300/[0.13] bg-amber-300/[0.055]",

    glow: "bg-amber-500/[0.025]",
  },
};

const totalUsers = deviceData.reduce((total, item) => total + item.value, 0);

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const calculatePercentage = (value) => {
  if (totalUsers <= 0) {
    return 0;
  }

  return ((Number(value) || 0) / totalUsers) * 100;
};

/* ==========================================================================
   ACTIVE PIE SEGMENT
   ========================================================================== */

const ActiveDeviceShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;

  const percentage = calculatePercentage(value);

  return (
    <g>
      {/* Outer active ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 1}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="rgba(255,255,255,0.16)"
        strokeWidth={1}
        cornerRadius={8}
        style={{
          filter: `drop-shadow(0 8px 14px ${fill}35)`,
          transition: "all 250ms ease",
        }}
      />

      {/* Inner separator */}
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={innerRadius - 1} startAngle={startAngle} endAngle={endAngle} fill={`${fill}45`} stroke="none" />

      {/* Centre value */}
      <text x={cx} y={cy} dy={-16} textAnchor="middle" fill="currentColor" className="fill-gray-900 text-[22px] font-extrabold dark:fill-white/90">
        {percentage.toFixed(1)}%
      </text>

      <text x={cx} y={cy} dy={7} textAnchor="middle" fill="currentColor" className="fill-gray-600 text-[10px] font-semibold dark:fill-white/45">
        {payload.name}
      </text>

      <text x={cx} y={cy} dy={25} textAnchor="middle" fill="currentColor" className="fill-gray-400 text-[9px] font-medium dark:fill-white/25">
        {formatNumber(value)} users
      </text>
    </g>
  );
};

ActiveDeviceShape.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
  fill: PropTypes.string,
  value: PropTypes.number,

  payload: PropTypes.shape({
    name: PropTypes.string,
  }),
};

/* ==========================================================================
   CUSTOM TOOLTIP
   ========================================================================== */

const DeviceTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0]?.payload;

  if (!item) {
    return null;
  }

  const percentage = calculatePercentage(item.value);

  const DeviceIcon = item.icon;

  return (
    <div className="min-w-[220px] overflow-hidden rounded-[17px] border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.50)]">
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${item.color}90,
            transparent
          )`,
        }}
      />

      <div className="p-3.5">
        {/* Tooltip heading */}
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <div
            className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
            style={{
              color: item.lightColor,

              borderColor: `${item.color}35`,

              background: `linear-gradient(
                145deg,
                ${item.color}42,
                rgba(22,27,35,0.92)
              )`,
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

            <DeviceIcon className="relative" size={16} strokeWidth={1.9} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white/90">{item.name}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-white/25">Device usage</p>
          </div>
        </div>

        {/* Tooltip values */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gray-50/80 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">Total users</span>

            <span className="text-[13px] font-bold tabular-nums text-gray-900 dark:text-white/82">{formatNumber(item.value)}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gray-50/80 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">Audience share</span>

            <span
              className="text-[13px] font-bold tabular-nums"
              style={{
                color: item.lightColor,
              }}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

DeviceTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
};

/* ==========================================================================
   DEVICE BREAKDOWN
   ========================================================================== */

export const Device = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeDevice = useMemo(() => deviceData[activeIndex] || deviceData[0], [activeIndex]);

  const activePercentage = calculatePercentage(activeDevice.value);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Restrained decorative lighting */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-violet-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-violet-500/[0.027]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-teal-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-teal-500/[0.025]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.014),transparent_30%,transparent_73%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-300/[0.10] bg-[linear-gradient(145deg,rgba(79,67,137,0.52),rgba(30,68,68,0.90))] text-violet-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

            <PieChartIcon className="relative" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Device Breakdown</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">User distribution by device</p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/[0.10] bg-emerald-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-200/65">
          <span className="size-1.5 rounded-full bg-emerald-400/75 shadow-[0_0_7px_rgba(52,211,153,0.32)]" />
          Live data
        </span>
      </div>

      {/* Chart panel */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-gray-200/70 bg-gray-50/55 px-2 pb-3 pt-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.012)]">
        {/* Chart panel accent */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/25 to-teal-300/20" />

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={<ActiveDeviceShape />}
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={onPieEnter}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
                cornerRadius={7}
                isAnimationActive
                animationDuration={750}
                animationEasing="ease-out"
              >
                {deviceData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === index ? 1 : 0.62}
                    style={{
                      transition: "opacity 220ms ease",
                    }}
                  />
                ))}
              </Pie>

              <Tooltip
                content={<DeviceTooltip />}
                cursor={false}
                wrapperStyle={{
                  outline: "none",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Active device summary */}
        <div className="mx-auto -mt-2 flex max-w-[260px] items-center justify-between rounded-xl border border-gray-200/70 bg-white/60 px-3 py-2.5 dark:border-white/[0.045] dark:bg-black/[0.08]">
          <div className="flex items-center gap-2">
            <UsersRound className="text-gray-500 dark:text-white/30" size={13} strokeWidth={1.9} />

            <span className="text-[10px] font-medium text-gray-600 dark:text-white/35">Selected audience</span>
          </div>

          <span className="text-[11px] font-bold tabular-nums text-gray-900 dark:text-white/75">{formatNumber(activeDevice.value)}</span>
        </div>
      </div>

      {/* Interactive legend */}
      <div className="relative z-10 mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {deviceData.map((item, index) => {
          const theme = deviceThemeMap[item.theme];

          const DeviceIcon = item.icon;

          const percentage = calculatePercentage(item.value);

          const isActive = activeIndex === index;

          return (
            <button
              key={item.name}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`group/legend flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                isActive ? theme.activeSurface : "border-gray-200/70 bg-gray-50/50 hover:bg-white/75 dark:border-white/[0.045] dark:bg-white/[0.016] dark:hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${theme.iconSurface} ${theme.icon}`}>
                  <DeviceIcon size={13} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold text-gray-800 dark:text-white/65">{item.name}</p>

                  <p className="mt-0.5 text-[8px] text-gray-400 dark:text-white/22">{formatNumber(item.value)} users</p>
                </div>
              </div>

              <span className={`shrink-0 text-[11px] font-bold tabular-nums ${theme.text}`}>{percentage.toFixed(1)}%</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Total users: <strong className="font-semibold text-gray-700 dark:text-white/48">{formatNumber(totalUsers)}</strong>
        </span>

        <span>
          Most used:{" "}
          <strong className="font-semibold text-violet-700 dark:text-violet-200/65">
            Mobile ({activeIndex === 0 ? activePercentage.toFixed(1) : calculatePercentage(deviceData[0].value).toFixed(1)}
            %)
          </strong>
        </span>
      </div>
    </Wrapper>
  );
};

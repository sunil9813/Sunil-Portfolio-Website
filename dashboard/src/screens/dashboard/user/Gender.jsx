import PropTypes from "prop-types";
import { useMemo } from "react";
import { Mars, TrendingDown, TrendingUp, UsersRound, Venus } from "lucide-react";
import { Wrapper } from "@/routes";

/* ==========================================================================
   GENDER DATA
   ========================================================================== */

const genderData = [
  {
    month: "Jan",
    male: 62000,
    female: 48000,
    other: 8000,
  },
  {
    month: "Feb",
    male: 63500,
    female: 49500,
    other: 8200,
  },
  {
    month: "Mar",
    male: 65000,
    female: 51000,
    other: 8500,
  },
  {
    month: "Apr",
    male: 66800,
    female: 52500,
    other: 8700,
  },
  {
    month: "May",
    male: 68500,
    female: 54000,
    other: 9000,
  },
  {
    month: "Jun",
    male: 70200,
    female: 55500,
    other: 9300,
  },
];

/* ==========================================================================
   MUTED DARK-THEME CONFIGURATION
   ========================================================================== */

const genderConfig = {
  male: {
    primary: "#9A7446",
    secondary: "#6E5031",

    value: "text-amber-700 dark:text-amber-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(126,86,39,0.58),rgba(67,47,27,0.90))]",

    iconBorder: "border-amber-300/[0.11]",

    iconText: "text-amber-100/85",

    badge: "border-amber-300/[0.10] bg-amber-300/[0.045] text-amber-700 dark:text-amber-200/70",

    progressBackground: "bg-[linear-gradient(90deg,#735331,#A27A49)]",

    glow: "bg-amber-500/[0.026]",

    accent: "via-amber-300/25",

    hoverBorder: "hover:border-amber-300/[0.13]",
  },

  female: {
    primary: "#438A7B",
    secondary: "#2E6258",

    value: "text-teal-700 dark:text-teal-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(38,105,91,0.58),rgba(24,59,52,0.90))]",

    iconBorder: "border-teal-300/[0.11]",

    iconText: "text-teal-100/85",

    badge: "border-teal-300/[0.10] bg-teal-300/[0.045] text-teal-700 dark:text-teal-200/70",

    progressBackground: "bg-[linear-gradient(90deg,#2F665A,#4C9483)]",

    glow: "bg-teal-500/[0.026]",

    accent: "via-teal-300/25",

    hoverBorder: "hover:border-teal-300/[0.13]",
  },

  other: {
    primary: "#7465A0",
    secondary: "#50466F",

    value: "text-violet-700 dark:text-violet-200/85",

    iconBackground: "bg-[linear-gradient(145deg,rgba(80,67,132,0.58),rgba(44,38,75,0.90))]",

    iconBorder: "border-violet-300/[0.11]",

    iconText: "text-violet-100/85",

    badge: "border-violet-300/[0.10] bg-violet-300/[0.045] text-violet-700 dark:text-violet-200/70",

    progressBackground: "bg-[linear-gradient(90deg,#514771,#796AA5)]",

    glow: "bg-violet-500/[0.026]",

    accent: "via-violet-300/25",

    hoverBorder: "hover:border-violet-300/[0.13]",
  },
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatCompactNumber = (value) => {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
};

const normalisePercentage = (value) => {
  const convertedValue = Number(value);

  if (!Number.isFinite(convertedValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, convertedValue));
};

/* ==========================================================================
   GENDER CARD
   ========================================================================== */

const GenderCard = ({ gender, value, percentage, change, icon: Icon, color }) => {
  const config = genderConfig[color];

  const changeValue = Number.parseFloat(change) || 0;

  const isPositive = changeValue >= 0;

  const safePercentage = normalisePercentage(percentage);

  return (
    <Wrapper
      className={`
        group
        relative
        overflow-hidden
        p-6
        transition-all
        duration-300
        hover:-translate-y-0.5
        ${config.hoverBorder}
      `}
    >
      {/* Wrapper background remains unchanged */}

      {/* Restrained card lighting */}
      <div
        className={`
          pointer-events-none
          absolute
          -bottom-24
          -right-20
          h-56
          w-56
          rounded-full
          opacity-65
          blur-[78px]
          transition-all
          duration-700
          group-hover:scale-110
          group-hover:opacity-95
          ${config.glow}
        `}
      />

      <div
        className={`
          pointer-events-none
          absolute
          -left-20
          -top-24
          h-52
          w-52
          rounded-full
          opacity-35
          blur-[75px]
          transition-all
          duration-700
          group-hover:scale-110
          group-hover:opacity-55
          ${config.glow}
        `}
      />

      {/* Neutral surface highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.016),transparent_32%,transparent_74%,rgba(255,255,255,0.003))]" />

      {/* Inner border */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.012]" />

      {/* Top accent */}
      <div
        className={`
          pointer-events-none
          absolute
          left-8
          right-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          to-transparent
          ${config.accent}
        `}
      />

      {/* Decorative dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] transition-opacity duration-500 group-hover:opacity-[0.06]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`gender-pattern-${color}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" className="text-gray-500 dark:text-white" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill={`url(#gender-pattern-${color})`} />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`
              relative
              flex
              size-10
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              shadow-[0_8px_22px_rgba(0,0,0,0.20)]
              ${config.iconBackground}
              ${config.iconBorder}
              ${config.iconText}
            `}
          >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

            <Icon className="relative z-10" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">{gender}</h4>

            <p className="mt-0.5 text-[10px] font-medium text-gray-500 dark:text-white/27">Registered users</p>
          </div>
        </div>

        {/* Growth badge */}
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${
            isPositive ? "border-emerald-300/[0.10] bg-emerald-300/[0.045] text-emerald-700 dark:text-emerald-200/70" : "border-rose-300/[0.10] bg-rose-300/[0.045] text-rose-700 dark:text-rose-200/70"
          }`}
        >
          {isPositive ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />}
          {isPositive ? "+" : ""}
          {changeValue.toFixed(1)}%
        </span>
      </div>

      {/* Main value */}
      <div className="relative z-10 mt-6">
        <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/20">Total audience</span>

        <div className="mt-1.5 flex items-end gap-2">
          <span
            className={`
              text-4xl
              font-extrabold
              leading-none
              tracking-[-0.045em]
              tabular-nums
              ${config.value}
            `}
          >
            {value}
          </span>

          <span className="pb-1 text-[10px] font-medium text-gray-500 dark:text-white/27">users</span>
        </div>
      </div>

      {/* Distribution panel */}
      <div className="relative z-10 mt-5 rounded-xl border border-gray-200/70 bg-gray-50/55 p-3 dark:border-white/[0.045] dark:bg-white/[0.018]">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium text-gray-600 dark:text-white/35">Audience distribution</p>

            <p className="mt-0.5 text-[8px] text-gray-400 dark:text-white/20">Share of total users</p>
          </div>

          <span className={`text-[12px] font-bold tabular-nums ${config.value}`}>{safePercentage.toFixed(1)}%</span>
        </div>

        {/* Progress track */}
        <div
          className="h-2 overflow-hidden rounded-full border border-gray-200/50 bg-gray-200/70 dark:border-white/[0.025] dark:bg-black/25"
          role="progressbar"
          aria-label={`${gender} audience distribution`}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={safePercentage}
        >
          <div
            className={`
              relative
              h-full
              rounded-full
              transition-all
              duration-700
              ease-out
              ${config.progressBackground}
            `}
            style={{
              width: `${safePercentage}%`,
              boxShadow: `0 0 12px ${config.primary}35`,
            }}
          >
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)]" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-[10px] dark:border-white/[0.05]">
        <span className="text-gray-500 dark:text-white/27">Growth since January</span>

        <span className={`inline-flex items-center gap-1 font-semibold ${isPositive ? "text-emerald-600 dark:text-emerald-200/65" : "text-rose-600 dark:text-rose-200/65"}`}>
          {isPositive ? <TrendingUp size={10} strokeWidth={2} /> : <TrendingDown size={10} strokeWidth={2} />}
          {isPositive ? "+" : ""}
          {changeValue.toFixed(1)}%
        </span>
      </div>
    </Wrapper>
  );
};

GenderCard.propTypes = {
  gender: PropTypes.string.isRequired,

  value: PropTypes.string.isRequired,

  percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  change: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

  icon: PropTypes.elementType.isRequired,

  color: PropTypes.oneOf(["male", "female", "other"]).isRequired,
};

/* ==========================================================================
   GENDER ANALYTICS
   ========================================================================== */

export const GenderAnalytics = () => {
  const metrics = useMemo(() => {
    const latestMonth = genderData[genderData.length - 1];

    const firstMonth = genderData[0];

    const total = latestMonth.male + latestMonth.female + latestMonth.other;

    const calculatePercentage = (value) => {
      if (total <= 0) {
        return 0;
      }

      return (value / total) * 100;
    };

    const calculateGrowth = (currentValue, firstValue) => {
      if (firstValue <= 0) {
        return 0;
      }

      return ((currentValue - firstValue) / firstValue) * 100;
    };

    return {
      male: latestMonth.male,

      female: latestMonth.female,

      other: latestMonth.other,

      malePercentage: calculatePercentage(latestMonth.male),

      femalePercentage: calculatePercentage(latestMonth.female),

      otherPercentage: calculatePercentage(latestMonth.other),

      maleGrowth: calculateGrowth(latestMonth.male, firstMonth.male),

      femaleGrowth: calculateGrowth(latestMonth.female, firstMonth.female),

      otherGrowth: calculateGrowth(latestMonth.other, firstMonth.other),
    };
  }, []);

  return (
    <div className="my-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <GenderCard gender="Male" value={formatCompactNumber(metrics.male)} percentage={metrics.malePercentage} change={metrics.maleGrowth} icon={Mars} color="male" />

      <GenderCard gender="Female" value={formatCompactNumber(metrics.female)} percentage={metrics.femalePercentage} change={metrics.femaleGrowth} icon={Venus} color="female" />

      <GenderCard gender="Other" value={formatCompactNumber(metrics.other)} percentage={metrics.otherPercentage} change={metrics.otherGrowth} icon={UsersRound} color="other" />
    </div>
  );
};

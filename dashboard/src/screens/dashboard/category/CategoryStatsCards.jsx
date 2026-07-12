import PropTypes from "prop-types";
import { Wrapper } from "@/routes";
import { FaArchive, FaCheckCircle, FaEdit, FaList } from "react-icons/fa";

/*
 * Dark muted colour system.
 * Each card keeps its own identity without using bright neon colours.
 */
const cardThemeMap = {
  total: {
    gradient: "from-[#276272] to-[#1c3f4d]",
    iconBorder: "border-cyan-300/[0.11]",
    iconText: "text-cyan-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(26,107,128,0.18)]",

    value: "text-cyan-200/85",

    badge: "border-cyan-300/[0.11] bg-cyan-300/[0.045] text-cyan-200/70",

    glow: "bg-cyan-500/[0.035]",

    accent: "via-cyan-300/25",

    hoverBorder: "hover:border-cyan-300/[0.13]",
  },

  published: {
    gradient: "from-[#29634f] to-[#1c4037]",
    iconBorder: "border-emerald-300/[0.11]",
    iconText: "text-emerald-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(38,119,91,0.17)]",

    value: "text-emerald-200/85",

    badge: "border-emerald-300/[0.11] bg-emerald-300/[0.045] text-emerald-200/70",

    glow: "bg-emerald-500/[0.035]",

    accent: "via-emerald-300/25",

    hoverBorder: "hover:border-emerald-300/[0.13]",
  },

  draft: {
    gradient: "from-[#76552c] to-[#49361f]",
    iconBorder: "border-amber-300/[0.11]",
    iconText: "text-amber-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(145,99,37,0.16)]",

    value: "text-amber-200/85",

    badge: "border-amber-300/[0.11] bg-amber-300/[0.045] text-amber-200/70",

    glow: "bg-amber-500/[0.032]",

    accent: "via-amber-300/25",

    hoverBorder: "hover:border-amber-300/[0.13]",
  },

  archived: {
    gradient: "from-[#534677] to-[#362f50]",
    iconBorder: "border-violet-300/[0.11]",
    iconText: "text-violet-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(95,75,151,0.17)]",

    value: "text-violet-200/85",

    badge: "border-violet-300/[0.11] bg-violet-300/[0.045] text-violet-200/70",

    glow: "bg-violet-500/[0.032]",

    accent: "via-violet-300/25",

    hoverBorder: "hover:border-violet-300/[0.13]",
  },
};

/*
 * Converts invalid values into safe numbers.
 */
const normaliseNumber = (value) => {
  const convertedValue = Number(value);

  if (!Number.isFinite(convertedValue)) {
    return 0;
  }

  return Math.max(0, convertedValue);
};

/*
 * Prevents NaN and Infinity when totalCategories is zero.
 */
const formatPercent = (part, total) => {
  const safePart = normaliseNumber(part);
  const safeTotal = normaliseNumber(total);

  if (safeTotal <= 0) {
    return "0.0%";
  }

  const percentage = (safePart / safeTotal) * 100;

  return `${percentage.toFixed(1)}%`;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(normaliseNumber(value));
};

const formatGrowth = (value) => {
  const safeValue = Number(value) || 0;

  return `${safeValue > 0 ? "+" : ""}${safeValue}% vs last month`;
};

export const CategoryStatsCards = ({ totalCategories = 0, draftCategories = 0, archivedCategories = 0, publishedCategories = 0, publishedGrowth = 0 }) => {
  const safeTotal = normaliseNumber(totalCategories);

  const safeDraft = normaliseNumber(draftCategories);

  const safeArchived = normaliseNumber(archivedCategories);

  const safePublished = normaliseNumber(publishedCategories);

  const cards = [
    {
      key: "total",
      title: "Total Categories",
      value: safeTotal,
      badge: "Live",
      subtitle: "Active categories",
      icon: FaList,
      footerLeft: "Active categories",
      footerRight: `${formatNumber(safeTotal)} total`,
    },

    {
      key: "published",
      title: "Published",
      value: safePublished,
      badge: formatPercent(safePublished, safeTotal),
      subtitle: "Visible categories",
      icon: FaCheckCircle,
      footerLeft: formatGrowth(publishedGrowth),
      footerRight: formatPercent(safePublished, safeTotal),
    },

    {
      key: "draft",
      title: "Draft",
      value: safeDraft,
      badge: formatPercent(safeDraft, safeTotal),
      subtitle: "Pending review",
      icon: FaEdit,
      footerLeft: "-4.2% vs last month",
      footerRight: formatPercent(safeDraft, safeTotal),
    },

    {
      key: "archived",
      title: "Archived",
      value: safeArchived,
      badge: "Review",
      subtitle: "Stored categories",
      icon: FaArchive,
      footerLeft: "+2.1% vs last month",
      footerRight: `${formatNumber(safeArchived)} archived`,
    },
  ];

  return (
    <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const theme = cardThemeMap[card.key];

        const CardIcon = card.icon;

        const isNegative = card.footerLeft.startsWith("-");

        const isPositive = card.footerLeft.startsWith("+");

        return (
          <Wrapper
            key={card.key}
            className={`
              group
              relative
              overflow-hidden
              border
              border-white/[0.055]
              !bg-[#101318]
              p-6
              shadow-[0_15px_36px_rgba(0,0,0,0.20)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:!bg-[#12161c]
              hover:shadow-[0_20px_45px_rgba(0,0,0,0.28)]
              ${theme.hoverBorder}
            `}
          >
            {/* Restrained bottom glow */}
            <div
              className={`
                pointer-events-none
                absolute
                -bottom-24
                -right-20
                h-56
                w-56
                rounded-full
                opacity-70
                blur-[75px]
                transition-all
                duration-700
                group-hover:scale-110
                group-hover:opacity-100
                ${theme.glow}
              `}
            />

            {/* Restrained top glow */}
            <div
              className={`
                pointer-events-none
                absolute
                -left-20
                -top-24
                h-52
                w-52
                rounded-full
                opacity-45
                blur-[75px]
                transition-all
                duration-700
                group-hover:scale-110
                group-hover:opacity-70
                ${theme.glow}
              `}
            />

            {/* Neutral inner highlight */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_30%,transparent_72%,rgba(255,255,255,0.004))]" />

            {/* Fine inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.015]" />

            {/* Muted top accent */}
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
                ${theme.accent}
              `}
            />

            {/* Header */}
            <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
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
                    bg-gradient-to-br
                    ${theme.gradient}
                    ${theme.iconBorder}
                    ${theme.iconText}
                    ${theme.iconShadow}
                  `}
                >
                  {/* Icon surface highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

                  <CardIcon className="relative z-10" size={17} />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-white/90">{card.title}</h4>

                  <p className="mt-0.5 truncate text-[10px] font-medium text-white/28">{card.subtitle}</p>
                </div>
              </div>

              {/* Badge */}
              <span
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  ${theme.badge}
                `}
              >
                {card.badge}
              </span>
            </div>

            {/* Value */}
            <div className="relative z-10 mt-5">
              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/20">Current total</span>

              <h2
                className={`
                  mt-1.5
                  text-4xl
                  font-extrabold
                  leading-none
                  tracking-[-0.045em]
                  tabular-nums
                  ${theme.value}
                `}
              >
                {formatNumber(card.value)}
              </h2>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3 text-[10px]">
              <span className={`truncate font-medium ${isNegative ? "text-rose-300/60" : isPositive ? "text-emerald-300/60" : "text-white/28"}`}>{card.footerLeft}</span>

              <span className="shrink-0 font-semibold tabular-nums text-white/45">{card.footerRight}</span>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

CategoryStatsCards.propTypes = {
  totalCategories: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  draftCategories: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  archivedCategories: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  publishedCategories: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  publishedGrowth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

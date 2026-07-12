import PropTypes from "prop-types";
import { Wrapper } from "@/routes";
import { FaComment, FaEye } from "react-icons/fa";
import { GiGrowth, GiNewBorn } from "react-icons/gi";

/* ==========================================================================
   DARK-THEME COLOUR PALETTE
   ========================================================================== */

const colorMap = {
  trending: {
    gradient: "from-[#34735f] via-[#35695b] to-[#294f48]",
    glow: "bg-emerald-500/[0.03]",
    border: "border-emerald-300/20 dark:border-emerald-300/[0.10]",
    text: "text-emerald-700 dark:text-emerald-200/80",
    badge: "border-emerald-300/20 bg-emerald-500/[0.06] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.045] dark:text-emerald-200/70",
    footerIcon: "text-emerald-600 dark:text-emerald-200/55",
    accent: "via-emerald-300/25",
  },

  comments: {
    gradient: "from-[#8b485f] via-[#9b4f66] to-[#713a4c]",
    glow: "bg-rose-500/[0.03]",
    border: "border-rose-300/20 dark:border-rose-300/[0.10]",
    text: "text-rose-700 dark:text-rose-200/80",
    badge: "border-rose-300/20 bg-rose-500/[0.06] text-rose-700 dark:border-rose-300/[0.10] dark:bg-rose-300/[0.045] dark:text-rose-200/70",
    footerIcon: "text-rose-600 dark:text-rose-200/55",
    accent: "via-rose-300/25",
  },

  new: {
    gradient: "from-[#34747a] via-[#376d78] to-[#2a505d]",
    glow: "bg-cyan-500/[0.03]",
    border: "border-cyan-300/20 dark:border-cyan-300/[0.10]",
    text: "text-cyan-700 dark:text-cyan-200/80",
    badge: "border-cyan-300/20 bg-cyan-500/[0.06] text-cyan-700 dark:border-cyan-300/[0.10] dark:bg-cyan-300/[0.045] dark:text-cyan-200/70",
    footerIcon: "text-cyan-600 dark:text-cyan-200/55",
    accent: "via-cyan-300/25",
  },
};

/* ==========================================================================
   CARD DATA
   ========================================================================== */

const cards = [
  {
    id: "trending",
    title: "Trending",
    icon: GiGrowth,
    colorKey: "trending",
    main: {
      label: "Next.js 14",
      value: "+32%",
      unit: "growth",
    },
    footerLeft: {
      icon: GiGrowth,
      text: "Weekly growth",
    },
    footerRight: {
      icon: FaEye,
      text: "+32% vs last",
    },
    trend: "+32%",
  },
  {
    id: "comments",
    title: "Comments",
    icon: FaComment,
    colorKey: "comments",
    main: {
      value: "1,284",
      unit: "comments",
    },
    footerLeft: {
      icon: FaComment,
      text: "This month",
    },
    footerRight: {
      icon: GiGrowth,
      text: "Avg 42/day",
    },
    trend: "+5%",
  },
  {
    id: "new",
    title: "New Posts",
    icon: GiNewBorn,
    colorKey: "new",
    main: {
      value: "5",
      unit: "posts",
    },
    footerLeft: {
      icon: GiNewBorn,
      text: "This week",
    },
    footerRight: {
      icon: GiGrowth,
      text: "+2 vs last",
    },
    trend: "+2",
  },
];

/* ==========================================================================
   INSIGHT CARD
   ========================================================================== */

const InsightCard = ({ card }) => {
  const theme = colorMap[card.colorKey];

  const CardIcon = card.icon;
  const FooterLeftIcon = card.footerLeft.icon;
  const FooterRightIcon = card.footerRight.icon;

  return (
    <Wrapper className="group relative h-full overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Existing coloured background glows */}
      <div
        className={`pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full ${theme.glow} opacity-70 blur-[85px] transition-all duration-1000 group-hover:scale-125 group-hover:opacity-100`}
      />

      <div
        className={`pointer-events-none absolute -left-20 -top-20 size-64 rounded-full ${theme.glow} opacity-60 blur-[85px] transition-all duration-1000 group-hover:scale-125 group-hover:opacity-90`}
      />

      {/* Subtle colour surface */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-[0.018] transition-opacity duration-500 group-hover:opacity-[0.035]`} />

      {/* Top accent */}
      <div className={`pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${theme.accent}`} />

      {/* Existing diagonal pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.10]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`diagonal-${card.id}`} patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="0.6" className="text-gray-400 dark:text-white/20" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill={`url(#diagonal-${card.id})`} />
        </svg>
      </div>

      <div className="relative z-10 flex h-full min-h-[190px] flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div
                className={`relative flex size-10 items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br text-white/90 shadow-[0_8px_22px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:scale-105 ${theme.gradient} ${theme.border}`}
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.10]" />

                <CardIcon className="relative z-10" size={17} />
              </div>

              <div className={`pointer-events-none absolute -inset-1 -z-10 rounded-xl ${theme.glow} opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100`} />
            </div>

            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">{card.title}</h4>

              {card.main.label && <p className="mt-0.5 max-w-[120px] truncate text-[10px] text-gray-500 transition-colors dark:text-white/30">{card.main.label}</p>}
            </div>
          </div>

          {/* Trend badge */}
          <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold tabular-nums backdrop-blur-sm ${theme.badge}`}>{card.trend}</span>
        </div>

        {/* Main value */}
        <div className="mt-6 transition-transform duration-300 group-hover:translate-x-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums ${theme.text}`}>{card.main.value}</span>

            {card.main.unit && <span className="text-[10px] font-medium uppercase tracking-[0.07em] text-gray-500 dark:text-white/27">{card.main.unit}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-200/70 pt-4 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/30">
          <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-gray-200/60 bg-gray-50/50 px-2 py-1.5 dark:border-white/[0.04] dark:bg-white/[0.018]">
            <FooterLeftIcon size={9} className={`shrink-0 ${theme.footerIcon}`} />

            <span className="truncate">{card.footerLeft.text}</span>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-1.5 rounded-lg border border-gray-200/60 bg-gray-50/50 px-2 py-1.5 dark:border-white/[0.04] dark:bg-white/[0.018]">
            <FooterRightIcon size={9} className={`shrink-0 ${theme.footerIcon}`} />

            <span className="truncate">{card.footerRight.text}</span>
          </div>
        </div>
      </div>

      {/* Subtle hover shimmer */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
        <div className="absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-1000 group-hover:translate-x-[400%]" />
      </div>
    </Wrapper>
  );
};

InsightCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    colorKey: PropTypes.oneOf(["trending", "comments", "new"]).isRequired,
    main: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string.isRequired,
      unit: PropTypes.string,
    }).isRequired,
    footerLeft: PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
    footerRight: PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
    trend: PropTypes.string.isRequired,
  }).isRequired,
};

/* ==========================================================================
   BLOG INSIGHTS PANEL
   ========================================================================== */

export const BlogInsightsPanel = () => {
  return (
    <div className="mb-3 grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <InsightCard key={card.id} card={card} />
      ))}
    </div>
  );
};

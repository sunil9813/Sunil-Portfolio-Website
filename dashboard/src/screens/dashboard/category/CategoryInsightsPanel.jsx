import { Activity, BadgePlus, CalendarDays, CircleOff, Cpu, Eye, Gamepad2, HeartPulse, RefreshCw, Target, TrendingUp, Trophy } from "lucide-react";
import { Wrapper } from "@/routes";

/* ==========================================================================
   STATIC DARK-THEME COLOUR CONFIGURATION
   ========================================================================== */

const cardThemes = {
  amber: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(126,88,35,0.58),rgba(63,43,23,0.90))]",
    iconBorder: "border-amber-300/[0.12]",
    iconText: "text-amber-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(145,98,38,0.17)]",

    value: "text-amber-200/85",

    badge: "border-amber-300/[0.11] bg-amber-300/[0.045] text-amber-200/70",

    glow: "bg-amber-500/[0.028]",

    accent: "via-amber-300/25",

    hoverBorder: "hover:border-amber-300/[0.14]",
  },

  blue: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(42,92,132,0.58),rgba(27,52,75,0.90))]",
    iconBorder: "border-blue-300/[0.12]",
    iconText: "text-blue-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(51,107,154,0.17)]",

    value: "text-blue-200/85",

    badge: "border-blue-300/[0.11] bg-blue-300/[0.045] text-blue-200/70",

    glow: "bg-blue-500/[0.028]",

    accent: "via-blue-300/25",

    hoverBorder: "hover:border-blue-300/[0.14]",
  },

  green: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(38,104,78,0.58),rgba(25,59,47,0.90))]",
    iconBorder: "border-emerald-300/[0.12]",
    iconText: "text-emerald-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(38,118,85,0.17)]",

    value: "text-emerald-200/85",

    badge: "border-emerald-300/[0.11] bg-emerald-300/[0.045] text-emerald-200/70",

    glow: "bg-emerald-500/[0.028]",

    accent: "via-emerald-300/25",

    hoverBorder: "hover:border-emerald-300/[0.14]",
  },

  indigo: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(69,63,128,0.58),rgba(40,36,75,0.90))]",
    iconBorder: "border-indigo-300/[0.12]",
    iconText: "text-indigo-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(78,70,156,0.17)]",

    value: "text-indigo-200/85",

    badge: "border-indigo-300/[0.11] bg-indigo-300/[0.045] text-indigo-200/70",

    glow: "bg-indigo-500/[0.028]",

    accent: "via-indigo-300/25",

    hoverBorder: "hover:border-indigo-300/[0.14]",
  },

  teal: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(32,103,104,0.58),rgba(22,58,61,0.90))]",
    iconBorder: "border-teal-300/[0.12]",
    iconText: "text-teal-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(31,115,113,0.17)]",

    value: "text-teal-200/85",

    badge: "border-teal-300/[0.11] bg-teal-300/[0.045] text-teal-200/70",

    glow: "bg-teal-500/[0.028]",

    accent: "via-teal-300/25",

    hoverBorder: "hover:border-teal-300/[0.14]",
  },

  rose: {
    iconBackground: "bg-[linear-gradient(145deg,rgba(121,53,73,0.58),rgba(67,32,45,0.90))]",
    iconBorder: "border-rose-300/[0.12]",
    iconText: "text-rose-100/85",
    iconShadow: "shadow-[0_9px_24px_rgba(137,57,80,0.17)]",

    value: "text-rose-200/85",

    badge: "border-rose-300/[0.11] bg-rose-300/[0.045] text-rose-200/70",

    glow: "bg-rose-500/[0.028]",

    accent: "via-rose-300/25",

    hoverBorder: "hover:border-rose-300/[0.14]",
  },
};

/* ==========================================================================
   CARD DATA
   ========================================================================== */

const cards = [
  {
    id: "best",
    title: "Best Performing",
    subtitle: "Top category",
    icon: Trophy,
    theme: "amber",
    value: "4.2K",
    valueLabel: "posts",
    badge: "Top",
    extraIcon: Cpu,
    extraName: "Technology",
    extraValue: "+12%",
    footerLeft: "12% vs last month",
    footerRight: "4.2K posts",
    positive: true,
  },

  {
    id: "most-viewed",
    title: "Most Viewed",
    subtitle: "Highest traffic",
    icon: Eye,
    theme: "blue",
    value: "128K",
    valueLabel: "views",
    badge: "Popular",
    extraIcon: HeartPulse,
    extraName: "Health",
    extraValue: "6.8K posts",
    footerLeft: "128K views",
    footerRight: "6.8K posts",
  },

  {
    id: "fastest-growing",
    title: "Fastest Growing",
    subtitle: "Growth rate",
    icon: TrendingUp,
    theme: "green",
    value: "+18%",
    valueLabel: "growth",
    badge: "Rising",
    extraIcon: Gamepad2,
    extraName: "Gaming",
    extraValue: "This month",
    footerLeft: "18% this month",
    footerRight: "Gaming",
    positive: true,
  },

  {
    id: "new",
    title: "New This Week",
    subtitle: "Categories added",
    icon: BadgePlus,
    theme: "indigo",
    value: "3",
    valueLabel: "new",
    badge: "New",
    extraIcon: CalendarDays,
    extraName: "This week",
    extraValue: "3 categories",
    footerLeft: "This week",
    footerRight: "3 added",
  },

  {
    id: "updated",
    title: "Updated This Week",
    subtitle: "Categories modified",
    icon: RefreshCw,
    theme: "teal",
    value: "8",
    valueLabel: "updated",
    badge: "Updated",
    extraIcon: Activity,
    extraName: "Recent activity",
    extraValue: "8 changes",
    footerLeft: "This week",
    footerRight: "8 modified",
  },

  {
    id: "inactive",
    title: "Inactive",
    subtitle: "No posts in 30+ days",
    icon: CircleOff,
    theme: "rose",
    value: "2",
    valueLabel: "inactive",
    badge: "Attention",
    extraIcon: Target,
    extraName: "30+ days",
    extraValue: "Needs review",
    footerLeft: "30+ days inactive",
    footerRight: "2 categories",
  },
];

/* ==========================================================================
   CATEGORY INSIGHTS PANEL
   ========================================================================== */

export const CategoryInsightsPanel = () => {
  return (
    <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const theme = cardThemes[card.theme];

        const CardIcon = card.icon;
        const ExtraIcon = card.extraIcon;

        return (
          <Wrapper
            key={card.id}
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
            {/* Bottom glow */}
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
                blur-[80px]
                transition-all
                duration-700
                group-hover:scale-110
                group-hover:opacity-100
                ${theme.glow}
              `}
            />

            {/* Top glow */}
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
                blur-[80px]
                transition-all
                duration-700
                group-hover:scale-110
                group-hover:opacity-70
                ${theme.glow}
              `}
            />

            {/* Neutral surface highlight */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_30%,transparent_72%,rgba(255,255,255,0.004))]" />

            {/* Inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.015]" />

            {/* Top colour accent */}
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
            <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
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
                    ${theme.iconBackground}
                    ${theme.iconBorder}
                    ${theme.iconText}
                    ${theme.iconShadow}
                  `}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),transparent_48%)]" />

                  <CardIcon className="relative z-10" size={18} strokeWidth={1.9} />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">{card.title}</h4>

                  <p className="mt-0.5 truncate text-[10px] font-medium text-gray-500 dark:text-white/28">{card.subtitle}</p>
                </div>
              </div>

              <span
                className={`
                  shrink-0
                  rounded-full
                  border
                  px-2.5
                  py-1
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  ${theme.badge}
                `}
              >
                {card.badge}
              </span>
            </div>

            {/* Main value */}
            <div className="relative z-10 mt-5">
              <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-white/20">Current result</span>

              <div className="mt-1.5 flex items-end gap-2">
                <span
                  className={`
                    text-4xl
                    font-extrabold
                    leading-none
                    tracking-[-0.045em]
                    tabular-nums
                    ${theme.value}
                  `}
                >
                  {card.value}
                </span>

                <span className="pb-1 text-[10px] font-medium text-gray-500 dark:text-white/28">{card.valueLabel}</span>
              </div>
            </div>

            {/* Category information */}
            <div className="relative z-10 mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200/70 bg-gray-50/70 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    ${theme.iconBorder}
                    ${theme.badge}
                  `}
                >
                  <ExtraIcon size={13} strokeWidth={1.9} />
                </div>

                <span className="truncate text-[10px] font-medium text-gray-700 dark:text-white/48">{card.extraName}</span>
              </div>

              <span
                className={`
                  shrink-0
                  text-[9px]
                  font-semibold
                  ${theme.value}
                `}
              >
                {card.extraValue}
              </span>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-[10px] dark:border-white/[0.05]">
              <span className={card.positive ? "inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-200/60" : "truncate font-medium text-gray-500 dark:text-white/28"}>
                {card.positive && <TrendingUp size={10} strokeWidth={2} />}

                {card.footerLeft}
              </span>

              <span className="shrink-0 font-semibold text-gray-600 dark:text-white/45">{card.footerRight}</span>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

import { Wrapper } from "@/utils/Router";
import { GiTrophy, GiEyeTarget, GiGrowth, GiNewBorn, GiCycle } from "react-icons/gi";
import { FaEye } from "react-icons/fa";
import { TbRadioactive } from "react-icons/tb";

// Gradient map for icon backgrounds
const gradientMap = {
  amber: "from-amber-500 to-orange-500",
  blue: "from-blue-500 to-cyan-500",
  green: "from-green-500 to-emerald-500",
  indigo: "from-indigo-500 to-purple-500",
  teal: "from-teal-500 to-cyan-500",
  rose: "from-rose-500 to-pink-500",
};

// Card data
const cards = [
  {
    id: "best",
    title: "Best Performing",
    subtitle: "Top category",
    icon: GiTrophy,
    gradient: "amber",
    value: "4.2K",
    valueLabel: "posts",
    color: "amber",
    extra: { icon: "💻", name: "Tech", growth: "+12%" },
    footerLeft: "↑ 12% vs last month",
    footerRight: "4.2K posts",
  },
  {
    id: "most-viewed",
    title: "Most Viewed",
    subtitle: "Highest traffic",
    icon: GiEyeTarget,
    gradient: "blue",
    value: "128K",
    valueLabel: "views",
    color: "blue",
    extra: { icon: "🏥", name: "Health", posts: "6.8K" },
    footerLeft: "128K views",
    footerRight: "6.8K posts",
  },
  {
    id: "fastest-growing",
    title: "Fastest Growing",
    subtitle: "Growth rate",
    icon: GiGrowth,
    gradient: "green",
    value: "+18%",
    valueLabel: "growth",
    color: "green",
    extra: { icon: "🎮", name: "Gaming" },
    footerLeft: "↑ 18% this month",
    footerRight: "Gaming",
  },
  {
    id: "new",
    title: "New This Week",
    subtitle: "Categories added",
    icon: GiNewBorn,
    gradient: "indigo",
    value: "3",
    valueLabel: "new",
    color: "indigo",
    extra: { period: "This week" },
    footerLeft: "This week",
    footerRight: "3 added",
  },
  {
    id: "updated",
    title: "Updated This Week",
    subtitle: "Categories modified",
    icon: GiCycle,
    gradient: "teal",
    value: "8",
    valueLabel: "updated",
    color: "teal",
    extra: { period: "This week" },
    footerLeft: "This week",
    footerRight: "8 modified",
  },
  {
    id: "inactive",
    title: "Inactive",
    subtitle: "No posts in 30+ days",
    icon: TbRadioactive,
    gradient: "rose",
    value: "2",
    valueLabel: "inactive",
    color: "rose",
    extra: { period: "30+ days" },
    footerLeft: "30+ days inactive",
    footerRight: "2 categories",
  },
];

export const CategoryInsightsPanel = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      {cards.map((card) => {
        const gradient = gradientMap[card.gradient];
        const textColorClass = `text-${card.color}-600 dark:text-${card.color}-400`;
        const glowClass = `bg-${card.color}-500/10`;

        return (
          <Wrapper key={card.id} className="p-6 relative overflow-hidden group">
            {/* Floating glows */}
            <div className={`absolute -bottom-20 -right-20 w-56 h-56 ${glowClass} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />
            <div className={`absolute -top-20 -left-20 w-56 h-56 ${glowClass} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`size-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg shadow-${card.color}-500/30`}>
                  <card.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                </div>
              </div>
              {/* Optional small badge – can be added per card if needed */}
            </div>

            {/* Value and extra info */}
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-extrabold ${textColorClass}`}>{card.value}</span>
                {card.valueLabel && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{card.valueLabel}</span>}
              </div>

              {/* Category icon + name if present */}
              {card.extra && card.extra.icon && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xl">{card.extra.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{card.extra.name}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
              <span>{card.footerLeft}</span>
              <span>{card.footerRight}</span>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

import { Wrapper } from "@/utils/Router";
import { FaList, FaCheckCircle, FaEdit, FaArchive } from "react-icons/fa";

// Gradient map for icon backgrounds
const gradientMap = {
  total: "from-rose-500 to-pink-600",
  published: "from-teal-500 to-cyan-600",
  draft: "from-amber-500 to-orange-600",
  archived: "from-violet-500 to-purple-600",
};

export const CategoryStatsCards = ({ totalCategories, draftCategories, archivedCategories, publishedCategories, publishedGrowth }) => {
  // Helper to format percentage
  const formatPercent = (part, total) => ((part / total) * 100).toFixed(1) + "%";

  const cards = [
    {
      key: "total",
      title: "Total Categories",
      value: totalCategories,
      badge: "LIVE",
      subtitle: "Active categories",
      icon: FaList,
      color: "total", // maps to gradientMap and text color
      footerLeft: "Active categories",
      footerRight: totalCategories + " total",
    },
    {
      key: "published",
      title: "Published",
      value: publishedCategories,
      badge: formatPercent(publishedCategories, totalCategories),
      icon: FaCheckCircle,
      color: "published",
      footerLeft: `${publishedGrowth >= 0 ? "+" : ""}${publishedGrowth}% vs last month`,
      footerRight: formatPercent(publishedCategories, totalCategories),
    },
    {
      key: "draft",
      title: "Draft",
      value: draftCategories,
      badge: formatPercent(draftCategories, totalCategories),
      icon: FaEdit,
      color: "draft",
      footerLeft: "-4.2% vs last month",
      footerRight: formatPercent(draftCategories, totalCategories),
    },
    {
      key: "archived",
      title: "Archived",
      value: archivedCategories,
      badge: "Review",
      icon: FaArchive,
      color: "archived",
      footerLeft: "+2.1% vs last month",
      footerRight: archivedCategories + " archived",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
      {cards.map((card) => {
        const gradient = gradientMap[card.color];
        // Map color to Tailwind text classes
        const textColorMap = {
          total: "text-rose-600 dark:text-rose-400",
          published: "text-teal-600 dark:text-teal-400",
          draft: "text-amber-600 dark:text-amber-400",
          archived: "text-violet-600 dark:text-violet-400",
        };
        const glowColorMap = {
          total: "bg-rose-500/10",
          published: "bg-teal-500/10",
          draft: "bg-amber-500/10",
          archived: "bg-violet-500/10",
        };
        const textColor = textColorMap[card.color];
        const glowClass = glowColorMap[card.color];

        return (
          <Wrapper key={card.key} className="p-6 relative overflow-hidden group">
            {/* Floating glows */}
            <div className={`absolute -bottom-20 -right-20 w-56 h-56 ${glowClass} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />
            <div className={`absolute -top-20 -left-20 w-56 h-56 ${glowClass} rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} />

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`size-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  <card.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{card.subtitle}</p>
                </div>
              </div>
              {/* Badge */}
              {card.badge && <div className={`text-xs font-semibold px-2 py-1 rounded-full bg-${card.color}-500/10 ${textColor}`}>{card.badge}</div>}
            </div>

            {/* Value */}
            <div className="mt-2">
              <h2 className={`text-4xl font-extrabold tracking-tight ${textColor}`}>{card.value}</h2>
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

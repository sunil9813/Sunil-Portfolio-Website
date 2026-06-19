import { Wrapper } from "@/utils/Router";
import { FaEye, FaHeart, FaComment } from "react-icons/fa";
import { GiTrophy, GiGrowth, GiNewBorn } from "react-icons/gi";

// Enhanced gradient map with richer colors
const gradientMap = {
  top: "from-amber-500 via-orange-500 to-red-500",
  liked: "from-blue-500 via-cyan-500 to-teal-500",
  trending: "from-green-500 via-emerald-500 to-teal-500",
  views: "from-purple-500 via-violet-500 to-fuchsia-500",
  comments: "from-pink-500 via-rose-500 to-red-500",
  new: "from-teal-500 via-cyan-500 to-sky-500",
};

// Text color classes
const textColorMap = {
  top: "text-amber-600 dark:text-amber-400",
  liked: "text-blue-600 dark:text-blue-400",
  trending: "text-green-600 dark:text-green-400",
  views: "text-purple-600 dark:text-purple-400",
  comments: "text-pink-600 dark:text-pink-400",
  new: "text-teal-600 dark:text-teal-400",
};

// Glow backgrounds
const glowMap = {
  top: "bg-amber-500/10",
  liked: "bg-blue-500/10",
  trending: "bg-green-500/10",
  views: "bg-purple-500/10",
  comments: "bg-pink-500/10",
  new: "bg-teal-500/10",
};

// Card data with enhanced details
const cards = [
  {
    id: "trending",
    title: "Trending",
    icon: GiGrowth,
    gradientKey: "trending",
    main: { label: "Next.js 14", value: "+32%", unit: "growth" },
    footerLeft: { icon: GiGrowth, text: "Weekly growth" },
    footerRight: { icon: FaEye, text: "+32% vs last" },
    trend: "+32%",
  },

  {
    id: "comments",
    title: "Comments",
    icon: FaComment,
    gradientKey: "comments",
    main: { value: "1,284", unit: "comments" },
    footerLeft: { icon: FaComment, text: "This month" },
    footerRight: { icon: GiGrowth, text: "Avg 42/day" },
    trend: "+5%",
  },
  {
    id: "new",
    title: "New Posts",
    icon: GiNewBorn,
    gradientKey: "new",
    main: { value: "5", unit: "posts" },
    footerLeft: { icon: GiNewBorn, text: "This week" },
    footerRight: { icon: GiGrowth, text: "+2 vs last" },
    trend: "+2",
  },
];

export const BlogInsightsPanel = () => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-3">
      {cards.map((card) => {
        const gradient = gradientMap[card.gradientKey];
        const textColor = textColorMap[card.gradientKey];
        const glowClass = glowMap[card.gradientKey];

        return (
          <Wrapper key={card.id} className="p-6 relative overflow-hidden group">
            {/* Floating glows with enhanced blur */}
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 ${glowClass} rounded-full blur-3xl opacity-60 group-hover:scale-150 transition-all duration-1000`} />
            <div className={`absolute -top-20 -left-20 w-64 h-64 ${glowClass} rounded-full blur-3xl opacity-60 group-hover:scale-150 transition-all duration-1000`} />

            {/* Subtle diagonal pattern overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`diagonal-${card.id}`} patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" className="text-gray-400" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#diagonal-${card.id})`} />
              </svg>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`size-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</h4>
                  {card.main.label && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[100px] group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{card.main.label}</p>
                  )}
                </div>
              </div>
              {/* Small trend badge */}
              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-white/50 dark:bg-gray-800/50 ${textColor}`}>{card.trend}</span>
            </div>

            {/* Value with subtle hover effect */}
            <div className="mb-1 group-hover:translate-x-0.5 transition-transform duration-300">
              <span className={`text-4xl font-bold ${textColor}`}>{card.main.value}</span>
              {card.main.unit && <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">{card.main.unit}</span>}
            </div>

            {/* Enhanced footer with icons */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700/50 flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <card.footerLeft.icon size={10} className="opacity-70" />
                <span>{card.footerLeft.text}</span>
              </div>
              <div className="flex items-center gap-1">
                <card.footerRight.icon size={10} className="opacity-70" />
                <span>{card.footerRight.text}</span>
              </div>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};

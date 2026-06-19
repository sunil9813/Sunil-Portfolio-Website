import { Wrapper } from "@/utils/Router";
import { FaFileAlt, FaClock, FaCheckCircle, FaArchive, FaArrowUp, FaArrowDown, FaEllipsisH } from "react-icons/fa";

// Fresh color palette - modern and vibrant
const colorSchemes = {
  blue: {
    gradient: "from-blue-400 via-indigo-500 to-blue-600",
    accent: "bg-blue-500",
    light: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    shadow: "shadow-blue-500/20",
    chart: "#3B82F6",
  },
  emerald: {
    gradient: "from-emerald-400 via-green-500 to-emerald-600",
    accent: "bg-emerald-500",
    light: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    shadow: "shadow-emerald-500/20",
    chart: "#10B981",
  },
  amber: {
    gradient: "from-amber-400 via-orange-500 to-amber-600",
    accent: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    shadow: "shadow-amber-500/20",
    chart: "#F59E0B",
  },
  purple: {
    gradient: "from-purple-400 via-fuchsia-500 to-purple-600",
    accent: "bg-purple-500",
    light: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    shadow: "shadow-purple-500/20",
    chart: "#8B5CF6",
  },
};

// Mini sparkline component
const Sparkline = ({ color, trend = "up" }) => {
  const points = trend === "up" ? [10, 25, 15, 35, 25, 45, 40] : [40, 35, 45, 25, 30, 15, 20];

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min;
  const height = 30;
  const width = 60;

  const normalizedPoints = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="opacity-70">
      <polyline points={normalizedPoints} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" className="drop-shadow-lg" />
      <circle cx={width} cy={normalizedPoints.split(" ").pop().split(",")[1]} r="3" fill={color} />
    </svg>
  );
};

export const BlogStatsCards = ({ totalPosts, publishedPosts, draftPosts, scheduledPosts, viewsGrowth }) => {
  const cards = [
    {
      title: "Total Posts",
      value: totalPosts,
      subtitle: "All time posts",
      icon: FaFileAlt,
      color: "blue",
      metric: "Total content",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Published",
      value: publishedPosts,
      subtitle: `+${viewsGrowth}% from last month`,
      icon: FaCheckCircle,
      color: "emerald",
      metric: "Live now",
      change: `+${viewsGrowth}%`,
      trend: "up",
    },
    {
      title: "Drafts",
      value: draftPosts,
      subtitle: "Need review",
      icon: FaClock,
      color: "amber",
      metric: "In progress",
      change: "-4.2%",
      trend: "down",
    },
    {
      title: "Scheduled",
      value: scheduledPosts,
      subtitle: "Ready to publish",
      icon: FaArchive,
      color: "purple",
      metric: "Upcoming",
      change: "+2.1%",
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {cards.map((card, index) => {
        const scheme = colorSchemes[card.color];

        return (
          <Wrapper key={index} className="relative overflow-hidden">
            {/* Main card content */}
            <div className={`p-5 relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl`}>
              {/* Animated gradient background - now static but subtle */}
              <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-5 rounded-2xl`} />

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-3xl -ml-10 -mb-10 opacity-50" />

              {/* Header with icon and menu */}
              <div className="flex items-start justify-between mb-4 relative">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br ${scheme.gradient} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
                      <card.icon size={20} />
                    </div>
                    <div className={`absolute -inset-1 ${scheme.accent} rounded-2xl opacity-20 blur-md`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.metric}</p>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{card.title}</h4>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <FaEllipsisH size={14} />
                </button>
              </div>

              {/* Main value and sparkline */}
              <div className="flex items-end justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${scheme.text}`}>{card.value}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${scheme.light} ${scheme.text} border ${scheme.border}`}>{card.change}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{card.subtitle}</span>
                  </div>
                </div>
                <Sparkline color={scheme.chart} trend={card.trend} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Completion</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${scheme.accent} rounded-full`} style={{ width: `${Math.min((card.value / totalPosts) * 100, 100)}%` }} />
                    </div>
                    <span className={`text-xs font-medium ${scheme.text}`}>{Math.round((card.value / totalPosts) * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Trend</p>
                  <div className="flex items-center gap-1">
                    {card.trend === "up" ? <FaArrowUp className="text-emerald-500" size={10} /> : <FaArrowDown className="text-red-500" size={10} />}
                    <span className={`text-xs font-medium ${card.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>{card.change}</span>
                  </div>
                </div>
              </div>

              {/* Floating particles - now static but visible */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 h-1 ${scheme.accent} rounded-full opacity-20`}
                    style={{
                      top: `${20 + i * 30}%`,
                      left: `${80 + (i % 2) * 10}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Decorative background elements */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${scheme.gradient} rounded-2xl opacity-20 blur-xl -z-10`} />
            <div className={`absolute -inset-1 bg-gradient-to-r ${scheme.gradient} rounded-2xl opacity-10 blur-2xl -z-20`} />
          </Wrapper>
        );
      })}
    </div>
  );
};

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { HeadingTwo, Wrapper } from "@/utils/Router";
import { FaChartBar } from "react-icons/fa";

const categoriesData = [
  { name: "Technology", posts: 4200, icon: "💻", status: "published", growth: "+12%" },
  { name: "Lifestyle", posts: 3800, icon: "🌿", status: "published", growth: "+8%" },
  { name: "Business", posts: 5200, icon: "📊", status: "published", growth: "+15%" },
  { name: "Health", posts: 6800, icon: "🏥", status: "published", growth: "+21%" },
  { name: "Education", posts: 3400, icon: "📚", status: "draft", growth: "-3%" },
  { name: "Travel", posts: 2900, icon: "✈️", status: "published", growth: "+5%" },
  { name: "Food", posts: 4100, icon: "🍳", status: "published", growth: "+10%" },
  { name: "Fashion", posts: 2300, icon: "👗", status: "archived", growth: "-2%" },
  { name: "Sports", posts: 3100, icon: "⚽", status: "published", growth: "+7%" },
  { name: "Gaming", posts: 1900, icon: "🎮", status: "draft", growth: "+18%" },
];

const colors = ["#8b5cf6", "#22d3ee", "#fbbf24", "#f87171", "#4ade80", "#a78bfa", "#60a5fa", "#f472b6", "#f97316", "#94a3b8"];

const statusColors = {
  published: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  draft: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  archived: "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30",
};

// Custom tooltip (kept as is, but ensure styling matches other cards)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data) return null;

    const growthValue = data.growth || "0%";
    const isPositive = growthValue.startsWith("+");
    const growthColor = isPositive ? "text-green-500" : "text-red-500";

    return (
      <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl shadow-lg backdrop-blur-2xl border border-gray-200 dark:border-gray-50/20 min-w-[200px]">
        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-700/10 dark:border-gray-50/10">
          <span className="text-3xl">{data.icon}</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-200">Total Posts:</span>
            <span className="font-bold text-gray-900 dark:text-white">{data.posts.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-200">Growth:</span>
            <span className={`font-bold ${growthColor}`}>{growthValue}</span>
          </div>
        </div>
        {data.status && (
          <div className="mt-3 pt-3 border-t border-gray-700/10 dark:border-gray-50/10">
            <span className={`text-xs px-3 py-1 rounded-full capitalize inline-block ${statusColors[data.status]}`}>{data.status}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const PopularCategories = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  const handleMouseOver = (data, index) => setActiveIndex(index);
  const handleMouseLeave = () => setActiveIndex(null);

  // Summary stats
  const totalPosts = categoriesData.reduce((sum, cat) => sum + cat.posts, 0);
  const topCategory = [...categoriesData].sort((a, b) => b.posts - a.posts)[0];

  return (
    <Wrapper className="p-6 relative overflow-hidden group my-3">
      {/* Floating glow backgrounds – fresh amber & blue */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header with icon + title and time range toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-amber-500 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <FaChartBar size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Popular Categories</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Post distribution across categories</p>
          </div>
        </div>

        {/* Time range selector (pill group) */}
        <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all capitalize ${
                timeRange === range ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart area – adjusted height to match other charts */}
      <div className="h-[398px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoriesData} barSize={45} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <XAxis hide={true} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} wrapperStyle={{ outline: "none" }} />
            <Bar dataKey="posts" radius={[8, 8, 8, 8]} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} isAnimationActive={true}>
              {categoriesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} opacity={activeIndex === index ? 1 : 0.8} className="transition-all duration-200 hover:opacity-100" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category labels (inline with bars) – kept as original */}
      <div className="flex justify-between items-center mt-2">
        {categoriesData.map((category, index) => {
          const isActive = activeIndex === index;
          const barColor = colors[index];

          return (
            <div key={category.name} className="text-center" style={{ width: `${100 / categoriesData.length}%` }}>
              <div
                className="text-xs font-medium transition-all duration-200 cursor-default"
                style={{
                  color: barColor,
                  opacity: isActive ? 1 : 0.9,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                {category.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with summary stats – two items */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span>Total posts: {totalPosts.toLocaleString()}</span>
        <span>
          Top: {topCategory.name} ({topCategory.posts.toLocaleString()})
        </span>
      </div>
    </Wrapper>
  );
};

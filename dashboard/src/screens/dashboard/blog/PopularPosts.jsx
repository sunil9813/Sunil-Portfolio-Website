import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Sector } from "recharts";
import { Wrapper } from "@/utils/Router";
import { FaTag, FaChartBar, FaChartPie } from "react-icons/fa";

// Sample categories data with more metrics
const categoriesData = [
  {
    name: "Technology",
    posts: 42,
    views: 125000,
    likes: 8430,
    comments: 1240,
    engagement: 68,
    growth: 23,
    color: "#3B82F6", // blue
  },
  {
    name: "Health",
    posts: 68,
    views: 168000,
    likes: 12400,
    comments: 2100,
    engagement: 82,
    growth: 21,
    color: "#10B981", // emerald
  },
  {
    name: "Business",
    posts: 52,
    views: 152000,
    likes: 9210,
    comments: 1560,
    engagement: 74,
    growth: 32,
    color: "#F59E0B", // amber
  },
  {
    name: "Lifestyle",
    posts: 38,
    views: 98000,
    likes: 7210,
    comments: 980,
    engagement: 65,
    growth: 18,
    color: "#EC4899", // pink
  },
  {
    name: "Education",
    posts: 34,
    views: 84000,
    likes: 6340,
    comments: 870,
    engagement: 59,
    growth: -3,
    color: "#8B5CF6", // purple
  },
  {
    name: "Travel",
    posts: 29,
    views: 79000,
    likes: 5430,
    comments: 720,
    engagement: 54,
    growth: 5,
    color: "#14B8A6", // teal
  },
];

// Sample tags data with counts
const tagsData = [
  { name: "react", count: 28, views: 45000, color: "#3B82F6" },
  { name: "javascript", count: 24, views: 38000, color: "#F59E0B" },
  { name: "nextjs", count: 19, views: 32000, color: "#000000" },
  { name: "typescript", count: 17, views: 29000, color: "#2F74C0" },
  { name: "tailwind", count: 15, views: 26000, color: "#38BDF8" },
  { name: "css", count: 14, views: 23000, color: "#EC4899" },
  { name: "html", count: 13, views: 21000, color: "#E34F26" },
  { name: "node", count: 12, views: 19000, color: "#68A063" },
  { name: "python", count: 11, views: 18000, color: "#3776AB" },
  { name: "mongodb", count: 9, views: 15000, color: "#47A248" },
  { name: "docker", count: 7, views: 12000, color: "#2496ED" },
  { name: "aws", count: 6, views: 10000, color: "#FF9900" },
];

// Custom tooltip for category bar chart
const CategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-lg shadow-lg backdrop-blur-xl border border-gray-200 dark:border-gray-700 min-w-[200px]">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{data.name}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.posts}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Views</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{(data.views / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Likes</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{(data.likes / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Comments</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.comments}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Engagement</span>
              <span className={`text-sm font-semibold ${data.engagement >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{data.engagement}%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Growth</span>
              <span className={`text-sm font-semibold ${data.growth >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {data.growth >= 0 ? "+" : ""}
                {data.growth}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom tooltip for tag bar chart
const TagTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-lg shadow-lg backdrop-blur-xl border border-gray-200 dark:border-gray-700 min-w-[200px]">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">#{data.name}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Usage count</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.count} posts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total views</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{(data.views / 1000).toFixed(1)}K</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(data.count / 30) * 100}%`,
                backgroundColor: data.color,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom active shape for pie chart
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} className="drop-shadow-lg" />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 2} outerRadius={innerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.3} />
      <text x={cx} y={cy - 15} textAnchor="middle" fill="#6B7280" className="text-xs dark:text-gray-400">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {value}
      </text>
      <text x={cx} y={cy + 25} textAnchor="middle" fill="#6B7280" className="text-[8px] dark:text-gray-400">
        posts
      </text>
    </g>
  );
};

// Category Bar Chart Component
const CategoryBarChart = ({ data, metric, onMetricChange }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const metrics = [
    { key: "posts", label: "Posts", icon: "📝" },
    { key: "views", label: "Views", icon: "👁️" },
    { key: "likes", label: "Likes", icon: "❤️" },
  ];

  // Sort data based on selected metric
  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);

  return (
    <Wrapper className="p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FaChartBar size={16} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Categories Performance</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Distribution by {metric}</p>
          </div>
        </div>
        {/* 
        {/* Metric selector 
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => onMetricChange(m.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                metric === m.key ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Bar Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} width={70} />
            <Tooltip content={<CategoryTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey={metric} radius={[0, 8, 8, 0]} onMouseOver={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === index ? 1 : 0.8} className="transition-opacity duration-300" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Total categories: {data.length}</span>
          <span>
            Top: {sortedData[0].name} ({sortedData[0][metric].toLocaleString()})
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

// Tag Bar Chart Component
const TagBarChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartType, setChartType] = useState("bar"); // "bar" or "pie"
  const [activePieIndex, setActivePieIndex] = useState(0);

  // Sort data by count
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

  const onPieEnter = (_, index) => {
    setActivePieIndex(index);
  };

  return (
    <Wrapper className="p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <FaTag size={16} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Popular Tags</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Top 10 tags by usage</p>
          </div>
        </div>

        {/* Chart type toggle */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              chartType === "bar" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <FaChartBar size={12} />
            Bar
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
              chartType === "pie" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <FaChartPie size={12} />
            Pie
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={sortedData} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} width={70} tickFormatter={(value) => `#${value}`} />
              <Tooltip content={<TagTooltip />} cursor={{ fill: "transparent" }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} onMouseOver={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} opacity={activeIndex === index ? 1 : 0.8} className="transition-opacity duration-300" />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie activeIndex={activePieIndex} activeShape={renderActiveShape} data={sortedData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="count" onMouseEnter={onPieEnter}>
                {sortedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<TagTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer stats */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Total tags: {data.length}</span>
          <span>
            Most used: #{sortedData[0].name} ({sortedData[0].count})
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

// Main Component
export const CategoryAndTagCharts = () => {
  const [categoryMetric, setCategoryMetric] = useState("posts");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 my-3">
      <CategoryBarChart data={categoriesData} metric={categoryMetric} onMetricChange={setCategoryMetric} />
      <TagBarChart data={tagsData} />
    </div>
  );
};

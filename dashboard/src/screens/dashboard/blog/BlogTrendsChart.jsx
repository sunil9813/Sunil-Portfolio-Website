import { Wrapper } from "@/utils/Router";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaFileAlt } from "react-icons/fa";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";

// New color palette (different from both original and ActiveReadingTimes)
const colors = {
  total: {
    current: "#3B82F6", // blue
    last: "#1E3A8A", // dark blue
    gradient: "linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)",
    light: "#EFF6FF",
  },
  published: {
    current: "#10B981", // green
    last: "#065F46", // dark green
    gradient: "linear-gradient(180deg, #10B981 0%, #059669 100%)",
    light: "#ECFDF5",
  },
  draft: {
    current: "#F59E0B", // amber
    last: "#B45309", // dark amber
    gradient: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
    light: "#FFFBEB",
  },
  scheduled: {
    current: "#8B5CF6", // violet
    last: "#5B21B6", // dark violet
    gradient: "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)",
    light: "#F5F3FF",
  },
};

// Custom tooltip with updated colors
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg shadow-lg backdrop-blur-2xl min-w-[260px]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="size-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "#3B82F620",
              border: "1px solid #3B82F640",
            }}
          >
            <FaFileAlt size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{label}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Blog Performance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {payload.map((entry, index) => (
            <div key={index} className="dark:bg-gray-50/5 bg-gray-500/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {entry.dataKey === "total" ? "Total Posts" : entry.dataKey === "published" ? "Published" : entry.dataKey === "draft" ? "Drafts" : "Scheduled"}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{entry.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Real-time data simulation (unchanged)
const useRealTimeData = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const lastIndex = newData.length - 1;

        newData[lastIndex] = {
          ...newData[lastIndex],
          total: Math.max(50, newData[lastIndex].total + Math.floor(Math.random() * 3) - 1),
          published: Math.max(20, newData[lastIndex].published + Math.floor(Math.random() * 2) - 1),
          draft: Math.max(10, newData[lastIndex].draft + Math.floor(Math.random() * 2) - 1),
          scheduled: Math.max(5, newData[lastIndex].scheduled + Math.floor(Math.random() * 2) - 1),
          growthRate: Math.floor(Math.random() * 30) - 10,
        };

        return newData;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, []);

  return data;
};

// Generate initial data (unchanged)
const generateBlogData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    total: 50 + Math.floor(Math.random() * 30),
    published: 25 + Math.floor(Math.random() * 20),
    draft: 15 + Math.floor(Math.random() * 15),
    scheduled: 8 + Math.floor(Math.random() * 10),
    growthRate: Math.floor(Math.random() * 30) - 10,
    timestamp: new Date(2024, index).getTime(),
  }));
};

export const BlogTrendsChart = () => {
  const [showDraftTrend, setShowDraftTrend] = useState(true);
  const [showPublishedTrend, setShowPublishedTrend] = useState(true);
  const [showTotalTrend, setShowTotalTrend] = useState(true);
  const [showScheduledTrend, setShowScheduledTrend] = useState(true);
  const [chartType, setChartType] = useState("area");

  const yearlyData = useRealTimeData(generateBlogData());

  // Calculate average for footer summary
  const avgTotal = Math.round(yearlyData.reduce((acc, d) => acc + d.total, 0) / yearlyData.length);
  const avgPublished = Math.round(yearlyData.reduce((acc, d) => acc + d.published, 0) / yearlyData.length);

  const COLOR_CLASSES = {
    total: {
      active: "text-blue-500",
      inactive: "text-gray-600 dark:text-gray-400",
    },
    published: {
      active: "text-green-500",
      inactive: "text-gray-600 dark:text-gray-400",
    },
    draft: {
      active: "text-orange-500",
      inactive: "text-gray-600 dark:text-gray-400",
    },
    scheduled: {
      active: "text-purple-600",
      inactive: "text-gray-600 dark:text-gray-400",
    },
  };
  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating Glow Backgrounds - two layers like ActiveReadingTimes */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      {/* Header - matching ActiveReadingTimes style */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <FaFileAlt size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Blog Performance Analytics</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Real-time post trends</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Toggle Buttons - styled like ActiveReadingTimes legend area */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <button
              onClick={() => setShowTotalTrend(!showTotalTrend)}
              className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${showTotalTrend ? COLOR_CLASSES.total.active : COLOR_CLASSES.total.inactive}`}
            >
              {showTotalTrend ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>Total</span>
            </button>

            <button
              onClick={() => setShowPublishedTrend(!showPublishedTrend)}
              className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                showPublishedTrend ? COLOR_CLASSES.published.active : COLOR_CLASSES.published.inactive
              }`}
            >
              {showPublishedTrend ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>Published</span>
            </button>

            <button
              onClick={() => setShowDraftTrend(!showDraftTrend)}
              className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${showDraftTrend ? COLOR_CLASSES.draft.active : COLOR_CLASSES.draft.inactive}`}
            >
              {showDraftTrend ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>Drafts</span>
            </button>

            <button
              onClick={() => setShowScheduledTrend(!showScheduledTrend)}
              className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                showScheduledTrend ? COLOR_CLASSES.scheduled.active : COLOR_CLASSES.scheduled.inactive
              }`}
            >
              {showScheduledTrend ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>Scheduled</span>
            </button>
          </div>

          {/* Chart type toggle - placed in header right side */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <button
              onClick={() => setChartType("area")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                chartType === "area" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                chartType === "line" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container - adjusted margins to fit card padding */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={yearlyData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-700" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} className="dark:text-gray-400" height={30} dy={5} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} className="dark:text-gray-400" width={30} dx={-3} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

              {showTotalTrend && <Area type="monotone" dataKey="total" stroke={colors.total.current} fill="url(#totalGradient)" strokeWidth={2} name="Total Posts" />}
              {showPublishedTrend && <Area type="monotone" dataKey="published" stroke={colors.published.current} fill="url(#publishedGradient)" strokeWidth={2} name="Published" />}
              {showDraftTrend && <Area type="monotone" dataKey="draft" stroke={colors.draft.current} fill="url(#draftGradient)" strokeWidth={2} name="Drafts" />}
              {showScheduledTrend && <Area type="monotone" dataKey="scheduled" stroke={colors.scheduled.current} fill="url(#scheduledGradient)" strokeWidth={2} name="Scheduled" />}

              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.total.current} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors.total.current} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="publishedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.published.current} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors.published.current} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="draftGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.draft.current} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors.draft.current} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.scheduled.current} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors.scheduled.current} stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          ) : (
            <LineChart data={yearlyData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-700" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} className="dark:text-gray-400" height={30} dy={5} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} className="dark:text-gray-400" width={30} dx={-3} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

              {showTotalTrend && (
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke={colors.total.current}
                  strokeWidth={3}
                  dot={{ r: 3, fill: colors.total.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Total Posts"
                />
              )}
              {showPublishedTrend && (
                <Line
                  type="monotone"
                  dataKey="published"
                  stroke={colors.published.current}
                  strokeWidth={3}
                  dot={{ r: 3, fill: colors.published.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Published"
                />
              )}
              {showDraftTrend && (
                <Line type="monotone" dataKey="draft" stroke={colors.draft.current} strokeWidth={3} dot={{ r: 3, fill: colors.draft.current, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Drafts" />
              )}
              {showScheduledTrend && (
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  stroke={colors.scheduled.current}
                  strokeWidth={3}
                  dot={{ r: 3, fill: colors.scheduled.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Scheduled"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Footer with summary - matching ActiveReadingTimes style */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span>Avg. total: {avgTotal} posts/mo</span>
        <span>Avg. published: {avgPublished} posts/mo</span>
      </div>
    </Wrapper>
  );
};

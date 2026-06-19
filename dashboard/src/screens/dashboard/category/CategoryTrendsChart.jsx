import { HeadingTwo, Wrapper } from "@/utils/Router";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaList } from "react-icons/fa";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from "recharts";

// New color palette for categories – pink, teal, coral, slate
const colors = {
  total: {
    current: "#EC4899", // pink
    last: "#BE185D",
    gradient: "linear-gradient(180deg, #EC4899 0%, #DB2777 100%)",
    light: "#FCE7F3",
  },
  published: {
    current: "#14B8A6", // teal
    last: "#0F766E",
    gradient: "linear-gradient(180deg, #14B8A6 0%, #0D9488 100%)",
    light: "#CCFBF1",
  },
  draft: {
    current: "#F97316", // orange/coral
    last: "#C2410C",
    gradient: "linear-gradient(180deg, #F97316 0%, #EA580C 100%)",
    light: "#FFEDD5",
  },
  archived: {
    current: "#64748B", // slate
    last: "#334155",
    gradient: "linear-gradient(180deg, #64748B 0%, #475569 100%)",
    light: "#F1F5F9",
  },
};

// Text color classes for active/inactive states
const COLOR_CLASSES = {
  total: {
    active: "text-pink-500",
    inactive: "text-gray-600 dark:text-gray-400",
  },
  published: {
    active: "text-teal-500",
    inactive: "text-gray-600 dark:text-gray-400",
  },
  draft: {
    active: "text-orange-500",
    inactive: "text-gray-600 dark:text-gray-400",
  },
  archived: {
    active: "text-slate-500",
    inactive: "text-gray-600 dark:text-gray-400",
  },
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg shadow-lg backdrop-blur-2xl border border-gray-200 dark:border-gray-700 min-w-[260px]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "#FCE7F3",
              border: "1px solid #EC489940",
            }}
          >
            <FaList size={16} className="text-pink-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{label}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Category Performance</p>
          </div>
        </div>

        <div className="space-y-3">
          {payload.map((entry, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {entry.dataKey === "total" ? "Total Categories" : entry.dataKey === "published" ? "Published" : entry.dataKey === "draft" ? "Draft" : "Archived"}
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

// Real-time data simulation (includes archived)
const useRealTimeData = (initialData, interval = 5000) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData];
        const lastIndex = newData.length - 1;

        newData[lastIndex] = {
          ...newData[lastIndex],
          total: Math.max(200, newData[lastIndex].total + Math.floor(Math.random() * 10) - 5),
          published: Math.max(30, newData[lastIndex].published + Math.floor(Math.random() * 5) - 2),
          draft: Math.max(120, newData[lastIndex].draft + Math.floor(Math.random() * 8) - 4),
          archived: Math.max(20, newData[lastIndex].archived + Math.floor(Math.random() * 5) - 2),
        };
        return newData;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, []);

  return data;
};

// Generate initial data
const generateCategoryData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    total: 200 + Math.floor(Math.random() * 150),
    published: 30 + Math.floor(Math.random() * 40),
    draft: 150 + Math.floor(Math.random() * 50),
    archived: 20 + Math.floor(Math.random() * 20),
    timestamp: new Date(2024, index).getTime(),
  }));
};

export const CategoryTrendsChart = () => {
  const [showDraftTrend, setShowDraftTrend] = useState(true);
  const [showPublishedTrend, setShowPublishedTrend] = useState(true);
  const [showTotalTrend, setShowTotalTrend] = useState(true);
  const [showArchivedTrend, setShowArchivedTrend] = useState(false);
  const [chartType, setChartType] = useState("area");

  const yearlyData = useRealTimeData(generateCategoryData());

  // Calculate summary stats for footer
  const avgTotal = Math.round(yearlyData.reduce((acc, d) => acc + d.total, 0) / yearlyData.length);
  const peakMonthData = [...yearlyData].sort((a, b) => b.total - a.total)[0];
  const peakMonth = peakMonthData?.month || "Dec";

  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating glow backgrounds – pink and teal */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-pink-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header with icon + title and toggles */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-pink-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <FaList size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Category Performance Analytics</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Real-time category trends</p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Visibility buttons */}
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
              <span>Draft</span>
            </button>
            <button
              onClick={() => setShowArchivedTrend(!showArchivedTrend)}
              className={`px-2 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
                showArchivedTrend ? COLOR_CLASSES.archived.active : COLOR_CLASSES.archived.inactive
              }`}
            >
              {showArchivedTrend ? <FaEye size={12} /> : <FaEyeSlash size={12} />}
              <span>Archived</span>
            </button>
          </div>

          {/* Chart type toggle */}
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

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-700" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} className="dark:text-gray-400" height={30} dy={5} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} className="dark:text-gray-400" width={30} dx={-3} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

              {showTotalTrend && <Area type="monotone" dataKey="total" stroke={colors.total.current} fill="url(#totalGradient)" strokeWidth={2} name="Total Categories" />}
              {showPublishedTrend && <Area type="monotone" dataKey="published" stroke={colors.published.current} fill="url(#publishedGradient)" strokeWidth={2} name="Published" />}
              {showDraftTrend && <Area type="monotone" dataKey="draft" stroke={colors.draft.current} fill="url(#draftGradient)" strokeWidth={2} name="Draft" />}
              {showArchivedTrend && <Area type="monotone" dataKey="archived" stroke={colors.archived.current} fill="url(#archivedGradient)" strokeWidth={2} name="Archived" />}

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
                <linearGradient id="archivedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.archived.current} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={colors.archived.current} stopOpacity={0} />
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
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors.total.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Total Categories"
                />
              )}
              {showPublishedTrend && (
                <Line
                  type="monotone"
                  dataKey="published"
                  stroke={colors.published.current}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors.published.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Published"
                />
              )}
              {showDraftTrend && (
                <Line type="monotone" dataKey="draft" stroke={colors.draft.current} strokeWidth={2.5} dot={{ r: 3, fill: colors.draft.current, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Draft" />
              )}
              {showArchivedTrend && (
                <Line
                  type="monotone"
                  dataKey="archived"
                  stroke={colors.archived.current}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: colors.archived.current, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                  name="Archived"
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer with summary */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span>Peak month: {peakMonth}</span>
        <span>Avg. total: {avgTotal} categories</span>
      </div>
    </Wrapper>
  );
};

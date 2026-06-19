import { Wrapper } from "@/utils/Router";
import { useState } from "react";
import { FaArrowUp, FaArrowDown, FaChartLine } from "react-icons/fa";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Sample monthly data
const monthlyData = [
  { month: "Jan", views: 425000 },
  { month: "Feb", views: 388000 },
  { month: "Mar", views: 452000 },
  { month: "Apr", views: 489000 },
  { month: "May", views: 523000 },
  { month: "Jun", views: 568000 },
  { month: "Jul", views: 612000 },
  { month: "Aug", views: 658000 },
  { month: "Sep", views: 695000 },
  { month: "Oct", views: 742000 },
  { month: "Nov", views: 798000 },
  { month: "Dec", views: 856000 },
];

// Quarterly data
const quarterlyData = [
  { quarter: "Q1", views: 1265000 },
  { quarter: "Q2", views: 1580000 },
  { quarter: "Q3", views: 1965000 },
  { quarter: "Q4", views: 2396000 },
];

export const BlogViewStats = () => {
  const [timeframe, setTimeframe] = useState("yearly");
  const [viewType, setViewType] = useState("monthly"); // monthly or quarterly

  // Stats
  const formattedTotal = "7.2m";
  const trendPercentage = 24.8;
  const isTrendPositive = trendPercentage > 0;

  const chartData = viewType === "monthly" ? monthlyData : quarterlyData;
  const dataKey = viewType === "monthly" ? "month" : "quarter";

  const avgMonthly = "600k";
  const bestMonth = "Dec";
  const quarterlyGrowth = "+32%";

  return (
    <Wrapper className="p-6 my-3 relative overflow-hidden group">
      {/* Floating glow backgrounds – warm tones */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-pink-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header with icon + title on left, toggles on right */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
            <FaChartLine size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Blog Views</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Annual performance</p>
          </div>
        </div>

        {/* Combined toggle group – matches the style of BlogTrendsChart */}
        <div className="flex items-center gap-2">
          {/* Monthly/Quarterly toggle */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <button
              onClick={() => setViewType("monthly")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                viewType === "monthly" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewType("quarterly")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                viewType === "quarterly" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Quarterly
            </button>
          </div>

          {/* Year selector (same pill style) */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <button
              onClick={() => setTimeframe("yearly")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                timeframe === "yearly" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              2024
            </button>
            <button
              onClick={() => setTimeframe("lastYear")}
              className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                timeframe === "lastYear" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              2023
            </button>
          </div>
        </div>
      </div>

      {/* Main stat with trend */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{formattedTotal}</span>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isTrendPositive ? "text-green-500" : "text-red-500"}`}>
          {isTrendPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
          {trendPercentage}%
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">vs last year</p>

      {/* Chart – compact with proper XAxis */}
      <div className="h-24 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-700" />
            <XAxis
              dataKey={dataKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 9 }}
              className="dark:text-gray-400"
              dy={5}
              interval={viewType === "monthly" ? 2 : 0} // show every 3rd month
            />
            <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {label}: {payload[0].value.toLocaleString()} views
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="views" stroke="#F97316" strokeWidth={2} dot={{ r: 2, fill: "#F97316", strokeWidth: 0 }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Three small metric cards – styled like a compact grid */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div className="highlightbg rounded-lg p-2">
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">Avg. Monthly</p>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{avgMonthly}</p>
        </div>
        <div className="highlightbg rounded-lg p-2">
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">Peak Month</p>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">{bestMonth}</p>
        </div>
        <div className="highlightbg rounded-lg p-2">
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">Q4 Growth</p>
          <p className="text-xs font-semibold text-green-500">{quarterlyGrowth}</p>
        </div>
      </div>

      {/* Footer with two items – matches ActiveReadingTimes pattern */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Peak season: Q4 (Oct-Dec)
        </span>
        <span>{trendPercentage}% vs last year</span>
      </div>
    </Wrapper>
  );
};

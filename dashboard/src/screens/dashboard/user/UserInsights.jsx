import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Filter, Users, UserPlus, Activity, Calendar, BarChart3, Target, Sparkles, Zap, CalendarDays } from "lucide-react";
import { FaChartLine, FaRocket, FaUsers } from "react-icons/fa";
import { TbArrowNarrowUp, TbArrowNarrowDown } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { HeadingOne, HeadingThree, HeadingTwo, IncreaseWrapper, InputLabel, Wrapper } from "@/utils/Router";
import { FilterDropdownbyDays } from "@/components/common/dropdown/CustomeDropDown";

// Enhanced user insights data
const userInsightsData = [
  {
    month: "Jan",
    currentYear: { total: 152000, new: 12500, active: 124000 },
    lastYear: { total: 142000, new: 12500, active: 114000 },
    retention: 85.2,
    engagement: 72.4,
  },
  {
    month: "Feb",
    currentYear: { total: 155000, new: 16500, active: 128000 },
    lastYear: { total: 144000, new: 15000, active: 116000 },
    retention: 86.5,
    engagement: 73.8,
  },
  {
    month: "Mar",
    currentYear: { total: 158000, new: 18000, active: 130000 },
    lastYear: { total: 148000, new: 17000, active: 120000 },
    retention: 87.1,
    engagement: 74.5,
  },
  {
    month: "Apr",
    currentYear: { total: 162000, new: 19500, active: 134000 },
    lastYear: { total: 151000, new: 18000, active: 123000 },
    retention: 87.8,
    engagement: 75.2,
  },
  {
    month: "May",
    currentYear: { total: 165000, new: 21000, active: 138000 },
    lastYear: { total: 155000, new: 19000, active: 126000 },
    retention: 88.3,
    engagement: 76.1,
  },
  {
    month: "Jun",
    currentYear: { total: 168000, new: 22000, active: 142000 },
    lastYear: { total: 158000, new: 20000, active: 129000 },
    retention: 89.0,
    engagement: 76.8,
  },
  {
    month: "Jul",
    currentYear: { total: 172000, new: 23000, active: 145000 },
    lastYear: { total: 161000, new: 21000, active: 132000 },
    retention: 89.5,
    engagement: 77.4,
  },
  {
    month: "Aug",
    currentYear: { total: 175000, new: 24000, active: 148000 },
    lastYear: { total: 165000, new: 22000, active: 135000 },
    retention: 90.1,
    engagement: 78.0,
  },
  {
    month: "Sep",
    currentYear: { total: 178000, new: 25000, active: 151000 },
    lastYear: { total: 168000, new: 23000, active: 138000 },
    retention: 90.7,
    engagement: 78.7,
  },
  {
    month: "Oct",
    currentYear: { total: 182000, new: 26000, active: 155000 },
    lastYear: { total: 171000, new: 24000, active: 141000 },
    retention: 91.2,
    engagement: 79.3,
  },
  {
    month: "Nov",
    currentYear: { total: 185000, new: 27000, active: 158000 },
    lastYear: { total: 174000, new: 25000, active: 144000 },
    retention: 91.8,
    engagement: 80.0,
  },
  {
    month: "Dec",
    currentYear: { total: 188000, new: 28000, active: 162000 },
    lastYear: { total: 178000, new: 26000, active: 147000 },
    retention: 92.5,
    engagement: 80.8,
  },
];

// New color palette for user insights
const colors = {
  total: {
    current: "#00D4AA",
    last: "#006B5C",
    gradient: "linear-gradient(180deg, #00D4AA 0%, #009688 100%)",
    light: "#E8FFF8",
  },
  new: {
    current: "#6366F1",
    last: "#3730A3",
    gradient: "linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)",
    light: "#EEF2FF",
  },
  active: {
    current: "#F59E0B",
    last: "#92400E",
    gradient: "linear-gradient(180deg, #F59E0B 0%, #D97706 100%)",
    light: "#FFFBEB",
  },
};

// Text color classes for metric buttons
const COLOR_CLASSES = {
  total: "text-[#00D4AA] border-[#00D4AA] bg-[#00D4AA]/10 dark:bg-[#00D4AA]/20 hover:bg-[#00D4AA]/20 dark:hover:bg-[#00D4AA]/30",
  new: "text-[#6366F1] border-[#6366F1] bg-[#6366F1]/10 dark:bg-[#6366F1]/20 hover:bg-[#6366F1]/20 dark:hover:bg-[#6366F1]/30",
  active: "text-[#F59E0B] border-[#F59E0B] bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 hover:bg-[#F59E0B]/20 dark:hover:bg-[#F59E0B]/30",
};

// Enhanced Custom tooltip
const EnhancedTooltip = ({ active, payload, label, activeChart, compareMode }) => {
  if (active && payload && payload.length) {
    const currentYearData = payload.find((p) => p.dataKey === "currentYear");
    const lastYearData = payload.find((p) => p.dataKey === "lastYear");
    const growth = currentYearData && lastYearData ? (((currentYearData.value - lastYearData.value) / lastYearData.value) * 100).toFixed(1) : 0;

    const data = payload[0].payload;

    return (
      <div className="p-3 bg-black/5 dark:bg-white/10 rounded-lg shadow-lg backdrop-blur-2xl border border-gray-200 dark:border-gray-700 min-w-[260px]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: colors[activeChart].light,
              border: `1px solid ${colors[activeChart].current}40`,
            }}
          >
            <Calendar size={16} className="text-black" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">{label}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Monthly Performance</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[activeChart].current }} />
                <span className="text-gray-600 dark:text-gray-400 text-sm">Current</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentYearData?.value ? (currentYearData.value / 1000).toFixed(1) + "k" : "0"}</p>
            </div>

            {compareMode && lastYearData && (
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[activeChart].last }} />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Last Year</span>
                </div>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{(lastYearData.value / 1000).toFixed(1)}k</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-green-500 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">Growth</span>
              </div>
              <div className={`flex items-center gap-1 ${growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="font-bold text-lg">{Math.abs(growth)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-50/10 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${Math.min(Math.abs(growth), 100)}%` }} />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-50/10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Retention</span>
                <div className="flex items-center gap-1">
                  <Target size={12} className="text-emerald-500 dark:text-emerald-400" />
                  <span className="text-gray-900 dark:text-white font-semibold">{data.retention}%</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">Engagement</span>
                <div className="flex items-center gap-1">
                  <Activity size={12} className="text-purple-500 dark:text-purple-400" />
                  <span className="text-gray-900 dark:text-white font-semibold">{data.engagement}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Metric button component (pill style)
const MetricButton = ({ activeChart, type, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border ${
      activeChart === type ? COLOR_CLASSES[type] : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600"
    }`}
  >
    {type === "total" && <Users size={16} />}
    {type === "new" && <UserPlus size={16} />}
    {type === "active" && <Activity size={16} />}
    {label}
  </button>
);

// Summary card component (redesigned to unified card style)
const SummaryCard = ({ title, value, change, changeLabel, icon: Icon, rightItems = [] }) => {
  const isPositive = parseFloat(change) >= 0;
  return (
    <div className="p-6 relative overflow-hidden group bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10">
      {/* Floating glows */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-green-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <Icon size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{changeLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium">
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? "+" : ""}
              {change}
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{value}</span>
        </div>

        {/* Right items as footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700/50 flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
          {rightItems.map((item, index) => (
            <div key={index}>
              <span className="block">{item.label}</span>
              <span className={`font-medium ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {item.change >= 0 ? "+" : ""}
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const UserInsights = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeChart, setActiveChart] = useState("total");
  const [timeRange, setTimeRange] = useState("30d");
  const [compareMode, setCompareMode] = useState(true);
  const [viewMode, setViewMode] = useState("bar");

  const handleMouseOver = (data, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  // Transform data for the selected chart type
  const getChartData = () => {
    return userInsightsData.map((item) => ({
      month: item.month,
      currentYear: item.currentYear[activeChart],
      lastYear: item.lastYear[activeChart],
      growth: (((item.currentYear[activeChart] - item.lastYear[activeChart]) / item.lastYear[activeChart]) * 100).toFixed(1),
      retention: item.retention,
      engagement: item.engagement,
    }));
  };

  const chartData = getChartData();

  // Calculate summary statistics
  const metrics = useMemo(() => {
    const currentYearTotal = userInsightsData.reduce((sum, item) => sum + item.currentYear.total, 0);
    const lastYearTotal = userInsightsData.reduce((sum, item) => sum + item.lastYear.total, 0);
    const totalGrowth = (((currentYearTotal - lastYearTotal) / lastYearTotal) * 100).toFixed(1);

    const currentYearNew = userInsightsData.reduce((sum, item) => sum + item.currentYear.new, 0);
    const lastYearNew = userInsightsData.reduce((sum, item) => sum + item.lastYear.new, 0);
    const newGrowth = (((currentYearNew - lastYearNew) / lastYearNew) * 100).toFixed(1);

    const currentYearActive = userInsightsData.reduce((sum, item) => sum + item.currentYear.active, 0);
    const lastYearActive = userInsightsData.reduce((sum, item) => sum + item.lastYear.active, 0);
    const activeGrowth = (((currentYearActive - lastYearActive) / lastYearActive) * 100).toFixed(1);

    const avgRetention = userInsightsData.reduce((sum, item) => sum + item.retention, 0) / userInsightsData.length;
    const avgEngagement = userInsightsData.reduce((sum, item) => sum + item.engagement, 0) / userInsightsData.length;

    return {
      currentYearTotal,
      lastYearTotal,
      totalGrowth: parseFloat(totalGrowth),
      currentYearNew,
      lastYearNew,
      newGrowth: parseFloat(newGrowth),
      currentYearActive,
      lastYearActive,
      activeGrowth: parseFloat(activeGrowth),
      avgRetention: parseFloat(avgRetention.toFixed(1)),
      avgEngagement: parseFloat(avgEngagement.toFixed(1)),
    };
  }, []);

  // Custom bar shape with gradient
  const renderCustomBar = (props) => {
    const { x, y, width, height, value, index } = props;
    const isActive = activeIndex === index;
    const growth = chartData[index]?.growth;

    return (
      <g>
        <defs>
          <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[activeChart].current} stopOpacity={isActive ? 0.9 : 0.8} />
            <stop offset="100%" stopColor={colors[activeChart].current} stopOpacity={isActive ? 0.4 : 0.2} />
          </linearGradient>
        </defs>

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`url(#gradient-${index})`}
          rx={6}
          className="transition-all duration-300"
          style={{
            filter: isActive ? "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" : "none",
          }}
        />

        {/* Growth Indicator */}
        <g>
          <rect x={x + width / 2 - 1} y={y - 15} width={2} height={12} fill={growth >= 0 ? "#10B981" : "#EF4444"} rx={1} />
          <text x={x + width / 2} y={y - 20} textAnchor="middle" fill={growth >= 0 ? "#10B981" : "#EF4444"} fontSize={10} fontWeight="bold">
            {growth >= 0 ? "+" : ""}
            {growth}%
          </text>
        </g>
      </g>
    );
  };

  return (
    <Wrapper className="p-6 relative overflow-hidden group mb-3">
      {/* Floating glows – teal and indigo */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Advanced User Analytics</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Year-over-Year comparison</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Metric buttons – pill group */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <MetricButton activeChart={activeChart} type="total" label="Total" onClick={() => setActiveChart("total")} />
            <MetricButton activeChart={activeChart} type="new" label="New" onClick={() => setActiveChart("new")} />
            <MetricButton activeChart={activeChart} type="active" label="Active" onClick={() => setActiveChart("active")} />
          </div>

          {/* View mode toggle */}
          <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
            <button
              onClick={() => setViewMode("bar")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                viewMode === "bar" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Bars
            </button>
            <button
              onClick={() => setViewMode("growth")}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                viewMode === "growth" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Growth
            </button>
          </div>

          {/* Compare toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 border ${
              compareMode
                ? "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
            }`}
          >
            <Filter size={14} />
            {compareMode ? "Comparing" : "Compare"}
          </button>
        </div>
      </div>

      {/* Four summary cards – redesigned */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Current Year Card */}
        <div className="p-6 relative overflow-hidden group bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Current Year</h4>
              </div>
            </div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">{(chartData.reduce((sum, item) => sum + item.currentYear, 0) / 1000).toFixed(0)}k</div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
              <span>vs last year</span>
              <span className="text-green-500">+{((chartData.reduce((sum, item) => sum + item.currentYear, 0) - chartData.reduce((sum, item) => sum + item.lastYear, 0)) / 1000).toFixed(0)}k</span>
            </div>
          </div>
        </div>

        {/* Last Year Card */}
        <div className="p-6 relative overflow-hidden group bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-gray-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-gray-400/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <CalendarDays size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Last Year</h4>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-1">{(chartData.reduce((sum, item) => sum + item.lastYear, 0) / 1000).toFixed(0)}k</div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
              <span>Baseline</span>
              <span>reference</span>
            </div>
          </div>
        </div>

        {/* Avg Growth Card */}
        <div className="p-6 relative overflow-hidden group bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-green-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <TrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Avg Growth</h4>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">+{(chartData.reduce((sum, item) => sum + parseFloat(item.growth), 0) / chartData.length).toFixed(1)}%</div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
              <span>Peak month</span>
              <span>{Math.max(...chartData.map((item) => parseFloat(item.growth))).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Avg Retention Card */}
        <div className="p-6 relative overflow-hidden group bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10">
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
          <div className="absolute -top-20 -left-20 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Target size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Avg Retention</h4>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{metrics.avgRetention}%</div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50">
              <span>Engagement</span>
              <span>{metrics.avgEngagement}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={40} barGap={8}>
            <defs>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-700" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} className="dark:text-gray-400" height={60} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              className="dark:text-gray-400"
              tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value)}
            />
            <Tooltip content={<EnhancedTooltip activeChart={activeChart} compareMode={compareMode} />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Legend
              verticalAlign="bottom"
              height={40}
              formatter={(value) => <span className="text-gray-600 dark:text-gray-300 text-sm">{value === "currentYear" ? "Current Year" : "Last Year"}</span>}
              iconSize={10}
              iconType="circle"
            />
            <Bar dataKey="currentYear" name="currentYear" shape={renderCustomBar} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} />
            {compareMode && <Bar dataKey="lastYear" name="lastYear" fill={colors[activeChart].last} opacity={0.3} radius={[6, 6, 0, 0]} barSize={35} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with summary */}
      <div className="mt-4 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
        <span>YoY Growth: {metrics.totalGrowth}%</span>
        <span>Avg. engagement: {metrics.avgEngagement}%</span>
      </div>
    </Wrapper>
  );
};

export const UserInsightsSummary = () => {
  const summaryCards = [
    {
      title: "Active Users",
      value: "162k",
      change: "10.2%",
      changeLabel: "vs last year",
      icon: FaUsers,
      rightItems: [
        { label: "Last Year", value: "147k", change: 10.2 },
        { label: "YoY Growth", value: "15k", change: 10.2 },
      ],
    },
    {
      title: "Growth Rate",
      value: "12.5%",
      change: "3.2%",
      changeLabel: "vs last year",
      icon: FaChartLine,
      rightItems: [
        { label: "Last Year", value: "9.3%", change: 3.2 },
        { label: "YoY Change", value: "+3.2%", change: 3.2 },
      ],
    },
    {
      title: "New Users",
      value: "28k",
      change: "7.7%",
      changeLabel: "vs last year",
      icon: FaRocket,
      rightItems: [
        { label: "Last Year", value: "26k", change: 7.7 },
        { label: "YoY Growth", value: "+2k", change: 7.7 },
      ],
    },
  ];

  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating glows – orange/amber */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-orange-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">User Insights</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Comprehensive analysis</p>
          </div>
        </div>
        <FilterDropdownbyDays name="visibility" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {summaryCards.map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </div>
    </Wrapper>
  );
};

import { useState, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ComposedChart,
  Line,
  Area,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Globe,
  Target,
  Activity,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  TrendingUp as TrendingIcon,
  Zap,
  Sparkles,
  AlertCircle,
  Users,
  DollarSign,
  ChevronLeft,
  Filter,
  MoreVertical,
  Maximize2,
  RefreshCw,
  Clock,
  Eye,
  BarChart2,
  Layers,
  Grid,
  Share2,
  Info,
} from "lucide-react";
import { HeadingTwo, IconCircle } from "@/utils/Router";
import { Wrapper } from "@/utils/Router";

// Enhanced monthly data structure with more metrics
const monthlyTrafficData = [
  {
    month: "Jan",
    channels: {
      "Organic Search": {
        visits: 4200,
        conversion: 4.1,
        revenue: 12500,
        bounceRate: 35.2,
        avgDuration: 3.4,
        engagement: 4.2,
        returning: 32,
        goalCompletions: 156,
        cpc: 0.42,
      },
      Direct: {
        visits: 3120,
        conversion: 5.7,
        revenue: 9200,
        bounceRate: 42.5,
        avgDuration: 2.7,
        engagement: 3.8,
        returning: 45,
        goalCompletions: 178,
        cpc: 0,
      },
      "Social Media": {
        visits: 2850,
        conversion: 2.9,
        revenue: 6500,
        bounceRate: 28.8,
        avgDuration: 4.1,
        engagement: 4.8,
        returning: 28,
        goalCompletions: 83,
        cpc: 0.85,
      },
      Email: {
        visits: 1980,
        conversion: 7.2,
        revenue: 10500,
        bounceRate: 22.8,
        avgDuration: 5.0,
        engagement: 5.2,
        returning: 62,
        goalCompletions: 143,
        cpc: 0.12,
      },
      Referral: {
        visits: 1570,
        conversion: 4.6,
        revenue: 5800,
        bounceRate: 39.2,
        avgDuration: 3.1,
        engagement: 3.5,
        returning: 38,
        goalCompletions: 72,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1230,
        conversion: 2.1,
        revenue: 3800,
        bounceRate: 52.1,
        avgDuration: 1.7,
        engagement: 2.3,
        returning: 12,
        goalCompletions: 26,
        cpc: 1.45,
      },
    },
  },
  {
    month: "Feb",
    channels: {
      "Organic Search": {
        visits: 4520,
        conversion: 4.3,
        revenue: 13500,
        bounceRate: 34.5,
        avgDuration: 3.5,
        engagement: 4.3,
        returning: 35,
        goalCompletions: 195,
        cpc: 0.41,
      },
      Direct: {
        visits: 3280,
        conversion: 5.9,
        revenue: 10200,
        bounceRate: 41.8,
        avgDuration: 2.8,
        engagement: 3.9,
        returning: 48,
        goalCompletions: 194,
        cpc: 0,
      },
      "Social Media": {
        visits: 3010,
        conversion: 3.1,
        revenue: 7200,
        bounceRate: 28.2,
        avgDuration: 4.2,
        engagement: 4.9,
        returning: 31,
        goalCompletions: 93,
        cpc: 0.82,
      },
      Email: {
        visits: 2100,
        conversion: 7.5,
        revenue: 11500,
        bounceRate: 22.1,
        avgDuration: 5.1,
        engagement: 5.3,
        returning: 65,
        goalCompletions: 158,
        cpc: 0.11,
      },
      Referral: {
        visits: 1680,
        conversion: 4.8,
        revenue: 6200,
        bounceRate: 38.5,
        avgDuration: 3.2,
        engagement: 3.6,
        returning: 41,
        goalCompletions: 81,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1350,
        conversion: 2.3,
        revenue: 4200,
        bounceRate: 51.3,
        avgDuration: 1.8,
        engagement: 2.4,
        returning: 15,
        goalCompletions: 31,
        cpc: 1.42,
      },
    },
  },
  {
    month: "Mar",
    channels: {
      "Organic Search": {
        visits: 4800,
        conversion: 4.2,
        revenue: 14200,
        bounceRate: 34.0,
        avgDuration: 3.6,
        engagement: 4.4,
        returning: 38,
        goalCompletions: 202,
        cpc: 0.39,
      },
      Direct: {
        visits: 3400,
        conversion: 5.8,
        revenue: 10800,
        bounceRate: 41.2,
        avgDuration: 2.9,
        engagement: 4.0,
        returning: 52,
        goalCompletions: 197,
        cpc: 0,
      },
      "Social Media": {
        visits: 3200,
        conversion: 3.2,
        revenue: 7800,
        bounceRate: 27.5,
        avgDuration: 4.3,
        engagement: 5.0,
        returning: 35,
        goalCompletions: 102,
        cpc: 0.79,
      },
      Email: {
        visits: 2250,
        conversion: 7.6,
        revenue: 12500,
        bounceRate: 21.8,
        avgDuration: 5.2,
        engagement: 5.4,
        returning: 68,
        goalCompletions: 171,
        cpc: 0.1,
      },
      Referral: {
        visits: 1750,
        conversion: 4.9,
        revenue: 6500,
        bounceRate: 38.0,
        avgDuration: 3.3,
        engagement: 3.7,
        returning: 44,
        goalCompletions: 86,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1450,
        conversion: 2.4,
        revenue: 4500,
        bounceRate: 50.5,
        avgDuration: 1.9,
        engagement: 2.5,
        returning: 18,
        goalCompletions: 35,
        cpc: 1.38,
      },
    },
  },
  {
    month: "Apr",
    channels: {
      "Organic Search": {
        visits: 5100,
        conversion: 4.4,
        revenue: 15200,
        bounceRate: 33.5,
        avgDuration: 3.7,
        engagement: 4.5,
        returning: 42,
        goalCompletions: 224,
        cpc: 0.37,
      },
      Direct: {
        visits: 3550,
        conversion: 6.0,
        revenue: 11500,
        bounceRate: 40.5,
        avgDuration: 3.0,
        engagement: 4.1,
        returning: 55,
        goalCompletions: 213,
        cpc: 0,
      },
      "Social Media": {
        visits: 3450,
        conversion: 3.3,
        revenue: 8500,
        bounceRate: 26.8,
        avgDuration: 4.4,
        engagement: 5.1,
        returning: 39,
        goalCompletions: 114,
        cpc: 0.75,
      },
      Email: {
        visits: 2400,
        conversion: 7.8,
        revenue: 13500,
        bounceRate: 21.2,
        avgDuration: 5.3,
        engagement: 5.5,
        returning: 72,
        goalCompletions: 187,
        cpc: 0.09,
      },
      Referral: {
        visits: 1850,
        conversion: 5.0,
        revenue: 6900,
        bounceRate: 37.5,
        avgDuration: 3.4,
        engagement: 3.8,
        returning: 47,
        goalCompletions: 93,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1600,
        conversion: 2.5,
        revenue: 5000,
        bounceRate: 49.8,
        avgDuration: 2.0,
        engagement: 2.6,
        returning: 21,
        goalCompletions: 40,
        cpc: 1.35,
      },
    },
  },
  {
    month: "May",
    channels: {
      "Organic Search": {
        visits: 5350,
        conversion: 4.5,
        revenue: 16000,
        bounceRate: 33.0,
        avgDuration: 3.8,
        engagement: 4.6,
        returning: 45,
        goalCompletions: 241,
        cpc: 0.35,
      },
      Direct: {
        visits: 3720,
        conversion: 6.2,
        revenue: 12200,
        bounceRate: 39.8,
        avgDuration: 3.1,
        engagement: 4.2,
        returning: 58,
        goalCompletions: 231,
        cpc: 0,
      },
      "Social Media": {
        visits: 3650,
        conversion: 3.4,
        revenue: 9200,
        bounceRate: 26.0,
        avgDuration: 4.5,
        engagement: 5.2,
        returning: 42,
        goalCompletions: 124,
        cpc: 0.72,
      },
      Email: {
        visits: 2550,
        conversion: 8.0,
        revenue: 14500,
        bounceRate: 20.5,
        avgDuration: 5.4,
        engagement: 5.6,
        returning: 75,
        goalCompletions: 204,
        cpc: 0.08,
      },
      Referral: {
        visits: 1950,
        conversion: 5.2,
        revenue: 7300,
        bounceRate: 37.0,
        avgDuration: 3.5,
        engagement: 3.9,
        returning: 50,
        goalCompletions: 101,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1750,
        conversion: 2.6,
        revenue: 5500,
        bounceRate: 49.0,
        avgDuration: 2.1,
        engagement: 2.7,
        returning: 24,
        goalCompletions: 46,
        cpc: 1.32,
      },
    },
  },
  {
    month: "Jun",
    channels: {
      "Organic Search": {
        visits: 5800,
        conversion: 4.8,
        revenue: 17200,
        bounceRate: 32.5,
        avgDuration: 3.9,
        engagement: 4.7,
        returning: 48,
        goalCompletions: 278,
        cpc: 0.33,
      },
      Direct: {
        visits: 3950,
        conversion: 6.5,
        revenue: 13200,
        bounceRate: 39.2,
        avgDuration: 3.2,
        engagement: 4.3,
        returning: 62,
        goalCompletions: 257,
        cpc: 0,
      },
      "Social Media": {
        visits: 3980,
        conversion: 3.7,
        revenue: 10500,
        bounceRate: 25.2,
        avgDuration: 4.6,
        engagement: 5.3,
        returning: 46,
        goalCompletions: 147,
        cpc: 0.68,
      },
      Email: {
        visits: 2720,
        conversion: 8.3,
        revenue: 15800,
        bounceRate: 19.8,
        avgDuration: 5.5,
        engagement: 5.7,
        returning: 79,
        goalCompletions: 226,
        cpc: 0.07,
      },
      Referral: {
        visits: 2120,
        conversion: 5.5,
        revenue: 8100,
        bounceRate: 36.2,
        avgDuration: 3.6,
        engagement: 4.0,
        returning: 54,
        goalCompletions: 117,
        cpc: 0,
      },
      "Paid Ads": {
        visits: 1950,
        conversion: 2.9,
        revenue: 6200,
        bounceRate: 48.2,
        avgDuration: 2.2,
        engagement: 2.8,
        returning: 28,
        goalCompletions: 57,
        cpc: 1.28,
      },
    },
  },
];

const channelColors = {
  "Organic Search": { primary: "#10B981", light: "#D1FAE5", dark: "#059669", gradient: "from-emerald-400 to-emerald-600" },
  Direct: { primary: "#3B82F6", light: "#DBEAFE", dark: "#2563EB", gradient: "from-blue-400 to-blue-600" },
  "Social Media": { primary: "#8B5CF6", light: "#EDE9FE", dark: "#7C3AED", gradient: "from-violet-400 to-violet-600" },
  Email: { primary: "#EF4444", light: "#FEE2E2", dark: "#DC2626", gradient: "from-red-400 to-red-600" },
  Referral: { primary: "#F59E0B", light: "#FEF3C7", dark: "#D97706", gradient: "from-amber-400 to-amber-600" },
  "Paid Ads": { primary: "#EC4899", light: "#FCE7F3", dark: "#DB2777", gradient: "from-pink-400 to-pink-600" },
};

const chartTypes = [
  { id: "bar", label: "Bar", icon: BarChart3, color: "#3B82F6", gradient: "from-blue-500 to-cyan-500" },
  { id: "line", label: "Line", icon: LineChart, color: "#10B981", gradient: "from-emerald-500 to-teal-500" },
  { id: "area", label: "Area", icon: TrendingUp, color: "#8B5CF6", gradient: "from-violet-500 to-purple-500" },
  { id: "radar", label: "Radar", icon: Layers, color: "#F59E0B", gradient: "from-amber-500 to-orange-500" },
  { id: "pie", label: "Pie", icon: PieChartIcon, color: "#EC4899", gradient: "from-pink-500 to-rose-500" },
];

const metrics = [
  { id: "visits", label: "Visits", icon: Users, color: "#3B82F6", gradient: "from-blue-500 to-cyan-500" },
  { id: "conversion", label: "Conversion", icon: Target, color: "#10B981", gradient: "from-emerald-500 to-teal-500" },
  { id: "revenue", label: "Revenue", icon: DollarSign, color: "#8B5CF6", gradient: "from-violet-500 to-purple-500" },
  { id: "engagement", label: "Engagement", icon: Activity, color: "#EC4899", gradient: "from-pink-500 to-rose-500" },
  { id: "bounceRate", label: "Bounce Rate", icon: TrendingDown, color: "#EF4444", gradient: "from-red-500 to-orange-500" },
];

// Enhanced Tooltip Component
export const CustomTooltip = ({ active, payload, label, metric = "visits" }) => {
  if (active && payload && payload.length) {
    const monthData = monthlyTrafficData.find((m) => m.month === label);
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-4 min-w-[280px] backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{label}</h3>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">Total: {metric === "revenue" ? `$${(total / 1000).toFixed(1)}k` : total.toLocaleString()}</span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {payload.map((entry, index) => {
            const channel = entry.dataKey || entry.name;
            const channelData = monthData?.channels?.[channel];
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
            const colors = channelColors[channel] || { primary: "#666" };

            return (
              <div key={index} className="space-y-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{channel}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{percentage}% of total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">{metric === "revenue" ? `$${(entry.value / 1000).toFixed(1)}k` : entry.value?.toLocaleString()}</div>
                  </div>
                </div>

                {channelData && (
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="text-gray-500 dark:text-gray-400">Conv.</div>
                      <div className="font-semibold text-green-600 dark:text-green-400">{channelData.conversion}%</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="text-gray-500 dark:text-gray-400">Engage.</div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400">{channelData.engagement}/10</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="text-gray-500 dark:text-gray-400">Bounce</div>
                      <div className="font-semibold text-red-600 dark:text-red-400">{channelData.bounceRate}%</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// Performance Score Card
export const PerformanceCard = ({ channel, data, rank }) => {
  const calculateScore = () => {
    const { conversion = 0, bounceRate = 0, engagement = 0, avgDuration = 0 } = data;
    const score = conversion * 0.4 + (100 - bounceRate) * 0.2 + engagement * 0.2 + avgDuration * 0.2;
    return Math.min(Math.max(score, 0), 100);
  };

  const score = calculateScore();
  const colors = channelColors[channel] || { primary: "#666", gradient: "from-gray-400 to-gray-600" };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500/10";
    if (score >= 60) return "bg-blue-500/10";
    if (score >= 40) return "bg-amber-500/10";
    return "bg-red-500/10";
  };

  return (
    <div className="group relative p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg">
      <div className="absolute top-3 right-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getScoreBg(score)} ${getScoreColor(score)}`}>#{rank}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
          <BarChart2 size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white truncate">{channel}</h4>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Performance</span>
            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">Visits</div>
          <div className="font-bold text-lg text-gray-900 dark:text-white">{(data.visits / 1000).toFixed(1)}k</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400">ROI</div>
          <div className="font-bold text-lg text-green-600 dark:text-green-400">{(data.revenue / (data.visits * (data.cpc || 0.01)) || 0).toFixed(1)}x</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">Score</span>
          <div className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score.toFixed(0)}
            <span className="text-sm text-gray-500">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trend Indicator Component
export const TrendIndicator = ({ value, previous, format = "number" }) => {
  const diff = value - previous;
  const percentage = previous > 0 ? (diff / previous) * 100 : 0;
  const isPositive = percentage > 0;
  const isNeutral = percentage === 0;

  const formatValue = (val) => {
    if (format === "currency") return `$${(val / 1000).toFixed(1)}k`;
    if (format === "percentage") return `${val.toFixed(1)}%`;
    return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toLocaleString();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-900 dark:text-white">{formatValue(value)}</span>
      {!isNeutral && (
        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(percentage).toFixed(1)}%
        </span>
      )}
    </div>
  );
};

// Enhanced Legend Component
export const EnhancedLegend = ({ selectedChannels, onToggle, onSelectAll, onDeselectAll }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Channel Comparison</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            All
          </button>
          <button
            onClick={onDeselectAll}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          >
            None
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {Object.entries(channelColors).map(([channel, colors]) => {
          const isSelected = selectedChannels.includes(channel);
          return (
            <button
              key={channel}
              onClick={() => onToggle(channel)}
              className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isSelected
                  ? `bg-gradient-to-r ${colors.gradient} bg-opacity-10 border ${colors.gradient.replace("from-", "border-").replace(" to-", "/20")}`
                  : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isSelected ? `bg-gradient-to-r ${colors.gradient}` : "bg-gray-300 dark:bg-gray-600"}`} />
              <span className={`text-sm font-medium truncate ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>{channel}</span>
              <div className={`ml-auto w-2 h-2 rounded-full ${isSelected ? `bg-gradient-to-r ${colors.gradient}` : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Comparison Metrics Component
export const ComparisonMetrics = ({ selectedChannels, metric }) => {
  const currentMonth = monthlyTrafficData[monthlyTrafficData.length - 1];
  const previousMonth = monthlyTrafficData[monthlyTrafficData.length - 2];

  const getChannelData = (month, channel) => {
    return month?.channels?.[channel]?.[metric] || 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">Channel Comparison</h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">Current vs Previous Month</span>
      </div>

      <div className="space-y-3">
        {selectedChannels.map((channel) => {
          const current = getChannelData(currentMonth, channel);
          const previous = getChannelData(previousMonth, channel);
          const colors = channelColors[channel] || { primary: "#666" };

          return (
            <div key={channel} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{channel}</span>
                </div>
                <TrendIndicator value={current} previous={previous} format={metric === "revenue" ? "currency" : metric === "conversion" ? "percentage" : "number"} />
              </div>

              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors.gradient}`}
                  style={{
                    width: `${Math.min((current / Math.max(...selectedChannels.map((c) => getChannelData(currentMonth, c)))) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdvancedTrafficChannelAnalysis = () => {
  const [viewMode, setViewMode] = useState("bar");
  const [selectedChannels, setSelectedChannels] = useState(Object.keys(channelColors));
  const [selectedMonth, setSelectedMonth] = useState("Jun");
  const [metric, setMetric] = useState("visits");
  const [timeRange, setTimeRange] = useState("6m");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Process data for charts
  const processedData = useMemo(() => {
    let monthsToShow = monthlyTrafficData;

    if (timeRange === "3m") {
      monthsToShow = monthlyTrafficData.slice(-3);
    }

    return monthsToShow.map((month) => {
      const dataPoint = { month: month.month };
      selectedChannels.forEach((channel) => {
        const channelData = month.channels?.[channel];
        if (channelData) {
          dataPoint[channel] = channelData[metric] || 0;
        }
      });
      return dataPoint;
    });
  }, [selectedChannels, metric, timeRange]);

  // Calculate performance rankings
  const performanceRankings = useMemo(() => {
    const currentMonth = monthlyTrafficData.find((m) => m.month === selectedMonth);
    if (!currentMonth) return [];

    return Object.entries(currentMonth.channels || {})
      .filter(([channel]) => selectedChannels.includes(channel))
      .map(([channel, data]) => {
        const score = data.conversion * 0.4 + (100 - data.bounceRate) * 0.2 + data.engagement * 0.2 + data.avgDuration * 0.2;
        return { channel, data, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [selectedMonth, selectedChannels]);

  // Toggle channel selection
  const toggleChannel = useCallback((channel) => {
    setSelectedChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  }, []);

  // Select all channels
  const selectAllChannels = useCallback(() => {
    setSelectedChannels(Object.keys(channelColors));
  }, []);

  // Deselect all channels
  const deselectAllChannels = useCallback(() => {
    setSelectedChannels([]);
  }, []);

  // Render chart based on view mode
  const renderChart = () => {
    if (selectedChannels.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <BarChart3 size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No channels selected</p>
          <p className="text-sm mt-1">Select channels to visualize data</p>
        </div>
      );
    }

    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 },
    };

    switch (viewMode) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-800" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} className="dark:text-gray-400" />
            <YAxis
              tickFormatter={(value) => (metric === "revenue" ? `$${(value / 1000).toFixed(0)}k` : value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
              className="dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            {selectedChannels.map((channel, index) => (
              <Bar key={channel} dataKey={channel} fill={`url(#gradient-${channel})`} radius={[6, 6, 0, 0]} barSize={28} name={channel} />
            ))}
            <defs>
              {selectedChannels.map((channel) => {
                const colors = channelColors[channel];
                return (
                  <linearGradient key={channel} id={`gradient-${channel}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colors?.primary} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={colors?.dark} stopOpacity={0.7} />
                  </linearGradient>
                );
              })}
            </defs>
          </BarChart>
        );

      case "line":
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
            <YAxis
              tickFormatter={(value) => (metric === "revenue" ? `$${(value / 1000).toFixed(0)}k` : value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            {selectedChannels.map((channel) => (
              <Line
                key={channel}
                type="monotone"
                dataKey={channel}
                stroke={channelColors[channel]?.primary || "#666"}
                strokeWidth={3}
                dot={{ r: 4, fill: channelColors[channel]?.primary, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                name={channel}
              />
            ))}
          </ComposedChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
            <YAxis
              tickFormatter={(value) => (metric === "revenue" ? `$${(value / 1000).toFixed(0)}k` : value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            {selectedChannels.map((channel) => {
              const colors = channelColors[channel];
              return (
                <Area key={channel} type="monotone" dataKey={channel} stroke={colors?.primary || "#666"} fill={`url(#area-gradient-${channel})`} fillOpacity={0.3} strokeWidth={2} name={channel} />
              );
            })}
            <defs>
              {selectedChannels.map((channel) => {
                const colors = channelColors[channel];
                return (
                  <linearGradient key={`area-${channel}`} id={`area-gradient-${channel}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors?.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={colors?.primary} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
            </defs>
          </AreaChart>
        );

      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
            <PolarGrid stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#6B7280" }} />
            <PolarRadiusAxis tick={{ fill: "#6B7280" }} />
            {selectedChannels.map((channel) => (
              <Radar
                key={channel}
                name={channel}
                dataKey={channel}
                stroke={channelColors[channel]?.primary || "#666"}
                fill={channelColors[channel]?.primary || "#666"}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Tooltip content={<CustomTooltip metric={metric} />} />
          </RadarChart>
        );

      case "pie":
        const currentMonthData = monthlyTrafficData.find((m) => m.month === selectedMonth);
        const pieData = selectedChannels
          .map((channel) => ({
            name: channel,
            value: currentMonthData?.channels?.[channel]?.[metric] || 0,
            color: channelColors[channel]?.primary || "#666",
          }))
          .filter((item) => item.value > 0);

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={1}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      default:
        return null;
    }
  };

  // Calculate total metrics
  const totalMetrics = useMemo(() => {
    const currentMonth = monthlyTrafficData[monthlyTrafficData.length - 1];
    const previousMonth = monthlyTrafficData[monthlyTrafficData.length - 2];

    const totals = {
      visits: 0,
      revenue: 0,
      conversion: 0,
      engagement: 0,
    };

    Object.values(currentMonth?.channels || {}).forEach((channel) => {
      totals.visits += channel.visits || 0;
      totals.revenue += channel.revenue || 0;
      totals.conversion += channel.conversion || 0;
      totals.engagement += channel.engagement || 0;
    });

    totals.conversion = totals.conversion / Object.keys(currentMonth?.channels || {}).length;
    totals.engagement = totals.engagement / Object.keys(currentMonth?.channels || {}).length;

    // Calculate growth
    const prevTotals = {
      visits: Object.values(previousMonth?.channels || {}).reduce((sum, channel) => sum + (channel.visits || 0), 0),
      revenue: Object.values(previousMonth?.channels || {}).reduce((sum, channel) => sum + (channel.revenue || 0), 0),
    };

    return {
      ...totals,
      growth: {
        visits: ((totals.visits - prevTotals.visits) / prevTotals.visits) * 100,
        revenue: ((totals.revenue - prevTotals.revenue) / prevTotals.revenue) * 100,
      },
    };
  }, []);

  return (
    <Wrapper className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div>
            <HeadingTwo>Advanced Channel Analytics</HeadingTwo>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time performance across all traffic sources</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
            <button
              onClick={() => setTimeRange("3m")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === "3m" ? "text-white bg-gradient-to-r from-blue-500 to-cyan-500" : "text-gray-600 dark:text-gray-400"}`}
            >
              Last 3M
            </button>
            <button
              onClick={() => setTimeRange("6m")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === "6m" ? "text-white bg-gradient-to-r from-blue-500 to-cyan-500" : "text-gray-600 dark:text-gray-400"}`}
            >
              Last 6M
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Visits */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-gray-800/40 shadow-2xl shadow-black/25 hover:shadow-blue-500/20 transition-all duration-500 hover:border-blue-500/40 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>

          {/* Animated Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>

          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              {/* Icon Container with Enhanced Glow */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 backdrop-blur-sm shadow-2xl group-hover:shadow-blue-500/30 group-hover:border-blue-500/50 transition-all duration-500">
                  <div className="relative">
                    <Users className="w-7 h-7 text-blue-400 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-blue-400/20 blur-md"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Trend Indicator with Animation */}
              <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 px-3.5 py-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">+12.5%</span>
                </div>
              </div>
            </div>

            {/* Enhanced Typography */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400/80 tracking-wider uppercase mb-3">Total Visits</div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">{(totalMetrics.visits / 1000).toFixed(1)}k</div>
                <div className="text-xs text-gray-500 self-end pb-1.5">last month</div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-4 pt-6 border-t border-gray-800/40">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400/80">Monthly Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">85%</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>

              <div className="relative h-2.5 bg-gray-800/60 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full" style={{ width: "85%" }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500/70">
                <span>0</span>
                <span className="font-medium">Target: 15k visits</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Revenue */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-gray-800/40 shadow-2xl shadow-black/25 hover:shadow-emerald-500/20 transition-all duration-500 hover:border-emerald-500/40 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(16,185,129,0.05)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
          </div>

          {/* Animated Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-600 via-teal-500 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-emerald-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 backdrop-blur-sm shadow-2xl group-hover:shadow-emerald-500/30 group-hover:border-emerald-500/50 transition-all duration-500">
                  <div className="relative">
                    <DollarSign className="w-7 h-7 text-emerald-400 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-emerald-400/20 blur-md"></div>
                  </div>
                </div>
              </div>

              {/* Animated Trend */}
              <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 px-3.5 py-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">+8.3%</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400/80 tracking-wider uppercase mb-3">Revenue Generated</div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">${(totalMetrics.revenue / 1000).toFixed(1)}k</div>
                <div className="text-xs text-gray-500 self-end pb-1.5">Q4 2024</div>
              </div>
            </div>

            {/* Enhanced Financial Graph */}
            <div className="space-y-4 pt-6 border-t border-gray-800/40">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400/80">Revenue Trend</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  Growing
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </span>
              </div>

              <div className="relative h-20">
                <div className="absolute inset-0 flex items-end gap-1.5">
                  {[30, 45, 35, 55, 40, 60, 50, 70, 65, 75, 60, 80].map((height, index) => (
                    <div key={index} className="relative flex-1 group/bar cursor-pointer" style={{ height: `${height}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-emerald-600/60 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover/bar:opacity-100 opacity-90 hover:scale-y-110 origin-bottom"></div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-emerald-300 text-xs font-medium px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        ${Math.round(50 + height * 2)}k
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500/70">
                <span>Jan</span>
                <span className="font-medium">Monthly Growth</span>
                <span>Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Conversion */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-gray-800/40 shadow-2xl shadow-black/25 hover:shadow-violet-500/20 transition-all duration-500 hover:border-violet-500/40 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1)_0%,transparent_50%)]"></div>
          </div>

          {/* Animated Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-violet-600 via-purple-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/30 via-purple-500/20 to-violet-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 backdrop-blur-sm shadow-2xl group-hover:shadow-violet-500/30 group-hover:border-violet-500/50 transition-all duration-500">
                  <div className="relative">
                    <Target className="w-7 h-7 text-violet-400 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-violet-400/20 blur-md"></div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 px-3.5 py-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">{totalMetrics.conversion.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400/80 tracking-wider uppercase mb-3">Avg Conversion Rate</div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-violet-400 bg-clip-text text-transparent">{totalMetrics.conversion.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 self-end pb-1.5">all channels</div>
              </div>
            </div>

            {/* Enhanced Radial Progress */}
            <div className="space-y-6 pt-6 border-t border-gray-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400/80">Performance Score</div>
                  <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                    Excellent
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>
                </div>

                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <defs>
                      <linearGradient id="gradientViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="35" stroke="#374151" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="url(#gradientViolet)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${(totalMetrics.conversion / 10) * 220} 220`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-white">{((totalMetrics.conversion / 10) * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">score</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Comparison Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group/stat relative p-3 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 hover:border-violet-500/50 transition-all duration-300">
                  <div className="text-xs text-gray-400/80 mb-1">Industry Avg.</div>
                  <div className="text-lg font-bold text-white">3.2%</div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="group/stat relative p-3 rounded-xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/30 hover:border-violet-500/50 transition-all duration-300">
                  <div className="text-xs text-gray-400/80 mb-1">Top Channel</div>
                  <div className="text-lg font-bold text-violet-400">Organic</div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Engagement */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-950 border border-gray-800/40 shadow-2xl shadow-black/25 hover:shadow-pink-500/20 transition-all duration-500 hover:border-pink-500/40 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(236,72,153,0.05)_25%,transparent_26%,transparent_49%,rgba(236,72,153,0.05)_50%,transparent_51%)] bg-[length:20px_20px]"></div>
          </div>

          {/* Animated Gradient Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-600 via-rose-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700"></div>

          {/* Enhanced Live Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-900/90 to-gray-800/90 border border-rose-500/30 backdrop-blur-sm shadow-lg">
              <div className="relative flex items-center gap-1.5">
                <div className="relative">
                  <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative w-2 h-2 bg-rose-500 rounded-full"></div>
                </div>
                <span className="text-xs font-semibold text-rose-300 animate-pulse">LIVE</span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/30 via-rose-500/20 to-pink-500/30 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 border border-gray-700/50 backdrop-blur-sm shadow-2xl group-hover:shadow-pink-500/30 group-hover:border-pink-500/50 transition-all duration-500">
                  <div className="relative">
                    <Activity className="w-7 h-7 text-pink-400 drop-shadow-lg" />
                    <div className="absolute inset-0 bg-pink-400/20 blur-md"></div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-emerald-500/30 backdrop-blur-sm shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 px-3.5 py-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-300">+5.7%</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-400/80 tracking-wider uppercase mb-3">Engagement Score</div>
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 bg-clip-text text-transparent">
                  {totalMetrics.engagement.toFixed(1)}
                  <span className="text-xl text-gray-400">/10</span>
                </div>
                <div className="text-xs text-gray-500 self-end pb-1.5">user satisfaction</div>
              </div>
            </div>

            {/* Enhanced Score Visualization */}
            <div className="space-y-6 pt-6 border-t border-gray-800/40">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400/80">Score Breakdown</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < 4 ? "bg-gradient-to-r from-pink-500 to-rose-500" : "bg-gray-600"}`}></div>
                  ))}
                </div>
              </div>

              {/* Enhanced Rating Bars */}
              <div className="space-y-4">
                {[
                  { label: "Session Duration", value: 85, color: "from-pink-500 to-rose-500" },
                  { label: "Pages/Visit", value: 78, color: "from-pink-500 to-rose-500" },
                  { label: "Interaction Rate", value: 92, color: "from-pink-500 to-rose-500" },
                  { label: "Return Rate", value: 68, color: "from-emerald-500 to-teal-500" },
                ].map((metric, i) => (
                  <div key={i} className="group/bar">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400/80">{metric.label}</span>
                      <span className="text-xs font-bold text-white">{metric.value}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-700 ease-out group-hover/bar:scale-y-125 origin-left`}
                        style={{ width: `${metric.value}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/bar:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Controls */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Channel Performance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Compare metrics across selected channels</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Metric Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {metrics.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMetric(m.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        metric === m.id ? "text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <m.icon size={16} />
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Chart Type Selector */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {chartTypes.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => setViewMode(chart.id)}
                      className={`p-3 rounded-lg transition-all ${
                        viewMode === chart.id ? "text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                      title={chart.label}
                    >
                      <chart.icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>

            {/* Channel Selector */}
            <div className="mt-8">
              <EnhancedLegend selectedChannels={selectedChannels} onToggle={toggleChannel} onSelectAll={selectAllChannels} onDeselectAll={deselectAllChannels} />
            </div>
          </div>

          {/* Performance Rankings */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Channel Rankings</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Performance score for {selectedMonth}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const currentIndex = monthlyTrafficData.findIndex((m) => m.month === selectedMonth);
                    if (currentIndex > 0) setSelectedMonth(monthlyTrafficData[currentIndex - 1].month);
                  }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  disabled={monthlyTrafficData[0].month === selectedMonth}
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg font-medium">{selectedMonth}</span>
                <button
                  onClick={() => {
                    const currentIndex = monthlyTrafficData.findIndex((m) => m.month === selectedMonth);
                    if (currentIndex < monthlyTrafficData.length - 1) setSelectedMonth(monthlyTrafficData[currentIndex + 1].month);
                  }}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  disabled={monthlyTrafficData[monthlyTrafficData.length - 1].month === selectedMonth}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceRankings.map(({ channel, data, rank }) => (
                <PerformanceCard key={channel} channel={channel} data={data} rank={rank} />
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Comparison Metrics */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <ComparisonMetrics selectedChannels={selectedChannels} metric={metric} />
          </div>

          {/* Insights */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <IconCircle>
                <Zap />
              </IconCircle>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Key Insights</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles size={18} className="text-blue-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Top Performer</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{performanceRankings[0]?.channel || "N/A"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Highest engagement and conversion rates this month</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-200 dark:border-emerald-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp size={18} className="text-emerald-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Fastest Growth</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Social Media</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">+42% growth in visits over last 3 months</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle size={18} className="text-amber-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Opportunity</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Paid Ads</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">High CPC with low conversion rate. Consider optimization.</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <IconCircle>
                <Activity />
              </IconCircle>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Quick Actions</h3>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <Filter size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Add Filter</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <Eye size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">View Details</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="flex items-center gap-3">
                  <RefreshCw size={16} className="text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Refresh Data</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

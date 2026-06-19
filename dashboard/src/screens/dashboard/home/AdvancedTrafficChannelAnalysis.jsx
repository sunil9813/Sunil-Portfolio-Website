import { useState, useMemo, useCallback } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Zap,
  Sparkles,
  Filter,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Radar,
  Globe,
  Mail,
  Share2,
  MessageSquare,
  Search,
  ShoppingBag,
  Play,
  BookOpen,
  AlertCircle,
  Maximize2,
  Minimize2,
  Download,
  Calendar,
  TrendingDown,
  PieChartIcon,
  Layers,
  GitCompare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper, HeadingTwo, IconCircle } from "@/utils/Router";

// ----------------------------------------------------------------------
// Data Definitions (unchanged)
// ----------------------------------------------------------------------
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
      "Organic Search": { visits: 5800, conversion: 4.8, revenue: 17200, bounceRate: 32.5, avgDuration: 3.9, engagement: 4.7, returning: 48, goalCompletions: 278, cpc: 0.33 },
      Direct: { visits: 3950, conversion: 6.5, revenue: 13200, bounceRate: 39.2, avgDuration: 3.2, engagement: 4.3, returning: 62, goalCompletions: 257, cpc: 0 },
      "Social Media": { visits: 3980, conversion: 3.7, revenue: 10500, bounceRate: 25.2, avgDuration: 4.6, engagement: 5.3, returning: 46, goalCompletions: 147, cpc: 0.68 },
      Email: { visits: 2720, conversion: 8.3, revenue: 15800, bounceRate: 19.8, avgDuration: 5.5, engagement: 5.7, returning: 79, goalCompletions: 226, cpc: 0.07 },
      Referral: { visits: 2120, conversion: 5.5, revenue: 8100, bounceRate: 36.2, avgDuration: 3.6, engagement: 4.0, returning: 54, goalCompletions: 117, cpc: 0 },
      "Paid Ads": { visits: 1950, conversion: 2.9, revenue: 6200, bounceRate: 48.2, avgDuration: 2.2, engagement: 2.8, returning: 28, goalCompletions: 57, cpc: 1.28 },
    },
  },

  {
    month: "Jul",
    channels: {
      "Organic Search": { visits: 6100, conversion: 5.0, revenue: 18500, bounceRate: 31.8, avgDuration: 4.0, engagement: 4.9, returning: 52, goalCompletions: 295, cpc: 0.31 },
      Direct: { visits: 4180, conversion: 6.8, revenue: 14100, bounceRate: 38.5, avgDuration: 3.3, engagement: 4.5, returning: 66, goalCompletions: 272, cpc: 0 },
      "Social Media": { visits: 4250, conversion: 3.9, revenue: 11300, bounceRate: 24.5, avgDuration: 4.7, engagement: 5.5, returning: 51, goalCompletions: 162, cpc: 0.64 },
      Email: { visits: 2890, conversion: 8.6, revenue: 17100, bounceRate: 19.1, avgDuration: 5.6, engagement: 5.9, returning: 84, goalCompletions: 245, cpc: 0.06 },
      Referral: { visits: 2280, conversion: 5.8, revenue: 8800, bounceRate: 35.4, avgDuration: 3.7, engagement: 4.2, returning: 59, goalCompletions: 128, cpc: 0 },
      "Paid Ads": { visits: 2150, conversion: 3.1, revenue: 6900, bounceRate: 47.5, avgDuration: 2.3, engagement: 2.9, returning: 32, goalCompletions: 65, cpc: 1.25 },
    },
  },
  {
    month: "Aug",
    channels: {
      "Organic Search": { visits: 6400, conversion: 5.2, revenue: 19800, bounceRate: 31.0, avgDuration: 4.1, engagement: 5.0, returning: 55, goalCompletions: 312, cpc: 0.29 },
      Direct: { visits: 4400, conversion: 7.0, revenue: 15100, bounceRate: 37.8, avgDuration: 3.4, engagement: 4.6, returning: 70, goalCompletions: 288, cpc: 0 },
      "Social Media": { visits: 4500, conversion: 4.1, revenue: 12200, bounceRate: 23.8, avgDuration: 4.8, engagement: 5.6, returning: 55, goalCompletions: 178, cpc: 0.6 },
      Email: { visits: 3050, conversion: 8.9, revenue: 18400, bounceRate: 18.5, avgDuration: 5.7, engagement: 6.0, returning: 88, goalCompletions: 263, cpc: 0.05 },
      Referral: { visits: 2420, conversion: 6.0, revenue: 9400, bounceRate: 34.5, avgDuration: 3.8, engagement: 4.3, returning: 63, goalCompletions: 139, cpc: 0 },
      "Paid Ads": { visits: 2320, conversion: 3.3, revenue: 7600, bounceRate: 46.5, avgDuration: 2.4, engagement: 3.0, returning: 35, goalCompletions: 72, cpc: 1.22 },
    },
  },
  {
    month: "Sep",
    channels: {
      "Organic Search": { visits: 6700, conversion: 5.4, revenue: 21100, bounceRate: 30.2, avgDuration: 4.2, engagement: 5.1, returning: 58, goalCompletions: 330, cpc: 0.27 },
      Direct: { visits: 4620, conversion: 7.2, revenue: 16100, bounceRate: 37.1, avgDuration: 3.5, engagement: 4.7, returning: 74, goalCompletions: 304, cpc: 0 },
      "Social Media": { visits: 4750, conversion: 4.3, revenue: 13100, bounceRate: 23.1, avgDuration: 4.9, engagement: 5.7, returning: 59, goalCompletions: 195, cpc: 0.56 },
      Email: { visits: 3210, conversion: 9.2, revenue: 19700, bounceRate: 17.9, avgDuration: 5.8, engagement: 6.1, returning: 92, goalCompletions: 281, cpc: 0.04 },
      Referral: { visits: 2560, conversion: 6.2, revenue: 10000, bounceRate: 33.6, avgDuration: 3.9, engagement: 4.4, returning: 67, goalCompletions: 150, cpc: 0 },
      "Paid Ads": { visits: 2490, conversion: 3.5, revenue: 8300, bounceRate: 45.5, avgDuration: 2.5, engagement: 3.1, returning: 38, goalCompletions: 79, cpc: 1.19 },
    },
  },
  {
    month: "Oct",
    channels: {
      "Organic Search": { visits: 7000, conversion: 5.6, revenue: 22400, bounceRate: 29.5, avgDuration: 4.3, engagement: 5.2, returning: 61, goalCompletions: 348, cpc: 0.25 },
      Direct: { visits: 4840, conversion: 7.4, revenue: 17100, bounceRate: 36.4, avgDuration: 3.6, engagement: 4.8, returning: 78, goalCompletions: 320, cpc: 0 },
      "Social Media": { visits: 5000, conversion: 4.5, revenue: 14000, bounceRate: 22.4, avgDuration: 5.0, engagement: 5.8, returning: 63, goalCompletions: 212, cpc: 0.52 },
      Email: { visits: 3370, conversion: 9.5, revenue: 21000, bounceRate: 17.3, avgDuration: 5.9, engagement: 6.2, returning: 96, goalCompletions: 299, cpc: 0.03 },
      Referral: { visits: 2700, conversion: 6.4, revenue: 10600, bounceRate: 32.7, avgDuration: 4.0, engagement: 4.5, returning: 71, goalCompletions: 161, cpc: 0 },
      "Paid Ads": { visits: 2660, conversion: 3.7, revenue: 9000, bounceRate: 44.5, avgDuration: 2.6, engagement: 3.2, returning: 41, goalCompletions: 86, cpc: 1.16 },
    },
  },
  {
    month: "Nov",
    channels: {
      "Organic Search": { visits: 7300, conversion: 5.8, revenue: 23700, bounceRate: 28.8, avgDuration: 4.4, engagement: 5.3, returning: 64, goalCompletions: 366, cpc: 0.23 },
      Direct: { visits: 5060, conversion: 7.6, revenue: 18100, bounceRate: 35.7, avgDuration: 3.7, engagement: 4.9, returning: 82, goalCompletions: 336, cpc: 0 },
      "Social Media": { visits: 5250, conversion: 4.7, revenue: 14900, bounceRate: 21.7, avgDuration: 5.1, engagement: 5.9, returning: 67, goalCompletions: 229, cpc: 0.48 },
      Email: { visits: 3530, conversion: 9.8, revenue: 22300, bounceRate: 16.7, avgDuration: 6.0, engagement: 6.3, returning: 100, goalCompletions: 317, cpc: 0.02 },
      Referral: { visits: 2840, conversion: 6.6, revenue: 11200, bounceRate: 31.8, avgDuration: 4.1, engagement: 4.6, returning: 75, goalCompletions: 172, cpc: 0 },
      "Paid Ads": { visits: 2830, conversion: 3.9, revenue: 9700, bounceRate: 43.5, avgDuration: 2.7, engagement: 3.3, returning: 44, goalCompletions: 93, cpc: 1.13 },
    },
  },
  {
    month: "Dec",
    channels: {
      "Organic Search": { visits: 7600, conversion: 6.0, revenue: 25000, bounceRate: 28.0, avgDuration: 4.5, engagement: 5.4, returning: 67, goalCompletions: 384, cpc: 0.21 },
      Direct: { visits: 5280, conversion: 7.8, revenue: 19100, bounceRate: 35.0, avgDuration: 3.8, engagement: 5.0, returning: 86, goalCompletions: 352, cpc: 0 },
      "Social Media": { visits: 5500, conversion: 4.9, revenue: 15800, bounceRate: 21.0, avgDuration: 5.2, engagement: 6.0, returning: 71, goalCompletions: 246, cpc: 0.44 },
      Email: { visits: 3690, conversion: 10.1, revenue: 23600, bounceRate: 16.1, avgDuration: 6.1, engagement: 6.4, returning: 104, goalCompletions: 335, cpc: 0.01 },
      Referral: { visits: 2980, conversion: 6.8, revenue: 11800, bounceRate: 31.0, avgDuration: 4.2, engagement: 4.7, returning: 79, goalCompletions: 183, cpc: 0 },
      "Paid Ads": { visits: 3000, conversion: 4.1, revenue: 10400, bounceRate: 42.5, avgDuration: 2.8, engagement: 3.4, returning: 47, goalCompletions: 100, cpc: 1.1 },
    },
  },
];

// channelColors, chartTypes, metrics unchanged
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

// ----------------------------------------------------------------------
// CustomTooltip, EnhancedLegend, ComparisonMetrics (assumed imported)
// If not available elsewhere, uncomment and define them here
// ----------------------------------------------------------------------
export const AdvancedTrafficChannelAnalysis = () => {
  const [viewMode, setViewMode] = useState("bar");
  const [selectedChannels, setSelectedChannels] = useState(Object.keys(channelColors));
  const [selectedMonth, setSelectedMonth] = useState("Dec"); // now full year, set to Dec
  const [metric, setMetric] = useState("visits");
  const [timeRange, setTimeRange] = useState("1y"); // default to 1 year
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Process data based on time range
  const processedData = useMemo(() => {
    let monthsToShow = monthlyTrafficData;
    if (timeRange === "3m") monthsToShow = monthlyTrafficData.slice(-3);
    if (timeRange === "6m") monthsToShow = monthlyTrafficData.slice(-6);
    // "1y" shows all 12 months
    return monthsToShow.map((month) => {
      const dataPoint = { month: month.month };
      selectedChannels.forEach((channel) => {
        const channelData = month.channels?.[channel];
        if (channelData) dataPoint[channel] = channelData[metric] || 0;
      });
      return dataPoint;
    });
  }, [selectedChannels, metric, timeRange]);

  const toggleChannel = useCallback((channel) => {
    setSelectedChannels((prev) => (prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]));
  }, []);

  const selectAllChannels = useCallback(() => setSelectedChannels(Object.keys(channelColors)), []);
  const deselectAllChannels = useCallback(() => setSelectedChannels([]), []);

  const renderChart = () => {
    if (selectedChannels.length === 0) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <BarChart3 size={64} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">No channels selected</p>
          <p className="text-sm mt-1">Select channels to visualize data</p>
        </motion.div>
      );
    }

    const commonProps = {
      data: processedData,
    };

    switch (viewMode) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} className="dark:stroke-gray-800" />
            <XAxis dataKey="month" height={60} axisLine={{ stroke: "#E5E7EB" }} className="dark:fill-gray-400" />
            <YAxis
              tickFormatter={(v) => (metric === "revenue" ? `$${(v / 1000).toFixed(0)}k` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            {selectedChannels.map((ch) => (
              <Bar key={ch} dataKey={ch} fill={`url(#gradient-${ch})`} radius={[6, 6, 0, 0]} barSize={28} />
            ))}
            <defs>
              {selectedChannels.map((ch) => {
                const c = channelColors[ch];
                return (
                  <linearGradient key={ch} id={`gradient-${ch}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c?.primary} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={c?.dark} stopOpacity={0.7} />
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
              tickFormatter={(v) => (metric === "revenue" ? `$${(v / 1000).toFixed(0)}k` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            {selectedChannels.map((ch) => (
              <Line key={ch} type="monotone" dataKey={ch} stroke={channelColors[ch]?.primary} strokeWidth={3} dot={{ r: 4, fill: channelColors[ch]?.primary }} activeDot={{ r: 6 }} />
            ))}
          </ComposedChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <XAxis dataKey="month" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={{ stroke: "#E5E7EB" }} />
            <YAxis
              tickFormatter={(v) => (metric === "revenue" ? `$${(v / 1000).toFixed(0)}k` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toLocaleString())}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip content={<CustomTooltip metric={metric} />} />
            <defs>
              {selectedChannels.map((ch) => {
                const c = channelColors[ch];
                return (
                  <linearGradient key={ch} id={`area-${ch}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={c?.primary} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={c?.primary} stopOpacity={0.1} />
                  </linearGradient>
                );
              })}
            </defs>
            {selectedChannels.map((ch) => (
              <Area key={ch} type="monotone" dataKey={ch} stroke={channelColors[ch]?.primary} fill={`url(#area-${ch})`} strokeWidth={2} />
            ))}
          </AreaChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
            <PolarGrid stroke="#E5E7EB" className="dark:stroke-gray-800" />
            <PolarAngleAxis dataKey="month" tick={{ fill: "#6B7280" }} />
            <PolarRadiusAxis tick={{ fill: "#6B7280" }} />
            {selectedChannels.map((ch) => (
              <Radar key={ch} name={ch} dataKey={ch} stroke={channelColors[ch]?.primary} fill={channelColors[ch]?.primary} fillOpacity={0.2} strokeWidth={2} />
            ))}
            <Tooltip content={<CustomTooltip metric={metric} />} />
          </RadarChart>
        );
      case "pie":
        const currentMonthData = monthlyTrafficData.find((m) => m.month === selectedMonth);
        const pieData = selectedChannels
          .map((ch) => ({
            name: ch,
            value: currentMonthData?.channels?.[ch]?.[metric] || 0,
            color: channelColors[ch]?.primary,
          }))
          .filter((d) => d.value > 0);
        return (
          <RePieChart>
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
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper className={`p-6 relative overflow-hidden group transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-gray-50 dark:bg-gray-900" : ""}`}>
      {/* floating glows, diagonal pattern, noise – same as before */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-150 transition-all duration-1000" />
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-150 transition-all duration-1000" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id="diagonal-channel" patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-blue-500/30 dark:text-cyan-400/30" />
              <circle cx="25" cy="25" r="2" fill="currentColor" className="text-blue-500/20 dark:text-cyan-400/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-channel)" />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Advanced Channel Analytics</h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Real-time performance across all traffic sources</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Time range selector – now with 3m, 6m, 1y */}
            <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
              {["3m", "6m", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    timeRange === range ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {range === "1y" ? "1 Year" : range === "3m" ? "3 Months" : "6 Months"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chart controls (metric & chart type) – as originally placed inside the chart card */}
        <div className="relative z-10">
          <div className="flex justify-between items-center gap-2">
            {/* Metric selector */}
            <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
              {metrics.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMetric(m.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1 ${
                    metric === m.id ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  <m.icon size={12} />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Chart type selector */}
            <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
              {chartTypes.map((chart) => (
                <button
                  key={chart.id}
                  onClick={() => setViewMode(chart.id)}
                  className={`p-1.5 rounded-full text-[10px] font-medium transition-all ${
                    viewMode === chart.id ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                  title={chart.label}
                >
                  <chart.icon size={14} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Legend */}
        <div className="mt-6 relative z-10">
          <EnhancedLegend selectedChannels={selectedChannels} onToggle={toggleChannel} onSelectAll={selectAllChannels} onDeselectAll={deselectAllChannels} />
        </div>

        {/* Chart Container */}
        <div className="h-[400px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </Wrapper>
  );
};

export const EnhancedLegend = ({ selectedChannels, onToggle, onSelectAll, onDeselectAll }) => {
  return (
    <div className="relative overflow-hidde">
      {/* Channel buttons – now in pill style, matching metric selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(channelColors).map(([channel, colors]) => {
          const isSelected = selectedChannels.includes(channel);
          return (
            <motion.button
              key={channel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(channel)}
              className={`
                relative overflow-hidden px-3 py-1.5 rounded-full text-[10px] font-medium transition-all
                flex items-center gap-1.5
                ${isSelected ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md` : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 bg-transparent"}
              `}
            >
              {/* Dot indicator */}
              <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : `bg-gradient-to-br ${colors.gradient}`}`} />
              {channel}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const CustomTooltip = ({ active, payload, label, metric = "visits" }) => {
  if (active && payload && payload.length) {
    const monthData = monthlyTrafficData.find((m) => m.month === label);
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-4 min-w-[280px] backdrop-blur-sm  ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20 dark:border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white">
              <BarChart3 size={14} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{label}</h3>
          </div>
          <div className="px-3 py-1.5 bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
            Total: {metric === "revenue" ? `$${(total / 1000).toFixed(1)}k` : total.toLocaleString()}
          </div>
        </div>

        {/* Channel list */}
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          {payload.map((entry, index) => {
            const channel = entry.dataKey || entry.name;
            const channelData = monthData?.channels?.[channel];
            const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
            const colors = channelColors[channel] || { primary: "#666", gradient: "from-gray-400 to-gray-600" };

            return (
              <div
                key={index}
                className="group p-3 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all duration-200"
              >
                {/* Main row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${colors.gradient}`} />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{channel}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-800/50 px-2 py-0.5 rounded-full">{percentage}%</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{metric === "revenue" ? `$${(entry.value / 1000).toFixed(1)}k` : entry.value?.toLocaleString()}</div>
                </div>

                {/* Stats row (only if channelData exists) */}
                {channelData && (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv</div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{channelData.conversion}%</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engage</div>
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{channelData.engagement}/10</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bounce</div>
                      <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">{channelData.bounceRate}%</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Optional footer */}
        <div className="mt-3 pt-2 text-[9px] text-gray-400 dark:text-gray-500 border-t border-white/10 dark:border-gray-800/50 flex justify-between">
          <span>Click to filter</span>
          <span>Hover for details</span>
        </div>
      </div>
    );
  }
  return null;
};

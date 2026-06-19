// pages/Overview.jsx
import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Building2,
  BookOpen,
  BookText,
  FileCode,
  MessageSquare,
  Library,
  FolderOpen,
  TrendingDown,
  ChevronRight,
  Sparkles,
  Target,
  Clock,
  Zap,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, Tooltip, ResponsiveContainer, Cell, Area, AreaChart, PieChart, Pie, ComposedChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Wrapper } from "@/utils/Router";

const formatNumber = (num) => {
  if (!num) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ==============================
// Enhanced Color System with Dark Mode Support
// ==============================
const colorSchemes = {
  blue: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    tertiary: "#EC4899",
    gradient: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
    light: "rgba(59, 130, 246, 0.08)",
    medium: "rgba(59, 130, 246, 0.5)",
    border: "rgba(59, 130, 246, 0.2)",
  },
  emerald: {
    primary: "#10B981",
    secondary: "#14B8A6",
    tertiary: "#06B6D4",
    gradient: "linear-gradient(135deg, #10B981 0%, #14B8A6 50%, #06B6D4 100%)",
    light: "rgba(16, 185, 129, 0.08)",
    medium: "rgba(16, 185, 129, 0.5)",
    border: "rgba(16, 185, 129, 0.2)",
  },
  violet: {
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    tertiary: "#C084FC",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C084FC 100%)",
    light: "rgba(139, 92, 246, 0.08)",
    medium: "rgba(139, 92, 246, 0.5)",
    border: "rgba(139, 92, 246, 0.2)",
  },
  rose: {
    primary: "#F43F5E",
    secondary: "#FB7185",
    tertiary: "#FDA4AF",
    gradient: "linear-gradient(135deg, #F43F5E 0%, #FB7185 50%, #FDA4AF 100%)",
    light: "rgba(244, 63, 94, 0.08)",
    medium: "rgba(244, 63, 94, 0.5)",
    border: "rgba(244, 63, 94, 0.2)",
  },
  amber: {
    primary: "#F59E0B",
    secondary: "#FBBF24",
    tertiary: "#FCD34D",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FCD34D 100%)",
    light: "rgba(245, 158, 11, 0.08)",
    medium: "rgba(245, 158, 11, 0.5)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  cyan: {
    primary: "#06B6D4",
    secondary: "#22D3EE",
    tertiary: "#67E8F9",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #22D3EE 50%, #67E8F9 100%)",
    light: "rgba(6, 182, 212, 0.08)",
    medium: "rgba(6, 182, 212, 0.5)",
    border: "rgba(6, 182, 212, 0.2)",
  },
  indigo: {
    primary: "#6366F1",
    secondary: "#818CF8",
    tertiary: "#A5B4FC",
    gradient: "linear-gradient(135deg, #6366F1 0%, #818CF8 50%, #A5B4FC 100%)",
    light: "rgba(99, 102, 241, 0.08)",
    medium: "rgba(99, 102, 241, 0.5)",
    border: "rgba(99, 102, 241, 0.2)",
  },
};

// ==============================
// MetricCard Component (BlogViewStats style)
// ==============================
const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue", children, chart, showChart = true, onClick, badge, size = "md" }) => {
  const colors = colorSchemes[color] || colorSchemes.blue;
  const isPositive = trend?.value >= 0;

  const sizeStyles = {
    sm: { padding: "p-4", iconSize: 16, valueSize: "text-2xl", chartHeight: "h-[60px]" },
    md: { padding: "p-5", iconSize: 18, valueSize: "text-3xl", chartHeight: "h-[80px]" },
    lg: { padding: "p-6", iconSize: 20, valueSize: "text-4xl", chartHeight: "h-[100px]" },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  const formatNumber = (num) => {
    if (typeof num !== "number") return num;
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    });
    return formatter.format(num);
  };

  return (
    <Wrapper className={`${styles.padding} relative overflow-hidden group`}>
      {/* Floating glow backgrounds */}
      <div className={`absolute -bottom-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} style={{ background: colors.light }} />
      <div className={`absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700`} style={{ background: colors.light }} />

      {/* Diagonal pattern overlay (visible on hover) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <pattern id={`diagonal-${color}`} patternUnits="userSpaceOnUse" width="50" height="50" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="50" stroke="currentColor" strokeWidth="0.5" className="opacity-30" style={{ color: colors.primary }} />
              <circle cx="25" cy="25" r="2" fill="currentColor" className="opacity-20" style={{ color: colors.primary }} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#diagonal-${color})`} />
        </svg>
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
      </div>

      {/* Header with icon + title */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div
            className={`size-10 bg-gradient-to-br rounded-xl flex items-center justify-center text-white shadow-lg shadow-${color}-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}
            style={{ background: colors.gradient }}
          >
            <Icon size={styles.iconSize} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Sparkles size={10} style={{ color: colors.primary }} />
              {subtitle}
            </p>
          </div>
        </div>

        {/* Badge */}
        {badge && (
          <div className="px-2 py-0.5 rounded-full text-[9px] font-semibold backdrop-blur-sm border bg-white/20 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 border-white/30 dark:border-gray-700/50">
            {badge}
          </div>
        )}
      </div>

      {/* Value and Trend */}
      <div className="flex items-baseline gap-3 mb-2 relative z-10">
        <span className={`${styles.valueSize} font-bold`} style={{ color: colors.primary }}>
          {formatNumber(value)}
        </span>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>

      {/* Chart */}
      {showChart && chart && <div className={`${styles.chartHeight} w-full mb-3 relative z-10`}>{chart}</div>}

      {/* Footer */}
      {children && <div className="mt-3 pt-2 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/30 flex justify-between relative z-10">{children}</div>}

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-100 pointer-events-none overflow-hidden">
        <div className="absolute -inset-full top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shimmer" />
      </div>
    </Wrapper>
  );
};

// ==============================
// Section Header Component (simplified)
// ==============================
const SectionHeader = ({ title, subtitle, action, icon: Icon, color = "blue" }) => {
  const colors = colorSchemes[color];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: colors.light, color: colors.primary }}>
          {Icon ? <Icon size={18} /> : <BarChart3 size={18} />}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>

      {action && (
        <button className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          {action}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
};

// ==============================
// Chart Data (unchanged)
// ==============================
const chartData = {
  visits: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 5000) + 3000,
  })),
  revenue: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 500) + 300,
  })),
  conversion: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.random() * 3 + 2,
  })),
  engagement: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.random() * 3 + 7,
  })),
  universities: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 5) + 8,
  })),
  faculties: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 15) + 25,
  })),
  programs: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 30) + 85,
  })),
  subjects: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 150) + 650,
  })),
  chapters: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 500) + 2500,
  })),
  projects: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 50) + 350,
  })),
  users: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 200) + 950,
  })),
  blogs: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 15) + 65,
  })),
  messages: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 30) + 85,
  })),
  storage: Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    value: Math.floor(Math.random() * 200) + 450,
  })),
};

// ==============================
// Main Summary Component (BlogViewStats style)
// ==============================
export const Summary = () => {
  const [metrics, setMetrics] = useState({
    totalVisits: 15432,
    previousVisits: 13728,
    revenue: 54321,
    previousRevenue: 50123,
    conversion: 4.5,
    engagement: 8.5,
    previousEngagement: 8.1,
    universities: {
      count: 15,
      previousCount: 12,
      types: { public: 10, private: 5 },
      latest: "Tribhuvan University",
      growth: 25,
    },
    faculties: {
      count: 45,
      previousCount: 38,
      avgPerUni: 3.0,
      topUni: "TU",
    },
    programs: {
      count: 120,
      previousCount: 98,
      featured: 15,
      latest: "BSc CSIT",
    },
    subjects: {
      count: 850,
      previousCount: 720,
      totalViews: 125000,
      avgPages: 12.5,
      paid: 320,
      free: 530,
    },
    chapters: {
      count: 3200,
      previousCount: 2850,
      avgRating: 4.2,
      reviews: 150,
      withVideo: 1250,
    },
    projects: {
      count: 450,
      previousCount: 380,
      downloads: 12500,
      featured: 25,
      premium: 180,
    },
    users: {
      count: 1250,
      previousCount: 980,
      admins: 5,
      authors: 45,
      verified: 890,
      paid: 320,
      active: 876,
    },
    blogs: {
      count: 85,
      previousCount: 72,
      views: 12500,
      public: 65,
      featured: 12,
      comments: 450,
    },
    contactForms: {
      count: 125,
      previousCount: 98,
      responseRate: 85,
      pending: 15,
      replied: 110,
    },
    assetLimits: {
      used: 750,
      total: 1000,
      percentage: 75,
    },
  });

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const calculateTrend = (current, previous) => ({
    value: parseFloat((((current - previous) / previous) * 100).toFixed(1)),
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // KPI Cards Configuration
  const kpiMetrics = [
    {
      title: "Total Visits",
      value: metrics.totalVisits,
      subtitle: "Last 30 days",
      icon: Users,
      color: "blue",
      trend: calculateTrend(metrics.totalVisits, metrics.previousVisits),
      badge: "Live",
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.visits}>
            <defs>
              <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="url(#visitsGradient)" strokeWidth={2} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Avg. Daily: 512</span>
          <span style={{ color: "#3B82F6" }}>+12.3%</span>
        </>
      ),
    },
    {
      title: "Active Users",
      value: metrics.users.active,
      subtitle: "Currently online",
      icon: Users,
      color: "emerald",
      trend: { value: 8.5 },
      badge: "Real-time",
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.users.slice(-7)}>
            <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </LineChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Peak: 1.2k</span>
          <span style={{ color: "#10B981" }}>+8.5%</span>
        </>
      ),
    },
    {
      title: "Conversion Rate",
      value: metrics.conversion,
      subtitle: "Overall",
      icon: Target,
      color: "violet",
      trend: { value: 2.1 },
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.conversion}>
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={15} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </BarChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Target: 5%</span>
          <span style={{ color: "#8B5CF6" }}>+2.1%</span>
        </>
      ),
    },
    {
      title: "Engagement",
      value: metrics.engagement,
      subtitle: "Avg. minutes",
      icon: Activity,
      color: "rose",
      trend: calculateTrend(metrics.engagement, metrics.previousEngagement),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.engagement}>
            <defs>
              <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#F43F5E" fill="url(#engagementGradient)" strokeWidth={2} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>vs 8.1</span>
          <span style={{ color: "#F43F5E" }}>+0.4</span>
        </>
      ),
    },
  ];

  // Academic Metrics
  const academicMetrics = [
    {
      title: "Universities",
      value: metrics.universities.count,
      subtitle: "Registered institutions",
      icon: Building2,
      color: "indigo",
      trend: calculateTrend(metrics.universities.count, metrics.universities.previousCount),
      badge: `${metrics.universities.growth}%`,
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Public", value: metrics.universities.types.public },
                { name: "Private", value: metrics.universities.types.private },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={48}
              dataKey="value"
            >
              <Cell fill="#6366F1" />
              <Cell fill="#A5B4FC" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Latest: {metrics.universities.latest}</span>
          <span style={{ color: "#6366F1" }}>+3</span>
        </>
      ),
    },
    {
      title: "Faculties",
      value: metrics.faculties.count,
      subtitle: "Across universities",
      icon: Library,
      color: "amber",
      trend: calculateTrend(metrics.faculties.count, metrics.faculties.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.faculties}>
            <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={15} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </BarChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Avg per Uni: {metrics.faculties.avgPerUni}</span>
          <span style={{ color: "#F59E0B" }}>Top: {metrics.faculties.topUni}</span>
        </>
      ),
    },
    {
      title: "Programs",
      value: metrics.programs.count,
      subtitle: "Courses available",
      icon: BookOpen,
      color: "cyan",
      trend: calculateTrend(metrics.programs.count, metrics.programs.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.programs}>
            <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} dot={false} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </LineChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Featured: {metrics.programs.featured}</span>
          <span style={{ color: "#06B6D4" }}>{metrics.programs.latest}</span>
        </>
      ),
    },
    {
      title: "Subjects",
      value: metrics.subjects.count,
      subtitle: "Total subjects",
      icon: BookText,
      color: "emerald",
      trend: calculateTrend(metrics.subjects.count, metrics.subjects.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.subjects}>
            <defs>
              <linearGradient id="subjectsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#subjectsGradient)" strokeWidth={2} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Free: {metrics.subjects.free}</span>
          <span style={{ color: "#10B981" }}>Paid: {metrics.subjects.paid}</span>
        </>
      ),
    },
    {
      title: "Chapters",
      value: metrics.chapters.count,
      subtitle: "Learning materials",
      icon: FolderOpen,
      color: "violet",
      trend: calculateTrend(metrics.chapters.count, metrics.chapters.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.chapters}>
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={15} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </BarChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>⭐ {metrics.chapters.avgRating}/5</span>
          <span style={{ color: "#8B5CF6" }}>{metrics.chapters.reviews} reviews</span>
        </>
      ),
    },
    {
      title: "Projects",
      value: metrics.projects.count,
      subtitle: "Student projects",
      icon: FileCode,
      color: "rose",
      trend: calculateTrend(metrics.projects.count, metrics.projects.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData.projects}>
            <Bar dataKey="value" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={15} />
            <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </ComposedChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Downloads: {formatNumber(metrics.projects.downloads)}</span>
          <span style={{ color: "#F43F5E" }}>Featured: {metrics.projects.featured}</span>
        </>
      ),
    },
  ];

  // Content Metrics
  const contentMetrics = [
    {
      title: "Blog Posts",
      value: metrics.blogs.count,
      subtitle: "Published articles",
      icon: MessageSquare,
      color: "amber",
      trend: calculateTrend(metrics.blogs.count, metrics.blogs.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.blogs}>
            <defs>
              <linearGradient id="blogsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="url(#blogsGradient)" strokeWidth={2} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </AreaChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Views: {formatNumber(metrics.blogs.views)}</span>
          <span style={{ color: "#F59E0B" }}>{metrics.blogs.comments} comments</span>
        </>
      ),
    },
    {
      title: "Contact Forms",
      value: metrics.contactForms.count,
      subtitle: "Total submissions",
      icon: MessageSquare,
      color: "blue",
      trend: calculateTrend(metrics.contactForms.count, metrics.contactForms.previousCount),
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.messages}>
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={15} />
            <Tooltip cursor={false} contentStyle={{ display: "none" }} />
          </BarChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Response: {metrics.contactForms.responseRate}%</span>
          <span style={{ color: "#3B82F6" }}>{metrics.contactForms.pending} pending</span>
        </>
      ),
    },
    {
      title: "Storage",
      value: `${metrics.assetLimits.used}GB`,
      subtitle: `of ${metrics.assetLimits.total}GB used`,
      icon: Download,
      color: "cyan",
      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Used", value: metrics.assetLimits.used },
                { name: "Free", value: metrics.assetLimits.total - metrics.assetLimits.used },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={40}
              dataKey="value"
            >
              <Cell fill="#06B6D4" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ),
      children: (
        <>
          <span>Free: {metrics.assetLimits.total - metrics.assetLimits.used}GB</span>
          <span style={{ color: "#06B6D4" }}>{metrics.assetLimits.percentage}% used</span>
        </>
      ),
    },
  ];

  return (
    <Wrapper>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={18} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-full p-1">
              {["day", "week", "month", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all capitalize ${
                    selectedPeriod === period ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <SectionHeader title="Key Performance Indicators" subtitle="Real-time metrics at a glance" icon={Target} color="blue" action="View Details" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} size="md" />
          ))}
        </div>

        {/* Academic Section */}
        <SectionHeader title="Academic Overview" subtitle="Universities, faculties, and programs" icon={Building2} color="indigo" action="View All" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {academicMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} size="lg" />
          ))}
        </div>

        {/* Content Section */}
        <SectionHeader title="Content & Engagement" subtitle="Blogs, messages, and storage" icon={MessageSquare} color="amber" action="Manage Content" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contentMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} size="md" />
          ))}
        </div>

        {/* Footer with summary */}
        <div className="mt-4 pt-3 text-[10px] text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700/50 flex justify-between">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            All systems operational
          </span>
          <span>Last sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Wrapper>
  );
};

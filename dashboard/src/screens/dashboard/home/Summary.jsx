// pages/Overview.jsx

import { useState } from "react";

import {
  Activity,
  BarChart3,
  BookOpen,
  BookText,
  Building2,
  ChevronRight,
  Clock,
  Download,
  FileCode,
  FolderOpen,
  Library,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { Area, AreaChart, Bar, BarChart, Cell, ComposedChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { motion } from "framer-motion";

import { Wrapper } from "@/routes";

const formatNumber = (num) => {
  if (!num) {
    return "0";
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/* =========================================================
   Dark dashboard accent system
========================================================= */

const colorSchemes = {
  blue: {
    primary: "#3B82F6",
    secondary: "#60A5FA",
    tertiary: "#818CF8",
    gradient: "linear-gradient(135deg, #2563EB 0%, #3B82F6 55%, #6366F1 100%)",
    light: "rgba(59, 130, 246, 0.075)",
    soft: "rgba(59, 130, 246, 0.035)",
    medium: "rgba(59, 130, 246, 0.45)",
    border: "rgba(96, 165, 250, 0.14)",
    shadow: "rgba(59, 130, 246, 0.10)",
  },

  emerald: {
    primary: "#10B981",
    secondary: "#34D399",
    tertiary: "#22D3EE",
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 55%, #14B8A6 100%)",
    light: "rgba(16, 185, 129, 0.075)",
    soft: "rgba(16, 185, 129, 0.035)",
    medium: "rgba(16, 185, 129, 0.45)",
    border: "rgba(52, 211, 153, 0.14)",
    shadow: "rgba(16, 185, 129, 0.10)",
  },

  violet: {
    primary: "#8B5CF6",
    secondary: "#A78BFA",
    tertiary: "#818CF8",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 55%, #6366F1 100%)",
    light: "rgba(139, 92, 246, 0.075)",
    soft: "rgba(139, 92, 246, 0.035)",
    medium: "rgba(139, 92, 246, 0.45)",
    border: "rgba(167, 139, 250, 0.14)",
    shadow: "rgba(139, 92, 246, 0.10)",
  },

  rose: {
    primary: "#F43F5E",
    secondary: "#FB7185",
    tertiary: "#F97316",
    gradient: "linear-gradient(135deg, #E11D48 0%, #F43F5E 55%, #F97316 100%)",
    light: "rgba(244, 63, 94, 0.07)",
    soft: "rgba(244, 63, 94, 0.03)",
    medium: "rgba(244, 63, 94, 0.42)",
    border: "rgba(251, 113, 133, 0.13)",
    shadow: "rgba(244, 63, 94, 0.09)",
  },

  amber: {
    primary: "#F59E0B",
    secondary: "#FBBF24",
    tertiary: "#F97316",
    gradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 55%, #F97316 100%)",
    light: "rgba(245, 158, 11, 0.075)",
    soft: "rgba(245, 158, 11, 0.035)",
    medium: "rgba(245, 158, 11, 0.45)",
    border: "rgba(251, 191, 36, 0.14)",
    shadow: "rgba(245, 158, 11, 0.10)",
  },

  cyan: {
    primary: "#06B6D4",
    secondary: "#22D3EE",
    tertiary: "#3B82F6",
    gradient: "linear-gradient(135deg, #0891B2 0%, #06B6D4 55%, #3B82F6 100%)",
    light: "rgba(6, 182, 212, 0.075)",
    soft: "rgba(6, 182, 212, 0.035)",
    medium: "rgba(6, 182, 212, 0.45)",
    border: "rgba(34, 211, 238, 0.14)",
    shadow: "rgba(6, 182, 212, 0.10)",
  },

  indigo: {
    primary: "#6366F1",
    secondary: "#818CF8",
    tertiary: "#8B5CF6",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #6366F1 55%, #8B5CF6 100%)",
    light: "rgba(99, 102, 241, 0.075)",
    soft: "rgba(99, 102, 241, 0.035)",
    medium: "rgba(99, 102, 241, 0.45)",
    border: "rgba(129, 140, 248, 0.14)",
    shadow: "rgba(99, 102, 241, 0.10)",
  },
};

/* =========================================================
   Metric card
========================================================= */

const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue", children, chart, showChart = true, onClick, badge, size = "md" }) => {
  const colors = colorSchemes[color] || colorSchemes.blue;

  const isPositive = Number(trend?.value || 0) >= 0;

  const sizeStyles = {
    sm: {
      padding: "p-4",
      iconSize: 16,
      valueSize: "text-2xl",
      chartHeight: "h-[60px]",
    },

    md: {
      padding: "p-4 2xl:p-5",
      iconSize: 18,
      valueSize: "text-[27px]",
      chartHeight: "h-[82px]",
    },

    lg: {
      padding: "p-5",
      iconSize: 19,
      valueSize: "text-[32px]",
      chartHeight: "h-[98px]",
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  const formatCompactNumber = (num) => {
    if (typeof num !== "number") {
      return num;
    }

    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <Wrapper className="h-full overflow-hidden p-0">
      <motion.article
        onClick={onClick}
        whileHover={{
          y: -3,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={`group/card relative h-full overflow-hidden rounded-[inherit] border border-slate-200/70 bg-slate-50/40 transition-colors duration-300 hover:border-slate-300 dark:border-white/[0.055] dark:bg-transparent dark:hover:border-white/[0.09] dark:hover:bg-white/[0.012] ${styles.padding} ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        {/* Soft accent lighting */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full blur-[85px] transition-transform duration-700 group-hover/card:scale-125"
          style={{
            background: colors.light,
          }}
        />

        <div
          className="pointer-events-none absolute -bottom-28 -left-24 size-56 rounded-full blur-[90px]"
          style={{
            background: colors.soft,
          }}
        />

        {/* Top accent line */}
        <div
          className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-75"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.secondary}, transparent)`,
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover/card:scale-105"
                style={{
                  background: colors.light,
                  borderColor: colors.border,
                  color: colors.secondary,
                  boxShadow: `0 10px 25px ${colors.shadow}`,
                }}
              >
                <Icon size={styles.iconSize} />
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[10px] font-bold text-slate-800 dark:text-[#D8DEE8]">{title}</h4>

                <p className="mt-1 flex items-center gap-1.5 truncate text-[8px] text-slate-400 dark:text-[#687586]">
                  <Sparkles
                    size={10}
                    style={{
                      color: colors.primary,
                    }}
                  />

                  {subtitle}
                </p>
              </div>
            </div>

            {badge && (
              <div
                className="shrink-0 rounded-full border px-2.5 py-1 text-[7px] font-semibold uppercase tracking-[0.07em]"
                style={{
                  background: colors.soft,
                  borderColor: colors.border,
                  color: colors.secondary,
                }}
              >
                {badge}
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span
                className={`${styles.valueSize} font-black tabular-nums tracking-[-0.05em]`}
                style={{
                  color: colors.secondary,
                }}
              >
                {formatCompactNumber(value)}
              </span>

              <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.11em] text-slate-400 dark:text-[#596575]">Current value</p>
            </div>

            {trend && (
              <div
                className={`mb-1 flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-bold tabular-nums ${
                  isPositive ? "border-emerald-300/[0.11] bg-emerald-300/[0.04] text-emerald-700 dark:text-emerald-200/70" : "border-red-300/[0.11] bg-red-300/[0.04] text-red-700 dark:text-red-200/70"
                }`}
              >
                {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {isPositive ? "+" : ""}
                {trend.value}%
              </div>
            )}
          </div>

          {/* Chart surface */}
          {showChart && chart && (
            <div className={`relative mt-4 w-full overflow-hidden rounded-xl border border-slate-200/60 bg-white/45 px-1 pt-2 dark:border-white/[0.05] dark:bg-transparent ${styles.chartHeight}`}>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-12 opacity-70"
                style={{
                  background: `linear-gradient(to top, ${colors.soft}, transparent)`,
                }}
              />

              <div className="relative z-10 h-full">{chart}</div>
            </div>
          )}

          {/* Footer */}
          {children && (
            <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-slate-200/60 pt-3 text-[8px] text-slate-400 dark:border-[#242C36] dark:text-[#687586]">
              {children}
            </div>
          )}
        </div>
      </motion.article>
    </Wrapper>
  );
};

/* =========================================================
   Section header
========================================================= */

const SectionHeader = ({ title, subtitle, action, icon: Icon, color = "blue" }) => {
  const colors = colorSchemes[color] || colorSchemes.blue;

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            background: colors.light,
            borderColor: colors.border,
            color: colors.secondary,
          }}
        >
          {Icon ? <Icon size={18} /> : <BarChart3 size={18} />}
        </div>

        <div>
          <h2 className="text-[12px] font-black tracking-[-0.02em] text-slate-900 dark:text-[#D8DEE8]">{title}</h2>

          <p className="mt-1 text-[8px] text-slate-400 dark:text-[#687586]">{subtitle}</p>
        </div>
      </div>

      {action && (
        <button
          type="button"
          className="group/action inline-flex h-9 w-fit items-center gap-2 rounded-xl border border-slate-200/70 bg-white/45 px-3 text-[8px] font-semibold text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-800 dark:border-white/[0.055] dark:bg-transparent dark:text-[#8491A3] dark:hover:border-white/[0.09] dark:hover:bg-white/[0.012] dark:hover:text-[#D8DEE8]"
        >
          {action}

          <ChevronRight size={13} className="transition-transform duration-300 group-hover/action:translate-x-0.5" />
        </button>
      )}
    </div>
  );
};

/* =========================================================
   Chart data
========================================================= */

const chartData = {
  visits: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 5000) + 3000,
    }),
  ),

  revenue: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 500) + 300,
    }),
  ),

  conversion: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.random() * 3 + 2,
    }),
  ),

  engagement: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.random() * 3 + 7,
    }),
  ),

  universities: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 5) + 8,
    }),
  ),

  faculties: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 15) + 25,
    }),
  ),

  programs: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 30) + 85,
    }),
  ),

  subjects: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 150) + 650,
    }),
  ),

  chapters: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 500) + 2500,
    }),
  ),

  projects: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 50) + 350,
    }),
  ),

  users: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 200) + 950,
    }),
  ),

  blogs: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 15) + 65,
    }),
  ),

  messages: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 30) + 85,
    }),
  ),

  storage: Array.from(
    {
      length: 12,
    },
    (_, i) => ({
      name: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],

      value: Math.floor(Math.random() * 200) + 450,
    }),
  ),
};

/* =========================================================
   Dashboard
========================================================= */

export const Summary = () => {
  const [metrics] = useState({
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

      types: {
        public: 10,
        private: 5,
      },

      latest: "Tribhuvan University",
      growth: 25,
    },

    faculties: {
      count: 45,
      previousCount: 38,
      avgPerUni: 3,
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

  const calculateTrend = (current, previous) => ({
    value: parseFloat((((current - previous) / previous) * 100).toFixed(1)),
  });

  const handleRefresh = () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  /* =======================================================
     KPI cards
  ======================================================= */

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

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Avg. Daily: 512</span>

          <span
            style={{
              color: "#60A5FA",
            }}
          >
            +12.3%
          </span>
        </>
      ),
    },

    {
      title: "Active Users",
      value: metrics.users.active,
      subtitle: "Currently online",
      icon: Users,
      color: "emerald",

      trend: {
        value: 8.5,
      },

      badge: "Real-time",

      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.users.slice(-7)}>
            <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={false} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Peak: 1.2k</span>

          <span
            style={{
              color: "#34D399",
            }}
          >
            +8.5%
          </span>
        </>
      ),
    },

    {
      title: "Conversion Rate",
      value: metrics.conversion,
      subtitle: "Overall",
      icon: Target,
      color: "violet",

      trend: {
        value: 2.1,
      },

      chart: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.conversion}>
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 1, 1]} barSize={12} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Target: 5%</span>

          <span
            style={{
              color: "#A78BFA",
            }}
          >
            +2.1%
          </span>
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
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.26} />

                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area type="monotone" dataKey="value" stroke="#F43F5E" fill="url(#engagementGradient)" strokeWidth={2} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>vs 8.1</span>

          <span
            style={{
              color: "#FB7185",
            }}
          >
            +0.4
          </span>
        </>
      ),
    },
  ];

  /* =======================================================
     Academic cards
  ======================================================= */

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
                {
                  name: "Public",
                  value: metrics.universities.types.public,
                },
                {
                  name: "Private",
                  value: metrics.universities.types.private,
                },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={31}
              outerRadius={45}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
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

          <span
            style={{
              color: "#818CF8",
            }}
          >
            +3
          </span>
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
            <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 1, 1]} barSize={12} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Avg per Uni: {metrics.faculties.avgPerUni}</span>

          <span
            style={{
              color: "#FBBF24",
            }}
          >
            Top: {metrics.faculties.topUni}
          </span>
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

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Featured: {metrics.programs.featured}</span>

          <span
            style={{
              color: "#22D3EE",
            }}
          >
            {metrics.programs.latest}
          </span>
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
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.26} />

                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#subjectsGradient)" strokeWidth={2} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Free: {metrics.subjects.free}</span>

          <span
            style={{
              color: "#34D399",
            }}
          >
            Paid: {metrics.subjects.paid}
          </span>
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
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 1, 1]} barSize={12} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>⭐ {metrics.chapters.avgRating}/5</span>

          <span
            style={{
              color: "#A78BFA",
            }}
          >
            {metrics.chapters.reviews} reviews
          </span>
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
            <Bar dataKey="value" fill="#F43F5E" radius={[4, 4, 1, 1]} barSize={12} opacity={0.38} />

            <Line type="monotone" dataKey="value" stroke="#FB7185" strokeWidth={2} dot={false} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Downloads: {formatNumber(metrics.projects.downloads)}</span>

          <span
            style={{
              color: "#FB7185",
            }}
          >
            Featured: {metrics.projects.featured}
          </span>
        </>
      ),
    },
  ];

  /* =======================================================
     Content cards
  ======================================================= */

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
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.26} />

                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="url(#blogsGradient)" strokeWidth={2} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Views: {formatNumber(metrics.blogs.views)}</span>

          <span
            style={{
              color: "#FBBF24",
            }}
          >
            {metrics.blogs.comments} comments
          </span>
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
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 1, 1]} barSize={12} />

            <Tooltip
              cursor={false}
              contentStyle={{
                display: "none",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>Response: {metrics.contactForms.responseRate}%</span>

          <span
            style={{
              color: "#60A5FA",
            }}
          >
            {metrics.contactForms.pending} pending
          </span>
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
                {
                  name: "Used",
                  value: metrics.assetLimits.used,
                },
                {
                  name: "Free",
                  value: metrics.assetLimits.total - metrics.assetLimits.used,
                },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={27}
              outerRadius={42}
              paddingAngle={4}
              dataKey="value"
              stroke="transparent"
            >
              <Cell fill="#06B6D4" />
              <Cell fill="#27313D" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ),

      children: (
        <>
          <span>
            Free: {metrics.assetLimits.total - metrics.assetLimits.used}
            GB
          </span>

          <span
            style={{
              color: "#22D3EE",
            }}
          >
            {metrics.assetLimits.percentage}% used
          </span>
        </>
      ),
    },
  ];

  return (
    <Wrapper className="overflow-hidden p-0">
      <div className="relative overflow-hidden rounded-[inherit]   p-4   sm:p-5 2xl:p-6">
        {/* Background effects */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-indigo-500/[0.025] blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 size-96 rounded-full bg-cyan-500/[0.018] blur-[120px]" />

        <div className="relative z-10 space-y-4">
          {/* Dashboard header */}
          <div className="flex flex-col gap-4 rounded-[22px] border border-slate-200/70 bg-white/45 p-4 dark:border-white/[0.055] dark:bg-transparent sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/15 bg-indigo-500/[0.07] text-indigo-700 shadow-[0_12px_28px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.09] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70">
                <BarChart3 size={19} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-black tracking-[-0.02em] text-slate-900 dark:text-[#E7EBF1]">Dashboard Overview</h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-500/[0.05] px-2 py-1 text-[7px] font-semibold text-emerald-700 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.03] dark:text-emerald-200/65">
                    <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Live
                  </span>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-[8px] text-slate-400 dark:text-[#687586]">
                  <Clock size={11} />
                  Last updated: {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Period selector */}
              <div className="flex items-center rounded-xl border border-slate-200/70 bg-slate-50/60 p-1 dark:border-white/[0.055] dark:bg-transparent">
                {["day", "week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`h-8 rounded-lg px-3 text-[8px] font-semibold capitalize transition-all duration-300 ${
                      selectedPeriod === period
                        ? "border border-indigo-300/20 bg-indigo-500/[0.09] text-indigo-700 shadow-[0_7px_18px_rgba(79,70,229,0.08)] dark:border-indigo-300/[0.1] dark:bg-indigo-300/[0.05] dark:text-indigo-200/75"
                        : "border border-transparent text-slate-400 hover:text-slate-700 dark:text-[#687586] dark:hover:text-[#D8DEE8]"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-label="Refresh dashboard"
                disabled={refreshing}
                onClick={handleRefresh}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/60 px-3 text-[8px] font-semibold text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/25 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.055] dark:bg-transparent dark:text-[#8491A3] dark:hover:border-cyan-300/[0.1] dark:hover:bg-cyan-300/[0.025] dark:hover:text-cyan-200/65"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />

                <span className="hidden sm:inline">{refreshing ? "Refreshing" : "Refresh"}</span>
              </button>
            </div>
          </div>

          {/* KPI section */}
          <section className="border-none border-slate-200/60 pt-1 dark:border-[#242C36]">
            <SectionHeader title="Key Performance Indicators" subtitle="Real-time metrics at a glance" icon={Target} color="blue" action="View Details" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
              {kpiMetrics.map((metric, index) => (
                <MetricCard key={`${metric.title}-${index}`} {...metric} size="md" />
              ))}
            </div>
          </section>

          {/* Academic section */}
          <section className="border-t border-slate-200/60 pt-5 dark:border-[#242C36]">
            <SectionHeader title="Academic Overview" subtitle="Universities, faculties, and programs" icon={Building2} color="indigo" action="View All" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {academicMetrics.map((metric, index) => (
                <MetricCard key={`${metric.title}-${index}`} {...metric} size="lg" />
              ))}
            </div>
          </section>

          {/* Content section */}
          <section className="border-t border-slate-200/60 pt-5 dark:border-[#242C36]">
            <SectionHeader title="Content & Engagement" subtitle="Blogs, messages, and storage" icon={MessageSquare} color="amber" action="Manage Content" />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {contentMetrics.map((metric, index) => (
                <MetricCard key={`${metric.title}-${index}`} {...metric} size="md" />
              ))}
            </div>
          </section>

          {/* Dashboard footer */}
          <footer className="flex flex-col gap-3 border-t border-slate-200/60 pt-4 text-[8px] text-slate-400 dark:border-[#242C36] dark:text-[#687586] sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
              All systems operational
            </span>

            <span>Last sync: {new Date().toLocaleTimeString()}</span>
          </footer>
        </div>
      </div>
    </Wrapper>
  );
};

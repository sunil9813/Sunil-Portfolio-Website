import PropTypes from "prop-types";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Wrapper } from "@/routes";
import {
  Archive,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  FilePenLine,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Leaf,
  Plane,
  Shirt,
  Trophy,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

/* ==========================================================================
   CATEGORY DATA
   ========================================================================== */

const categoriesData = [
  {
    name: "Technology",
    posts: 4200,
    icon: Cpu,
    status: "published",
    growth: "+12%",
    color: "#507DA4",
    activeColor: "#6A9AC3",
  },
  {
    name: "Lifestyle",
    posts: 3800,
    icon: Leaf,
    status: "published",
    growth: "+8%",
    color: "#4C816E",
    activeColor: "#65A089",
  },
  {
    name: "Business",
    posts: 5200,
    icon: BriefcaseBusiness,
    status: "published",
    growth: "+15%",
    color: "#76659B",
    activeColor: "#9180B7",
  },
  {
    name: "Health",
    posts: 6800,
    icon: HeartPulse,
    status: "published",
    growth: "+21%",
    color: "#9B5B6B",
    activeColor: "#B87584",
  },
  {
    name: "Education",
    posts: 3400,
    icon: GraduationCap,
    status: "draft",
    growth: "-3%",
    color: "#A27B47",
    activeColor: "#BF985F",
  },
  {
    name: "Travel",
    posts: 2900,
    icon: Plane,
    status: "published",
    growth: "+5%",
    color: "#4C7D8C",
    activeColor: "#6299A9",
  },
  {
    name: "Food",
    posts: 4100,
    icon: UtensilsCrossed,
    status: "published",
    growth: "+10%",
    color: "#886A4D",
    activeColor: "#A38465",
  },
  {
    name: "Fashion",
    posts: 2300,
    icon: Shirt,
    status: "archived",
    growth: "-2%",
    color: "#845F82",
    activeColor: "#A0779E",
  },
  {
    name: "Sports",
    posts: 3100,
    icon: Trophy,
    status: "published",
    growth: "+7%",
    color: "#54765F",
    activeColor: "#6D9179",
  },
  {
    name: "Gaming",
    posts: 1900,
    icon: Gamepad2,
    status: "draft",
    growth: "+18%",
    color: "#626F86",
    activeColor: "#7B899F",
  },
];

/* ==========================================================================
   STATUS CONFIGURATION
   ========================================================================== */

const statusConfig = {
  published: {
    label: "Published",
    icon: CheckCircle2,
    className: "border-emerald-400/[0.12] bg-emerald-400/[0.055] text-emerald-200/70",
  },

  draft: {
    label: "Draft",
    icon: FilePenLine,
    className: "border-amber-400/[0.12] bg-amber-400/[0.055] text-amber-200/70",
  },

  archived: {
    label: "Archived",
    icon: Archive,
    className: "border-slate-400/[0.12] bg-slate-400/[0.055] text-slate-300/65",
  },
};

/* ==========================================================================
   CUSTOM TOOLTIP
   ========================================================================== */

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  const CategoryIcon = data.icon;

  const status = statusConfig[data.status] || statusConfig.archived;

  const StatusIcon = status.icon;

  const growthValue = data.growth || "0%";

  const isPositive = growthValue.startsWith("+");

  return (
    <div className="min-w-[230px] overflow-hidden rounded-[18px] border border-white/[0.075] bg-[#0d1118]/95 shadow-[0_24px_60px_rgba(0,0,0,0.52)] backdrop-blur-2xl">
      {/* Tooltip accent */}
      <div
        className="h-[2px] w-full opacity-70"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${data.color},
            transparent
          )`,
        }}
      />

      <div className="p-4">
        {/* Heading */}
        <div className="flex items-center gap-3 border-b border-white/[0.055] pb-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.24)]"
            style={{
              borderColor: `${data.color}35`,
              background: `linear-gradient(
                145deg,
                ${data.color}42,
                rgba(15,18,25,0.78)
              )`,
            }}
          >
            <CategoryIcon size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-white/90">{data.name}</p>

            <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.14em] text-white/25">Category performance</p>
          </div>
        </div>

        {/* Information */}
        <div className="mt-3 space-y-2.5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-medium text-white/35">Total posts</span>

            <span className="text-[14px] font-bold tabular-nums text-white/90">{data.posts.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-medium text-white/35">Growth</span>

            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${isPositive ? "text-emerald-300/75" : "text-rose-300/75"}`}>
              {isPositive ? <TrendingUp size={12} strokeWidth={2} /> : <TrendingDown size={12} strokeWidth={2} />}

              {growthValue}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 border-t border-white/[0.055] pt-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${status.className}`}>
            <StatusIcon size={11} strokeWidth={2} />

            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

/* ==========================================================================
   POPULAR CATEGORIES
   ========================================================================== */

export const PopularCategories = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const [timeRange, setTimeRange] = useState("month");

  const totalPosts = categoriesData.reduce((sum, category) => sum + category.posts, 0);

  const topCategory = [...categoriesData].sort((firstCategory, secondCategory) => secondCategory.posts - firstCategory.posts)[0];

  const averagePosts = Math.round(totalPosts / categoriesData.length);

  return (
    <Wrapper className="group relative my-3 overflow-hidden p-6">
      {/* Restrained internal lighting */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-amber-500/[0.025] blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:bg-amber-500/[0.035]" />

      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.025] blur-[80px] transition-all duration-700 group-hover:scale-110 group-hover:bg-blue-500/[0.035]" />

      {/* Fine inner surface */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_28%,transparent_72%,rgba(255,255,255,0.005))]" />

      {/* Header */}
      <div className="relative z-10 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-300/[0.10] bg-[linear-gradient(145deg,rgba(63,92,126,0.50),rgba(25,31,42,0.90))] text-blue-100/80 shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.065),transparent_48%)]" />

            <BarChart3 className="relative" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Popular Categories</h4>

            <p className="mt-0.5 truncate text-[10px] text-gray-500 dark:text-white/28">Post distribution across categories</p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex self-start rounded-full border border-gray-200 bg-gray-50/70 p-1 dark:border-white/[0.06] dark:bg-black/15 sm:self-auto">
          {["week", "month", "year"].map((range) => {
            const isSelected = timeRange === range;

            return (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-full px-4 py-2 text-[10px] font-semibold capitalize transition-all duration-300 ${
                  isSelected ? "bg-gray-200/80 text-gray-900 shadow-sm dark:bg-white/[0.075] dark:text-white/85" : "text-gray-500 hover:text-gray-900 dark:text-white/28 dark:hover:text-white/55"
                }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart surface */}
      <div className="relative z-10 overflow-hidden rounded-[20px] border border-white/[0.045] bg-black/[0.08] px-2 pt-5">
        {/* Chart guide lines */}
        <div className="pointer-events-none absolute inset-x-5 top-5 bottom-4 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <span key={line} className="block h-px w-full bg-white/[0.025]" />
          ))}
        </div>

        <div className="relative h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoriesData}
              barSize={42}
              margin={{
                top: 8,
                right: 4,
                left: 4,
                bottom: 4,
              }}
            >
              <defs>
                {categoriesData.map((category, index) => (
                  <linearGradient key={category.name} id={`category-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={category.activeColor} stopOpacity="0.96" />

                    <stop offset="55%" stopColor={category.color} stopOpacity="0.84" />

                    <stop offset="100%" stopColor={category.color} stopOpacity="0.52" />
                  </linearGradient>
                ))}
              </defs>

              <XAxis hide />

              <YAxis hide />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "rgba(255,255,255,0.018)",
                  radius: 12,
                }}
                wrapperStyle={{
                  outline: "none",
                }}
              />

              <Bar dataKey="posts" radius={[10, 10, 5, 5]} isAnimationActive animationDuration={750} animationEasing="ease-out">
                {categoriesData.map((category, index) => {
                  const isActive = activeIndex === index;

                  const isDimmed = activeIndex !== null && !isActive;

                  return (
                    <Cell
                      key={category.name}
                      fill={`url(#category-gradient-${index})`}
                      opacity={isDimmed ? 0.38 : isActive ? 1 : 0.82}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className="cursor-default transition-all duration-300"
                      style={{
                        filter: isActive ? `drop-shadow(0 9px 15px ${category.color}35)` : "none",
                      }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category labels */}
      <div className="relative z-10 mt-3 grid grid-cols-5 gap-2 xl:grid-cols-10">
        {categoriesData.map((category, index) => {
          const CategoryIcon = category.icon;

          const isActive = activeIndex === index;

          const isDimmed = activeIndex !== null && !isActive;

          return (
            <button
              key={category.name}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`group/category flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2 transition-all duration-300 ${
                isActive ? "border-white/[0.08] bg-white/[0.045] shadow-[0_8px_20px_rgba(0,0,0,0.16)]" : "border-transparent hover:border-white/[0.045] hover:bg-white/[0.02]"
              } ${isDimmed ? "opacity-35" : "opacity-100"}`}
            >
              <CategoryIcon
                size={14}
                strokeWidth={1.9}
                style={{
                  color: category.activeColor,
                }}
              />

              <span
                className="w-full truncate text-center text-[9px] font-medium"
                style={{
                  color: isActive ? category.activeColor : `${category.color}D9`,
                }}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="relative z-10 mt-5 grid grid-cols-1 gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28 sm:grid-cols-3">
        <div className="flex items-center justify-between sm:justify-start sm:gap-2">
          <span>Total posts</span>

          <span className="font-semibold tabular-nums text-gray-700 dark:text-white/48">{totalPosts.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between sm:justify-center sm:gap-2">
          <span>Average</span>

          <span className="font-semibold tabular-nums text-gray-700 dark:text-white/48">{averagePosts.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end sm:gap-2">
          <span>Top category</span>

          <span className="font-semibold text-gray-700 dark:text-white/48">
            {topCategory.name} · {topCategory.posts.toLocaleString()}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

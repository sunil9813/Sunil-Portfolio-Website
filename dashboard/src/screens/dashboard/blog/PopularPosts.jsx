import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { FaChartBar, FaChartPie, FaTag } from "react-icons/fa";
import { Wrapper } from "@/routes";

/* ==========================================================================
   DATA
   ========================================================================== */

const categoriesData = [
  {
    name: "Technology",
    posts: 42,
    views: 125000,
    likes: 8430,
    comments: 1240,
    engagement: 68,
    growth: 23,
    color: "#5F82A8",
  },
  {
    name: "Health",
    posts: 68,
    views: 168000,
    likes: 12400,
    comments: 2100,
    engagement: 82,
    growth: 21,
    color: "#57917D",
  },
  {
    name: "Business",
    posts: 52,
    views: 152000,
    likes: 9210,
    comments: 1560,
    engagement: 74,
    growth: 32,
    color: "#A17A4B",
  },
  {
    name: "Lifestyle",
    posts: 38,
    views: 98000,
    likes: 7210,
    comments: 980,
    engagement: 65,
    growth: 18,
    color: "#9A6075",
  },
  {
    name: "Education",
    posts: 34,
    views: 84000,
    likes: 6340,
    comments: 870,
    engagement: 59,
    growth: -3,
    color: "#796BA5",
  },
  {
    name: "Travel",
    posts: 29,
    views: 79000,
    likes: 5430,
    comments: 720,
    engagement: 54,
    growth: 5,
    color: "#4F8A84",
  },
];

const tagsData = [
  { name: "react", count: 28, views: 45000, color: "#5F82A8" },
  { name: "javascript", count: 24, views: 38000, color: "#A17A4B" },
  { name: "nextjs", count: 19, views: 32000, color: "#737B86" },
  { name: "typescript", count: 17, views: 29000, color: "#527BA4" },
  { name: "tailwind", count: 15, views: 26000, color: "#4E8999" },
  { name: "css", count: 14, views: 23000, color: "#9A6075" },
  { name: "html", count: 13, views: 21000, color: "#A2644C" },
  { name: "node", count: 12, views: 19000, color: "#658A61" },
  { name: "python", count: 11, views: 18000, color: "#55749B" },
  { name: "mongodb", count: 9, views: 15000, color: "#56875A" },
  { name: "docker", count: 7, views: 12000, color: "#4E7DA6" },
  { name: "aws", count: 6, views: 10000, color: "#A67C48" },
];

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const formatCompactNumber = (value) => {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
};

const metricLabels = {
  posts: "Posts",
  views: "Views",
  likes: "Likes",
};

/* ==========================================================================
   CATEGORY TOOLTIP
   ========================================================================== */

const CategoryTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  return (
    <div className="min-w-[220px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
        }}
      />

      <div className="p-3.5">
        <div className="mb-3 flex items-center gap-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <span
            className="size-2.5 rounded-full"
            style={{
              backgroundColor: data.color,
              boxShadow: `0 0 8px ${data.color}55`,
            }}
          />

          <div>
            <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white/90">{data.name}</h4>

            <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-gray-500 dark:text-white/25">Category performance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TooltipMetric label="Posts" value={formatNumber(data.posts)} />
          <TooltipMetric label="Views" value={formatCompactNumber(data.views)} />
          <TooltipMetric label="Likes" value={formatCompactNumber(data.likes)} />
          <TooltipMetric label="Comments" value={formatNumber(data.comments)} />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-gray-200/60 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <p className="text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Engagement</p>

            <p className={`mt-1 text-[12px] font-bold ${data.engagement >= 70 ? "text-emerald-700 dark:text-emerald-200/70" : "text-amber-700 dark:text-amber-200/70"}`}>{data.engagement}%</p>
          </div>

          <div className="rounded-xl border border-gray-200/60 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <p className="text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">Growth</p>

            <p className={`mt-1 text-[12px] font-bold ${data.growth >= 0 ? "text-emerald-700 dark:text-emerald-200/70" : "text-rose-700 dark:text-rose-200/70"}`}>
              {data.growth >= 0 ? "+" : ""}
              {data.growth}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

CategoryTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
};

/* ==========================================================================
   TAG TOOLTIP
   ========================================================================== */

const TagTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0]?.payload;

  if (!data) {
    return null;
  }

  const progress = Math.min((data.count / 30) * 100, 100);

  return (
    <div className="min-w-[210px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.075] dark:bg-[#10141b]/95 dark:shadow-[0_24px_60px_rgba(0,0,0,0.48)]">
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${data.color}, transparent)`,
        }}
      />

      <div className="p-3.5">
        <div className="mb-3 border-b border-gray-200/70 pb-3 dark:border-white/[0.055]">
          <h4 className="text-[13px] font-semibold text-gray-900 dark:text-white/90">#{data.name}</h4>

          <p className="mt-0.5 text-[9px] uppercase tracking-[0.1em] text-gray-500 dark:text-white/25">Tag performance</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200/60 bg-gray-50/75 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <span className="text-[10px] text-gray-500 dark:text-white/30">Usage count</span>

            <span className="text-[12px] font-bold text-gray-900 dark:text-white/75">{data.count} posts</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200/60 bg-gray-50/75 px-3 py-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
            <span className="text-[10px] text-gray-500 dark:text-white/30">Total views</span>

            <span className="text-[12px] font-bold text-gray-900 dark:text-white/75">{formatCompactNumber(data.views)}</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200/70 dark:bg-black/25">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: data.color,
                boxShadow: `0 0 10px ${data.color}45`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

TagTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.object),
};

/* ==========================================================================
   TOOLTIP METRIC
   ========================================================================== */

const TooltipMetric = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-gray-200/60 bg-gray-50/75 p-2.5 dark:border-white/[0.045] dark:bg-white/[0.022]">
      <p className="text-[8px] uppercase tracking-[0.08em] text-gray-400 dark:text-white/20">{label}</p>

      <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-white/75">{value}</p>
    </div>
  );
};

TooltipMetric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

/* ==========================================================================
   ACTIVE PIE SHAPE
   ========================================================================== */

const renderActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value }) => {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 7}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
        cornerRadius={6}
        style={{
          filter: `drop-shadow(0 8px 14px ${fill}35)`,
        }}
      />

      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 3} outerRadius={innerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.28} />

      <text x={cx} y={cy - 16} textAnchor="middle" className="fill-gray-500 text-[10px] font-medium dark:fill-white/35">
        #{payload.name}
      </text>

      <text x={cx} y={cy + 7} textAnchor="middle" fill={fill} className="text-[18px] font-bold">
        {value}
      </text>

      <text x={cx} y={cy + 25} textAnchor="middle" className="fill-gray-400 text-[8px] dark:fill-white/22">
        posts
      </text>
    </g>
  );
};

/* ==========================================================================
   CATEGORY BAR CHART
   ========================================================================== */

const CategoryBarChart = ({ data, metric }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const sortedData = useMemo(() => {
    return [...data].sort((first, second) => second[metric] - first[metric]);
  }, [data, metric]);

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-indigo-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-violet-500/[0.014] blur-[85px] transition-all duration-700 group-hover:bg-violet-500/[0.022]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/[0.10] bg-[linear-gradient(145deg,rgba(70,64,130,0.58),rgba(44,40,74,0.92))] text-indigo-100/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaChartBar className="relative" size={16} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Categories Performance</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/30">Distribution by {metricLabels[metric]?.toLowerCase()}</p>
          </div>
        </div>

        <span className="rounded-full border border-indigo-300/[0.10] bg-indigo-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-200/65">
          {metricLabels[metric]}
        </span>
      </div>

      {/* Chart */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/45 px-2 py-3 dark:border-white/[0.045] dark:bg-white/[0.018]">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              barSize={22}
              margin={{
                left: 76,
                right: 20,
                top: 10,
                bottom: 10,
              }}
            >
              <XAxis type="number" hide />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={74}
                tick={{
                  fill: "#747D89",
                  fontSize: 10,
                  fontWeight: 500,
                }}
              />

              <Tooltip
                content={<CategoryTooltip />}
                cursor={{
                  fill: "rgba(148,163,184,0.025)",
                  radius: 8,
                }}
                wrapperStyle={{ outline: "none" }}
              />

              <Bar dataKey={metric} radius={[0, 8, 8, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} animationDuration={700}>
                {sortedData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={activeIndex === null ? 0.78 : activeIndex === index ? 1 : 0.32}
                    style={{
                      filter: activeIndex === index ? `drop-shadow(0 6px 10px ${entry.color}35)` : "none",
                      transition: "opacity 200ms ease",
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Total categories: <strong className="font-semibold text-gray-700 dark:text-white/50">{data.length}</strong>
        </span>

        <span>
          Top:{" "}
          <strong className="font-semibold text-indigo-700 dark:text-indigo-200/65">
            {sortedData[0]?.name} ({formatNumber(sortedData[0]?.[metric])})
          </strong>
        </span>
      </div>
    </Wrapper>
  );
};

CategoryBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  metric: PropTypes.oneOf(["posts", "views", "likes"]).isRequired,
};

/* ==========================================================================
   TAG CHART
   ========================================================================== */

const TagBarChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartType, setChartType] = useState("bar");
  const [activePieIndex, setActivePieIndex] = useState(0);

  const sortedData = useMemo(() => {
    return [...data].sort((first, second) => second.count - first.count).slice(0, 10);
  }, [data]);

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-amber-500/[0.016] blur-[85px] transition-all duration-700 group-hover:bg-amber-500/[0.024]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-orange-500/[0.012] blur-[85px] transition-all duration-700 group-hover:bg-orange-500/[0.020]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-300/[0.10] bg-[linear-gradient(145deg,rgba(126,86,39,0.60),rgba(67,47,27,0.92))] text-amber-100/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

            <FaTag className="relative" size={16} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Popular Tags</h4>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/30">Top 10 tags by usage</p>
          </div>
        </div>

        {/* Chart type toggle */}
        <div className="flex w-fit rounded-full border border-gray-200/70 bg-gray-50/45 p-1 dark:border-white/[0.05] dark:bg-white/[0.016]">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold transition-all ${
              chartType === "bar"
                ? "bg-amber-500/10 text-amber-700 shadow-sm dark:bg-amber-300/[0.08] dark:text-amber-200/75"
                : "text-gray-500 hover:text-gray-800 dark:text-white/27 dark:hover:text-white/55"
            }`}
          >
            <FaChartBar size={10} />
            Bar
          </button>

          <button
            type="button"
            onClick={() => setChartType("pie")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold transition-all ${
              chartType === "pie"
                ? "bg-amber-500/10 text-amber-700 shadow-sm dark:bg-amber-300/[0.08] dark:text-amber-200/75"
                : "text-gray-500 hover:text-gray-800 dark:text-white/27 dark:hover:text-white/55"
            }`}
          >
            <FaChartPie size={10} />
            Pie
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/45 px-2 py-3 dark:border-white/[0.045] dark:bg-white/[0.018]">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={sortedData}
                layout="vertical"
                barSize={17}
                margin={{
                  left: 78,
                  right: 20,
                  top: 8,
                  bottom: 8,
                }}
              >
                <XAxis type="number" hide />

                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={75}
                  tick={{
                    fill: "#747D89",
                    fontSize: 9,
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) => `#${value}`}
                />

                <Tooltip
                  content={<TagTooltip />}
                  cursor={{
                    fill: "rgba(148,163,184,0.025)",
                    radius: 8,
                  }}
                  wrapperStyle={{ outline: "none" }}
                />

                <Bar dataKey="count" radius={[0, 8, 8, 0]} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} animationDuration={700}>
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={activeIndex === null ? 0.78 : activeIndex === index ? 1 : 0.32}
                      style={{
                        filter: activeIndex === index ? `drop-shadow(0 6px 10px ${entry.color}35)` : "none",
                        transition: "opacity 200ms ease",
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={98}
                  paddingAngle={2}
                  cornerRadius={5}
                  dataKey="count"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={1}
                  animationDuration={700}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} opacity={activePieIndex === index ? 1 : 0.65} />
                  ))}
                </Pie>

                <Tooltip content={<TagTooltip />} wrapperStyle={{ outline: "none" }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex flex-col gap-2 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Total tags: <strong className="font-semibold text-gray-700 dark:text-white/50">{data.length}</strong>
        </span>

        <span>
          Most used:{" "}
          <strong className="font-semibold text-amber-700 dark:text-amber-200/65">
            #{sortedData[0]?.name} ({sortedData[0]?.count})
          </strong>
        </span>
      </div>
    </Wrapper>
  );
};

TagBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export const CategoryAndTagCharts = () => {
  const [categoryMetric] = useState("posts");

  return (
    <div className="my-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
      <CategoryBarChart data={categoriesData} metric={categoryMetric} />

      <TagBarChart data={tagsData} />
    </div>
  );
};

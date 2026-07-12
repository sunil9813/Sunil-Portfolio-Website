import PropTypes from "prop-types";
import { FaArchive, FaArrowDown, FaArrowUp, FaCheckCircle, FaClock, FaEllipsisH, FaFileAlt } from "react-icons/fa";
import { Wrapper } from "@/routes";

const colorSchemes = {
  blue: {
    gradient: "from-[#34597f] via-[#3f527e] to-[#293e5d]",
    accent: "bg-[#5f84a9]",
    light: "bg-blue-500/[0.06] dark:bg-blue-300/[0.045]",
    text: "text-blue-700 dark:text-blue-200/80",
    border: "border-blue-300/25 dark:border-blue-300/[0.10]",
    shadow: "shadow-blue-950/30",
    glow: "bg-blue-500/[0.04]",
    topAccent: "via-blue-300/30",
    chart: "#6C8FB2",
  },

  emerald: {
    gradient: "from-[#34745f] via-[#356b5b] to-[#254b41]",
    accent: "bg-[#57917d]",
    light: "bg-emerald-500/[0.06] dark:bg-emerald-300/[0.045]",
    text: "text-emerald-700 dark:text-emerald-200/80",
    border: "border-emerald-300/25 dark:border-emerald-300/[0.10]",
    shadow: "shadow-emerald-950/30",
    glow: "bg-emerald-500/[0.04]",
    topAccent: "via-emerald-300/30",
    chart: "#60A088",
  },

  amber: {
    gradient: "from-[#866135] via-[#765538] to-[#4d3b29]",
    accent: "bg-[#a47b48]",
    light: "bg-amber-500/[0.06] dark:bg-amber-300/[0.045]",
    text: "text-amber-700 dark:text-amber-200/80",
    border: "border-amber-300/25 dark:border-amber-300/[0.10]",
    shadow: "shadow-amber-950/30",
    glow: "bg-amber-500/[0.04]",
    topAccent: "via-amber-300/30",
    chart: "#B08858",
  },

  purple: {
    gradient: "from-[#5d5287] via-[#62517f] to-[#403958]",
    accent: "bg-[#7a6ca4]",
    light: "bg-violet-500/[0.06] dark:bg-violet-300/[0.045]",
    text: "text-violet-700 dark:text-violet-200/80",
    border: "border-violet-300/25 dark:border-violet-300/[0.10]",
    shadow: "shadow-violet-950/30",
    glow: "bg-violet-500/[0.04]",
    topAccent: "via-violet-300/30",
    chart: "#897BB3",
  },
};

const calculatePercentage = (value, total) => {
  const numericValue = Number(value) || 0;
  const numericTotal = Number(total) || 0;

  if (numericTotal <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (numericValue / numericTotal) * 100));
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const Sparkline = ({ color, trend = "up" }) => {
  const points = trend === "up" ? [10, 25, 15, 35, 25, 45, 40] : [40, 35, 45, 25, 30, 15, 20];

  const maximum = Math.max(...points);
  const minimum = Math.min(...points);
  const range = maximum - minimum || 1;
  const height = 30;
  const width = 60;

  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width;
    const y = height - ((point - minimum) / range) * height;

    return { x, y };
  });

  const normalizedPoints = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");

  const lastPoint = coordinates[coordinates.length - 1];
  const gradientId = `sparkline-${trend}-${color.replace("#", "")}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible opacity-90" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      <polyline points={normalizedPoints} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <circle cx={lastPoint.x} cy={lastPoint.y} r="3" fill={color} stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
    </svg>
  );
};

Sparkline.propTypes = {
  color: PropTypes.string.isRequired,
  trend: PropTypes.oneOf(["up", "down"]),
};

const BlogStatCard = ({ card, totalPosts }) => {
  const scheme = colorSchemes[card.color];
  const Icon = card.icon;
  const isPositive = card.trend === "up";
  const completion = calculatePercentage(card.value, totalPosts);

  return (
    <Wrapper className="group relative h-full overflow-hidden">
      {/* Wrapper background remains unchanged */}

      <div className="relative z-10 flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl bg-white/60 p-5 backdrop-blur-xl dark:bg-white/[0.018]">
        {/* Subtle colour wash */}
        <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${scheme.gradient} opacity-[0.035] dark:opacity-[0.055]`} />

        {/* Muted glows */}
        <div className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full ${scheme.glow} blur-[65px] transition-transform duration-700 group-hover:scale-110`} />

        <div className={`pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full ${scheme.glow} opacity-50 blur-[65px] transition-transform duration-700 group-hover:scale-110`} />

        {/* Top accent */}
        <div className={`pointer-events-none absolute left-7 right-7 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${scheme.topAccent}`} />

        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/[0.025] dark:ring-white/[0.025]" />

        {/* Header — equal height */}
        <div className="relative flex min-h-[58px] items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div
                className={`relative flex size-12 items-center justify-center overflow-hidden rounded-2xl border ${scheme.border} bg-gradient-to-br ${scheme.gradient} text-white/90 shadow-xl ${scheme.shadow}`}
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.08]" />

                <Icon className="relative z-10" size={19} />
              </div>

              <div className={`pointer-events-none absolute -inset-1 -z-10 rounded-2xl ${scheme.accent} opacity-15 blur-md`} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-white/25">{card.metric}</p>

              <h4 className="mt-1 truncate text-[15px] font-bold tracking-[-0.02em] text-gray-900 dark:text-white">{card.title}</h4>
            </div>
          </div>

          <button
            type="button"
            aria-label={`More options for ${card.title}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100/70 hover:text-gray-700 dark:text-white/22 dark:hover:border-white/[0.06] dark:hover:bg-white/[0.025] dark:hover:text-white/55"
          >
            <FaEllipsisH size={13} />
          </button>
        </div>

        {/* Value section — equal height */}
        <div className="relative mt-5 flex min-h-[112px] items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums ${scheme.text}`}>{formatNumber(card.value)}</span>

              <span className="shrink-0 text-[10px] font-medium text-gray-500 dark:text-white/25">posts</span>
            </div>

            {/* Fixed-height status row prevents card height differences */}
            <div className="mt-3 flex min-h-[40px] items-start gap-2">
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-semibold ${scheme.light} ${scheme.text} ${scheme.border}`}>
                {isPositive ? <FaArrowUp size={8} /> : <FaArrowDown size={8} />}

                {card.change}
              </span>

              <span className="line-clamp-2 min-w-0 text-[9px] leading-4 text-gray-500 dark:text-white/27">{card.subtitle}</span>
            </div>
          </div>

          <div className="mb-1 flex h-[48px] w-[82px] shrink-0 items-center justify-center rounded-xl border border-gray-200/70 bg-gray-50/55 dark:border-white/[0.045] dark:bg-black/[0.08]">
            <Sparkline color={scheme.chart} trend={card.trend} />
          </div>
        </div>

        {/* Bottom stats remain aligned on every card */}
        <div className="relative mt-auto grid min-h-[76px] grid-cols-2 gap-4 border-t border-gray-200/80 pt-4 dark:border-white/[0.05]">
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[9px] font-medium text-gray-500 dark:text-white/27">Completion</p>

              <span className={`text-[10px] font-semibold tabular-nums ${scheme.text}`}>{Math.round(completion)}%</span>
            </div>

            <div
              role="progressbar"
              aria-label={`${card.title} completion`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(completion)}
              className="h-1.5 overflow-hidden rounded-full border border-gray-200/50 bg-gray-200/70 dark:border-white/[0.025] dark:bg-black/25"
            >
              <div
                className={`h-full rounded-full ${scheme.accent} transition-all duration-700`}
                style={{
                  width: `${completion}%`,
                  boxShadow: `0 0 10px ${scheme.chart}35`,
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-[9px] font-medium text-gray-500 dark:text-white/27">Trend</p>

            <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-semibold ${isPositive ? "text-emerald-600 dark:text-emerald-200/65" : "text-rose-600 dark:text-rose-200/65"}`}>
              {isPositive ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}

              <span className="tabular-nums">{card.change}</span>
            </div>
          </div>
        </div>

        {/* Decorative particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          {[0, 1, 2].map((particle) => (
            <div
              key={particle}
              className={`absolute size-1 rounded-full ${scheme.accent} opacity-15`}
              style={{
                top: `${20 + particle * 30}%`,
                left: `${82 + (particle % 2) * 8}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`pointer-events-none absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r ${scheme.gradient} opacity-[0.05] blur-xl transition-opacity duration-500 group-hover:opacity-[0.08]`}
      />
    </Wrapper>
  );
};

BlogStatCard.propTypes = {
  card: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    subtitle: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.oneOf(["blue", "emerald", "amber", "purple"]).isRequired,
    metric: PropTypes.string.isRequired,
    change: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(["up", "down"]).isRequired,
  }).isRequired,
  totalPosts: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export const BlogStatsCards = ({ totalPosts, publishedPosts, draftPosts, scheduledPosts, viewsGrowth }) => {
  const numericViewsGrowth = Number(viewsGrowth) || 0;

  const cards = [
    {
      title: "Total Posts",
      value: totalPosts,
      subtitle: "All time posts",
      icon: FaFileAlt,
      color: "blue",
      metric: "Total content",
      change: "+12.5%",
      trend: "up",
    },
    {
      title: "Published",
      value: publishedPosts,
      subtitle: `${numericViewsGrowth >= 0 ? "+" : ""}${numericViewsGrowth}% from last month`,
      icon: FaCheckCircle,
      color: "emerald",
      metric: "Live now",
      change: `${numericViewsGrowth >= 0 ? "+" : ""}${numericViewsGrowth}%`,
      trend: numericViewsGrowth >= 0 ? "up" : "down",
    },
    {
      title: "Drafts",
      value: draftPosts,
      subtitle: "Need review",
      icon: FaClock,
      color: "amber",
      metric: "In progress",
      change: "-4.2%",
      trend: "down",
    },
    {
      title: "Scheduled",
      value: scheduledPosts,
      subtitle: "Ready to publish",
      icon: FaArchive,
      color: "purple",
      metric: "Upcoming",
      change: "+2.1%",
      trend: "up",
    },
  ];

  return (
    <div className="mb-4 grid auto-rows-fr grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <BlogStatCard key={card.title} card={card} totalPosts={totalPosts} />
      ))}
    </div>
  );
};

BlogStatsCards.propTypes = {
  totalPosts: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  publishedPosts: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  draftPosts: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scheduledPosts: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  viewsGrowth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

BlogStatsCards.defaultProps = {
  totalPosts: 0,
  publishedPosts: 0,
  draftPosts: 0,
  scheduledPosts: 0,
  viewsGrowth: 0,
};

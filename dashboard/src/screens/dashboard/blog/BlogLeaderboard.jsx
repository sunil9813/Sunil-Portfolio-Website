import { Wrapper } from "@/routes";
import { FaComment, FaCrown, FaEye, FaHeart, FaTrophy } from "react-icons/fa";
import { GiMedal } from "react-icons/gi";

const fallbackTopPosts = [
  {
    rank: 1,
    title: "10 React Tips Every Developer Should Know",
    views: 12500,
    likes: 843,
    comments: 124,
    author: "John Doe",
  },
  {
    rank: 2,
    title: "JavaScript Under The Hood",
    views: 10800,
    likes: 721,
    comments: 98,
    author: "Jane Smith",
  },
  {
    rank: 3,
    title: "CSS Grid vs Flexbox",
    views: 9200,
    likes: 654,
    comments: 87,
    author: "Mike Johnson",
  },
  {
    rank: 4,
    title: "Next.js 14 New Features",
    views: 8700,
    likes: 592,
    comments: 76,
    author: "Sarah Wilson",
  },
  {
    rank: 5,
    title: "TypeScript for Beginners",
    views: 7600,
    likes: 487,
    comments: 65,
    author: "David Lee",
  },
];

const getRankStyle = (rank) => {
  if (rank === 1) {
    return `
      border-amber-300/30
      bg-[linear-gradient(145deg,#9a6e28,#705020)]
      text-amber-50
      shadow-[0_8px_22px_rgba(180,125,35,0.18)]
    `;
  }

  if (rank === 2) {
    return `
      border-slate-300/25
      bg-[linear-gradient(145deg,#687282,#464e5d)]
      text-slate-100
      shadow-[0_8px_22px_rgba(100,116,139,0.16)]
    `;
  }

  if (rank === 3) {
    return `
      border-orange-300/25
      bg-[linear-gradient(145deg,#8a572f,#603b25)]
      text-orange-50
      shadow-[0_8px_22px_rgba(146,86,42,0.16)]
    `;
  }

  return `
    border-gray-200/80
    bg-gray-100/80
    text-gray-600
    dark:border-white/[0.055]
    dark:bg-white/[0.035]
    dark:text-white/45
  `;
};

const getRankIcon = (rank) => {
  if (rank === 1) {
    return <FaCrown size={13} />;
  }

  if (rank <= 3) {
    return <GiMedal size={14} />;
  }

  return <span className="text-[11px] font-bold tabular-nums">#{rank}</span>;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(value);
};

export const BlogLeaderboard = ({ posts }) => {
  const topPosts = posts?.length ? posts : fallbackTopPosts;

  return (
    <Wrapper className="group relative overflow-hidden p-6">
      {/* Wrapper background remains unchanged */}

      {/* Subtle decorative lighting */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-cyan-500/[0.016] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-cyan-500/[0.024]" />

      <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-rose-500/[0.014] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-rose-500/[0.022]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.012),transparent_32%,transparent_74%,rgba(255,255,255,0.003))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center gap-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rose-300/[0.10] bg-[linear-gradient(145deg,rgba(126,57,86,0.62),rgba(71,39,59,0.94))] text-rose-100/85 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

          <FaTrophy className="relative z-10" size={17} />
        </div>

        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Top Performing Posts</h4>

          <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/30">Highest engagement this month</p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="relative z-10 space-y-2.5">
        {topPosts.map((post, index) => (
          <article
            key={post._id || post.rank || post.slug || index}
            className="group/item relative flex min-h-[84px] items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300/25 hover:bg-white/80 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] dark:border-white/[0.045] dark:bg-white/[0.018] dark:hover:border-rose-300/[0.10] dark:hover:bg-white/[0.03] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.018),transparent_45%,transparent)]" />

            {/* Rank badge */}
            <div className="relative z-10 flex w-14 shrink-0 justify-center">
              <div className={`relative flex size-11 items-center justify-center overflow-hidden rounded-full border ${getRankStyle(post.rank || index + 1)}`}>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] to-transparent" />

                <span className="relative z-10">{getRankIcon(post.rank || index + 1)}</span>
              </div>
            </div>

            {/* Post information */}
            <div className="relative z-10 min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold tracking-[-0.01em] text-gray-900 transition-colors duration-200 group-hover/item:text-rose-700 dark:text-white/75 dark:group-hover/item:text-rose-200/75">
                {post.title}
              </p>

              <p className="mt-1 text-[9px] text-gray-400 dark:text-white/25">
                by <span className="font-medium text-gray-500 dark:text-white/38">{post.author || "Gorkcoder"}</span>
              </p>

              {/* Statistics */}
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-gray-500 dark:text-white/30">
                <span className="inline-flex items-center gap-1.5">
                  <FaEye className="text-blue-600 dark:text-blue-200/60" size={9} />

                  <span className="tabular-nums">{formatNumber(post.views ?? post.numOfViews)}</span>
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <FaHeart className="text-rose-600 dark:text-rose-200/60" size={9} />

                  <span className="tabular-nums">{formatNumber(Array.isArray(post.likes) ? post.likes.length : post.likes)}</span>
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <FaComment className="text-emerald-600 dark:text-emerald-200/60" size={9} />

                  <span className="tabular-nums">{formatNumber(post.comments ?? post.analytics?.shares)}</span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Wrapper>
  );
};

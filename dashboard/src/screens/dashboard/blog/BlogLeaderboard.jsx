import { IconCircle, Wrapper } from "@/utils/Router";
import { FaTrophy, FaEye, FaHeart, FaComment, FaCrown } from "react-icons/fa";
import { GiMedal } from "react-icons/gi";

const topPosts = [
  { rank: 1, title: "10 React Tips Every Developer Should Know", views: 12500, likes: 843, comments: 124, author: "John Doe" },
  { rank: 2, title: "JavaScript Under The Hood", views: 10800, likes: 721, comments: 98, author: "Jane Smith" },
  { rank: 3, title: "CSS Grid vs Flexbox", views: 9200, likes: 654, comments: 87, author: "Mike Johnson" },
  { rank: 4, title: "Next.js 14 New Features", views: 8700, likes: 592, comments: 76, author: "Sarah Wilson" },
  { rank: 5, title: "TypeScript for Beginners", views: 7600, likes: 487, comments: 65, author: "David Lee" },
];

const getRankStyle = (rank) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg";
  if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-md";
  if (rank === 3) return "bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-md";
  return "bg-gray-100 dark:bg-gray-800 text-gray-500";
};

const getRankIcon = (rank) => {
  if (rank === 1) return <FaCrown className="text-white" size={12} />;
  if (rank <= 3) return <GiMedal className="text-white" size={12} />;
  return <span className="text-xs font-bold">#{rank}</span>;
};

export const BlogLeaderboard = () => {
  return (
    <Wrapper className="p-6 relative overflow-hidden group">
      {/* Floating Glow Background - updated colors */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#09637E]/20 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-[#F075AE]/20 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="size-10 bg-pink-500 rounded-xl flexC text-white">
          <FaTrophy size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold textColor">Top Performing Posts</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Highest engagement this month</p>
        </div>
      </div>

      {/* List */}
      {topPosts.map((post) => (
        <div key={post.rank} className="flex items-center mb-3 gap-3 p-3 rounded-xl transition-all duration-300 highlightbg">
          {/* Rank Badge */}

          <div className="w-14">
            <div className={`size-12 flexC rounded-full text-lg font-bold ${getRankStyle(post.rank)}`}>{getRankIcon(post.rank)}</div>
          </div>

          {/* Content */}
          <div className="w-full">
            <p className="text-xs font-semibold truncate group-hover:text-indigo-500 transition-colors">{post.title}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">by {post.author}</p>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <FaEye size={9} className="text-indigo-500" />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <FaHeart size={9} className="text-pink-500" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <FaComment size={9} className="text-green-500" />
                {post.comments}
              </span>
            </div>
          </div>
        </div>
      ))}
    </Wrapper>
  );
};

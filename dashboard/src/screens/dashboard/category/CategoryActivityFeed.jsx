import { Wrapper } from "@/utils/Router";
import { FaHistory, FaPlusCircle, FaSync, FaTag, FaArchive, FaEdit, FaClock, FaFilter, FaSearch, FaCheck, FaCircle } from "react-icons/fa";
import { useState, useEffect } from "react";

// Enhanced activity data with more variety
const activities = [
  {
    id: 1,
    type: "create",
    category: "Technology",
    categoryIcon: "💻",
    user: "John Doe",
    userAvatar: "https://i.pravatar.cc/32?u=1",
    time: "5 min ago",
    timestamp: new Date(Date.now() - 5 * 60000),
    icon: <FaPlusCircle className="text-green-500" size={16} />,
    status: "success",
    details: "New category created with 5 posts",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    type: "update",
    category: "Health",
    categoryIcon: "🏥",
    user: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/32?u=2",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60000),
    icon: <FaSync className="text-blue-500" size={16} />,
    status: "info",
    details: "Category metadata updated",
    priority: "medium",
    read: false,
  },
  {
    id: 3,
    type: "publish",
    category: "Business",
    categoryIcon: "📊",
    user: "Mike Johnson",
    userAvatar: "https://i.pravatar.cc/32?u=3",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 180 * 60000),
    icon: <FaTag className="text-purple-500" size={16} />,
    status: "purple",
    details: "12 posts published",
    priority: "high",
    read: true,
  },
  {
    id: 4,
    type: "draft",
    category: "Gaming",
    categoryIcon: "🎮",
    user: "Sarah Wilson",
    userAvatar: "https://i.pravatar.cc/32?u=4",
    time: "5 hours ago",
    timestamp: new Date(Date.now() - 300 * 60000),
    icon: <FaHistory className="text-amber-500" size={16} />,
    status: "warning",
    details: "Saved as draft",
    priority: "low",
    read: false,
  },
  {
    id: 5,
    type: "archive",
    category: "Fashion",
    categoryIcon: "👗",
    user: "Emily Brown",
    userAvatar: "https://i.pravatar.cc/32?u=5",
    time: "1 day ago",
    timestamp: new Date(Date.now() - 86400000),
    icon: <FaArchive className="text-gray-500" size={16} />,
    status: "default",
    details: "Category archived",
    priority: "low",
    read: true,
  },
  {
    id: 6,
    type: "edit",
    category: "Education",
    categoryIcon: "📚",
    user: "David Lee",
    userAvatar: "https://i.pravatar.cc/32?u=6",
    time: "2 days ago",
    timestamp: new Date(Date.now() - 172800000),
    icon: <FaEdit className="text-indigo-500" size={16} />,
    status: "indigo",
    details: "Content revised",
    priority: "medium",
    read: true,
  },
];

// Filter options with icons
const filterOptions = [
  { value: "All", label: "All Activity", icon: <FaHistory size={12} /> },
  { value: "Create", label: "Created", icon: <FaPlusCircle size={12} /> },
  { value: "Update", label: "Updated", icon: <FaSync size={12} /> },
  { value: "Publish", label: "Published", icon: <FaTag size={12} /> },
  { value: "Draft", label: "Drafts", icon: <FaHistory size={12} /> },
  { value: "Archive", label: "Archived", icon: <FaArchive size={12} /> },
  { value: "Edit", label: "Edited", icon: <FaEdit size={12} /> },
];

// Priority colors (simplified to just text colors, not bg)
const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-green-500",
};

export const CategoryActivityFeed = () => {
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activitiesList, setActivitiesList] = useState(activities);
  const [unreadCount, setUnreadCount] = useState(activities.filter((a) => !a.read).length);

  // Filter activities based on selection and search
  const filteredActivities = activitiesList
    .filter((a) => (filter === "All" ? true : a.type.toLowerCase() === filter.toLowerCase()))
    .filter((a) => a.category.toLowerCase().includes(searchTerm.toLowerCase()) || a.user.toLowerCase().includes(searchTerm.toLowerCase()));

  // Display only 4 items initially, or all if showAll is true
  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 4);

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}w`;
  };

  // Mark as read
  const markAsRead = (id) => {
    setActivitiesList((prev) => prev.map((act) => (act.id === id ? { ...act, read: true } : act)));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setActivitiesList((prev) => prev.map((act) => ({ ...act, read: true })));
  };

  // Update unread count
  useEffect(() => {
    setUnreadCount(activitiesList.filter((a) => !a.read).length);
  }, [activitiesList]);

  return (
    <Wrapper className="p-6 relative overflow-hidden group my-3">
      {/* Floating glow backgrounds – cyan and indigo */}
      <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />
      <div className="absolute -top-20 -left-20 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-all duration-700" />

      {/* Header with icon and actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-10 bg-gradient-to-br from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <FaHistory size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Activity Feed</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Real-time updates</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark all as read button – appears only if unread > 0 */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="size-8 rounded-full bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors flex items-center justify-center"
              title="Mark all as read"
            >
              <FaCheck size={12} />
            </button>
          )}

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`size-8 rounded-full flex items-center justify-center transition-colors ${
              showFilters ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FaFilter size={12} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Filter Chips */}
      {showFilters && (
        <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all ${
                filter === option.value
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-500/50"
              }`}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
        {displayedActivities.map((activity) => {
          const timeAgo = formatRelativeTime(activity.timestamp);

          return (
            <div
              key={activity.id}
              className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                activity.read ? "bg-transparent" : "bg-indigo-500/5 dark:bg-indigo-500/10"
              } hover:bg-gray-100 dark:hover:bg-gray-800/50`}
              onClick={() => markAsRead(activity.id)}
            >
              {/* Unread dot indicator */}
              {!activity.read && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"></span>}

              {/* Avatar */}
              <img src={activity.userAvatar} alt={activity.user} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{activity.category}</span>
                  <span className={`text-[9px] font-medium ${priorityColors[activity.priority]}`}>{activity.priority}</span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">{activity.details}</p>

                <div className="flex items-center gap-2 text-[9px] text-gray-500">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{activity.user}</span>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className="flex items-center gap-1">
                    <FaClock size={7} className="text-gray-400" />
                    <span>{timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {displayedActivities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <FaHistory className="text-gray-400" size={24} />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">No activities found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700/50 flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Live</span>
          </div>
          <span>•</span>
          <span>{filteredActivities.length} total</span>
        </div>

        {filteredActivities.length > 4 && (
          <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
            <span>{showAll ? "Show less" : `View all (${filteredActivities.length})`}</span>
            <span className="text-xs">{showAll ? "↑" : "→"}</span>
          </button>
        )}
      </div>
    </Wrapper>
  );
};

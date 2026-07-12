import { useMemo, useState } from "react";
import {
  Archive,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock3,
  FilePenLine,
  Filter,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  History,
  Laptop,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shirt,
  Tag,
  X,
} from "lucide-react";
import { Wrapper } from "@/routes";

/* ==========================================================================
   ACTIVITY DATA
   ========================================================================== */

const initialActivities = [
  {
    id: 1,
    type: "create",
    category: "Technology",
    categoryIcon: Laptop,
    user: "John Doe",
    userAvatar: "https://i.pravatar.cc/64?u=1",
    timestamp: new Date(Date.now() - 5 * 60000),
    actionIcon: Plus,
    details: "New category created with 5 posts",
    priority: "high",
    read: false,
  },

  {
    id: 2,
    type: "update",
    category: "Health",
    categoryIcon: HeartPulse,
    user: "Jane Smith",
    userAvatar: "https://i.pravatar.cc/64?u=2",
    timestamp: new Date(Date.now() - 60 * 60000),
    actionIcon: RefreshCw,
    details: "Category metadata updated",
    priority: "medium",
    read: false,
  },

  {
    id: 3,
    type: "publish",
    category: "Business",
    categoryIcon: BriefcaseBusiness,
    user: "Mike Johnson",
    userAvatar: "https://i.pravatar.cc/64?u=3",
    timestamp: new Date(Date.now() - 180 * 60000),
    actionIcon: Tag,
    details: "12 posts published",
    priority: "high",
    read: true,
  },

  {
    id: 4,
    type: "draft",
    category: "Gaming",
    categoryIcon: Gamepad2,
    user: "Sarah Wilson",
    userAvatar: "https://i.pravatar.cc/64?u=4",
    timestamp: new Date(Date.now() - 300 * 60000),
    actionIcon: History,
    details: "Saved as draft",
    priority: "low",
    read: false,
  },

  {
    id: 5,
    type: "archive",
    category: "Fashion",
    categoryIcon: Shirt,
    user: "Emily Brown",
    userAvatar: "https://i.pravatar.cc/64?u=5",
    timestamp: new Date(Date.now() - 86400000),
    actionIcon: Archive,
    details: "Category archived",
    priority: "low",
    read: true,
  },

  {
    id: 6,
    type: "edit",
    category: "Education",
    categoryIcon: GraduationCap,
    user: "David Lee",
    userAvatar: "https://i.pravatar.cc/64?u=6",
    timestamp: new Date(Date.now() - 172800000),
    actionIcon: Pencil,
    details: "Content revised",
    priority: "medium",
    read: true,
  },
];

/* ==========================================================================
   FILTER OPTIONS
   ========================================================================== */

const filterOptions = [
  {
    value: "all",
    label: "All activity",
    icon: History,
  },
  {
    value: "create",
    label: "Created",
    icon: Plus,
  },
  {
    value: "update",
    label: "Updated",
    icon: RefreshCw,
  },
  {
    value: "publish",
    label: "Published",
    icon: Tag,
  },
  {
    value: "draft",
    label: "Drafts",
    icon: FilePenLine,
  },
  {
    value: "archive",
    label: "Archived",
    icon: Archive,
  },
  {
    value: "edit",
    label: "Edited",
    icon: Pencil,
  },
];

/* ==========================================================================
   COLOUR CONFIGURATION
   ========================================================================== */

const activityTypeStyles = {
  create: {
    icon: "text-emerald-200/80",
    iconBorder: "border-emerald-300/[0.11]",
    iconBackground: "bg-emerald-400/[0.055]",
    accent: "bg-emerald-400/70",
  },

  update: {
    icon: "text-cyan-200/80",
    iconBorder: "border-cyan-300/[0.11]",
    iconBackground: "bg-cyan-400/[0.055]",
    accent: "bg-cyan-400/70",
  },

  publish: {
    icon: "text-violet-200/80",
    iconBorder: "border-violet-300/[0.11]",
    iconBackground: "bg-violet-400/[0.055]",
    accent: "bg-violet-400/70",
  },

  draft: {
    icon: "text-amber-200/80",
    iconBorder: "border-amber-300/[0.11]",
    iconBackground: "bg-amber-400/[0.055]",
    accent: "bg-amber-400/70",
  },

  archive: {
    icon: "text-slate-300/75",
    iconBorder: "border-slate-300/[0.10]",
    iconBackground: "bg-slate-400/[0.05]",
    accent: "bg-slate-400/65",
  },

  edit: {
    icon: "text-indigo-200/80",
    iconBorder: "border-indigo-300/[0.11]",
    iconBackground: "bg-indigo-400/[0.055]",
    accent: "bg-indigo-400/70",
  },
};

const priorityStyles = {
  high: {
    label: "High",
    className: "border-rose-300/[0.10] bg-rose-400/[0.045] text-rose-200/70",
    dot: "bg-rose-400/80",
  },

  medium: {
    label: "Medium",
    className: "border-amber-300/[0.10] bg-amber-400/[0.045] text-amber-200/70",
    dot: "bg-amber-400/80",
  },

  low: {
    label: "Low",
    className: "border-emerald-300/[0.10] bg-emerald-400/[0.045] text-emerald-200/70",
    dot: "bg-emerald-400/80",
  },
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const difference = now.getTime() - timestamp.getTime();

  const minutes = Math.floor(difference / 60000);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return `${Math.floor(days / 7)}w ago`;
};

/* ==========================================================================
   CATEGORY ACTIVITY FEED
   ========================================================================== */

export const CategoryActivityFeed = () => {
  const [filter, setFilter] = useState("all");

  const [showAll, setShowAll] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [activitiesList, setActivitiesList] = useState(initialActivities);

  const unreadCount = useMemo(() => activitiesList.filter((activity) => !activity.read).length, [activitiesList]);

  const filteredActivities = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase();

    return activitiesList.filter((activity) => {
      const matchesFilter = filter === "all" || activity.type === filter;

      const matchesSearch =
        normalisedSearch === "" ||
        activity.category.toLowerCase().includes(normalisedSearch) ||
        activity.user.toLowerCase().includes(normalisedSearch) ||
        activity.details.toLowerCase().includes(normalisedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activitiesList, filter, searchTerm]);

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 4);

  const markAsRead = (id) => {
    setActivitiesList((previousActivities) =>
      previousActivities.map((activity) =>
        activity.id === id
          ? {
              ...activity,
              read: true,
            }
          : activity,
      ),
    );
  };

  const markAllAsRead = () => {
    setActivitiesList((previousActivities) =>
      previousActivities.map((activity) => ({
        ...activity,
        read: true,
      })),
    );
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Wrapper className="group relative my-3 overflow-hidden p-6">
      {/* Restrained internal lighting */}
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-cyan-500/[0.022] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-cyan-500/[0.032]" />

      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.018] blur-[85px] transition-all duration-700 group-hover:scale-110 group-hover:bg-indigo-500/[0.028]" />

      {/* Subtle inner glass surface */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.016),transparent_30%,transparent_72%,rgba(255,255,255,0.004))]" />

      {/* Header */}
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/[0.10] bg-[linear-gradient(145deg,rgba(35,101,116,0.36),rgba(30,31,62,0.88))] text-cyan-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

            <History className="relative z-10" size={18} strokeWidth={1.9} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Activity Feed</h4>

              {unreadCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-indigo-300/[0.11] bg-indigo-400/[0.06] px-1.5 text-[9px] font-bold text-indigo-200/75">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/28">Real-time category updates</p>
          </div>
        </div>

        {/* Header actions */}
        <div className="flex shrink-0 items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              title="Mark all as read"
              aria-label="Mark all activities as read"
              className="flex size-9 items-center justify-center rounded-full border border-emerald-300/[0.10] bg-emerald-400/[0.045] text-emerald-200/65 transition-all duration-300 hover:border-emerald-300/[0.18] hover:bg-emerald-400/[0.075] hover:text-emerald-100"
            >
              <CheckCheck size={14} strokeWidth={2} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            title="Toggle filters"
            aria-label="Toggle activity filters"
            aria-expanded={showFilters}
            className={`relative flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
              showFilters
                ? "border-indigo-300/[0.16] bg-indigo-400/[0.10] text-indigo-100/85"
                : "border-gray-200 bg-gray-100 text-gray-600 hover:border-indigo-300/30 hover:text-indigo-600 dark:border-white/[0.06] dark:bg-white/[0.035] dark:text-white/35 dark:hover:border-indigo-300/[0.13] dark:hover:bg-indigo-400/[0.055] dark:hover:text-indigo-200/70"
            }`}
          >
            <Filter size={13} strokeWidth={2} />

            {filter !== "all" && <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_7px_rgba(129,140,248,0.55)]" />}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative z-10 mb-3">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25" size={13} strokeWidth={2} />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search categories, users or updates..."
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-9 pr-10 text-xs text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-400/40 focus:bg-white focus:ring-2 focus:ring-indigo-400/10 dark:border-white/[0.055] dark:bg-black/[0.12] dark:text-white/80 dark:placeholder:text-white/22 dark:focus:border-indigo-300/[0.15] dark:focus:bg-white/[0.025] dark:focus:ring-indigo-400/[0.06]"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-white/25 dark:hover:bg-white/[0.055] dark:hover:text-white/60"
          >
            <X size={12} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="relative z-10 mb-3 rounded-xl border border-gray-200/70 bg-gray-50/70 p-2 dark:border-white/[0.05] dark:bg-black/[0.10]">
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.map((option) => {
              const FilterIcon = option.icon;

              const isSelected = filter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilter(option.value);

                    setShowAll(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-semibold transition-all duration-300 ${
                    isSelected
                      ? "border-indigo-300/[0.14] bg-indigo-400/[0.08] text-indigo-200/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300/30 hover:text-indigo-600 dark:border-white/[0.05] dark:bg-white/[0.022] dark:text-white/30 dark:hover:border-indigo-300/[0.11] dark:hover:bg-indigo-400/[0.04] dark:hover:text-indigo-200/65"
                  }`}
                >
                  <FilterIcon size={11} strokeWidth={2} />

                  <span>{option.label}</span>

                  {isSelected && <Check size={10} strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Activity list */}
      <div className="custom-scrollbar relative z-10 max-h-[380px] space-y-2 overflow-y-auto pr-1">
        {displayedActivities.map((activity) => {
          const CategoryIcon = activity.categoryIcon;

          const ActionIcon = activity.actionIcon;

          const activityTheme = activityTypeStyles[activity.type];

          const priority = priorityStyles[activity.priority];

          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => markAsRead(activity.id)}
              className={`group/item relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 ${
                activity.read
                  ? "border-transparent bg-transparent hover:border-gray-200/80 hover:bg-gray-50/70 dark:hover:border-white/[0.045] dark:hover:bg-white/[0.025]"
                  : "border-indigo-300/[0.07] bg-indigo-400/[0.035] hover:border-indigo-300/[0.12] hover:bg-indigo-400/[0.055]"
              }`}
            >
              {/* Unread accent */}
              {!activity.read && <span className={`absolute bottom-2.5 left-0 top-2.5 w-[2px] rounded-r-full ${activityTheme.accent}`} />}

              {/* User avatar */}
              <div className="relative shrink-0">
                <img
                  src={activity.userAvatar}
                  alt={activity.user}
                  className="size-9 rounded-full border border-gray-200 object-cover shadow-[0_5px_14px_rgba(15,23,42,0.12)] dark:border-white/[0.08] dark:shadow-[0_6px_16px_rgba(0,0,0,0.24)]"
                />

                <span
                  className={`absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border border-white bg-white dark:border-[#11151c] dark:bg-[#161b23] ${activityTheme.icon}`}
                >
                  <ActionIcon size={8} strokeWidth={2.4} />
                </span>
              </div>

              {/* Main information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className={`flex size-6 shrink-0 items-center justify-center rounded-lg border ${activityTheme.iconBorder} ${activityTheme.iconBackground} ${activityTheme.icon}`}>
                      <CategoryIcon size={12} strokeWidth={2} />
                    </div>

                    <span className="truncate text-[12px] font-semibold text-gray-900 dark:text-white/85">{activity.category}</span>
                  </div>

                  <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.06em] ${priority.className}`}>
                    <Circle className={priority.dot} size={5} fill="currentColor" strokeWidth={0} />

                    {priority.label}
                  </span>
                </div>

                <p className="mt-1.5 truncate text-[10px] leading-4 text-gray-600 dark:text-white/37">{activity.details}</p>

                <div className="mt-2 flex items-center gap-2 text-[9px] text-gray-500 dark:text-white/24">
                  <span className="truncate font-medium text-gray-700 dark:text-white/45">{activity.user}</span>

                  <span className="text-gray-300 dark:text-white/12">•</span>

                  <span className="inline-flex shrink-0 items-center gap-1">
                    <Clock3 size={9} strokeWidth={2} />

                    {formatRelativeTime(activity.timestamp)}
                  </span>

                  {!activity.read && (
                    <>
                      <span className="text-gray-300 dark:text-white/12">•</span>

                      <span className="font-semibold text-indigo-500 dark:text-indigo-300/60">New</span>
                    </>
                  )}
                </div>
              </div>

              <ChevronRight
                className="mt-2 shrink-0 text-gray-300 opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:opacity-100 dark:text-white/20"
                size={14}
                strokeWidth={2}
              />
            </button>
          );
        })}

        {/* Empty state */}
        {displayedActivities.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 px-4 text-center dark:border-white/[0.055] dark:bg-black/[0.08]">
            <div className="relative flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-white/25">
              <History size={22} strokeWidth={1.7} />

              <Search className="absolute -bottom-1 -right-1 rounded-full border border-gray-200 bg-white p-1 dark:border-white/[0.08] dark:bg-[#171b22]" size={17} strokeWidth={2} />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-white/65">No activities found</p>

            <p className="mt-1 text-[10px] text-gray-400 dark:text-white/25">Try changing the search term or selected filter.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-3 text-[10px] text-gray-500 dark:border-white/[0.05] dark:text-white/28">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/60" />

              <span className="relative inline-flex size-2 rounded-full bg-emerald-400/80 shadow-[0_0_7px_rgba(52,211,153,0.35)]" />
            </span>

            <span className="font-medium text-emerald-700 dark:text-emerald-200/60">Live</span>
          </span>

          <span className="text-gray-300 dark:text-white/12">•</span>

          <span>{filteredActivities.length} activities</span>

          {unreadCount > 0 && (
            <>
              <span className="text-gray-300 dark:text-white/12">•</span>

              <span>{unreadCount} unread</span>
            </>
          )}
        </div>

        {filteredActivities.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 font-semibold text-indigo-600 transition-all hover:bg-indigo-500/[0.06] hover:text-indigo-700 dark:text-indigo-300/60 dark:hover:text-indigo-200/85"
          >
            <span>{showAll ? "Show less" : `View all (${filteredActivities.length})`}</span>

            {showAll ? <ChevronUp size={11} strokeWidth={2} /> : <ChevronRight size={11} strokeWidth={2} />}
          </button>
        )}
      </div>
    </Wrapper>
  );
};

import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FiArrowUpRight, FiBookOpen, FiBookmark, FiCheckCircle, FiExternalLink, FiFileText, FiFilter, FiFolder, FiGrid, FiImage, FiLayers, FiRefreshCw, FiUser } from "react-icons/fi";

import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { FavoriteButton, Loader, Wrapper } from "@/routes";

/* ==========================================================================
   RESOURCE CONFIGURATION
   ========================================================================== */

const RESOURCE_CONFIG = {
  Blog: {
    label: "Blogs",
    singularLabel: "Blog",
    path: "/view-blog",
    icon: FiFileText,
    primary: "#7EA4CC",
    soft: "rgba(126, 164, 204, 0.08)",
    border: "rgba(126, 164, 204, 0.20)",
    glow: "rgba(126, 164, 204, 0.12)",
  },

  Project: {
    label: "Projects",
    singularLabel: "Project",
    path: "/view-project",
    icon: FiFolder,
    primary: "#70B0A3",
    soft: "rgba(112, 176, 163, 0.08)",
    border: "rgba(112, 176, 163, 0.20)",
    glow: "rgba(112, 176, 163, 0.12)",
  },

  Courses: {
    label: "Courses",
    singularLabel: "Course",
    path: "/view-course",
    icon: FiBookOpen,
    primary: "#C3A06B",
    soft: "rgba(195, 160, 107, 0.08)",
    border: "rgba(195, 160, 107, 0.20)",
    glow: "rgba(195, 160, 107, 0.12)",
  },

  Chapter: {
    label: "Chapters",
    singularLabel: "Chapter",
    path: "/view-chapter",
    icon: FiLayers,
    primary: "#9B8BC2",
    soft: "rgba(155, 139, 194, 0.08)",
    border: "rgba(155, 139, 194, 0.20)",
    glow: "rgba(155, 139, 194, 0.12)",
  },
};

const RESOURCE_ALIASES = {
  Blogs: "Blog",
  Projects: "Project",
  Course: "Courses",
  Chapters: "Chapter",
};

const DEFAULT_RESOURCE_CONFIG = {
  label: "Resources",
  singularLabel: "Resource",
  path: "#",
  icon: FiBookmark,
  primary: "#A7B0BC",
  soft: "rgba(167, 176, 188, 0.07)",
  border: "rgba(167, 176, 188, 0.18)",
  glow: "rgba(167, 176, 188, 0.10)",
};

const ALL_FILTER = "All";

const TWO_LINE_CLAMP = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const THREE_LINE_CLAMP = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

/* ==========================================================================
   RESOURCE HELPERS
   ========================================================================== */

const normalizeResourceType = (type) => RESOURCE_ALIASES[type] || type;

const getResourceConfig = (type) => {
  const normalizedType = normalizeResourceType(type);

  return (
    RESOURCE_CONFIG[normalizedType] || {
      ...DEFAULT_RESOURCE_CONFIG,
      label: normalizedType || "Resources",
      singularLabel: normalizedType || "Resource",
    }
  );
};

const getResourceUrl = (type, resource) => {
  const config = getResourceConfig(type);

  const identifier = resource?.slug || resource?._id || resource?.id;

  if (!identifier || config.path === "#") {
    return "#";
  }

  return `${config.path}/${identifier}`;
};

const getImagePath = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value?.filePath || value?.url || value?.src || "";
};

const getCover = (resource) => getImagePath(resource?.cover) || getImagePath(resource?.thumbnail) || getImagePath(resource?.image);

const getTitle = (resource) => resource?.title || resource?.name || "Untitled resource";

const getDescription = (resource) => resource?.metaDescription || resource?.shortDescription || resource?.description || "Open this resource to view its complete information and details.";

const getAuthor = (resource) => resource?.user?.name || resource?.createdBy?.name || resource?.author?.name || "Unknown author";

/* ==========================================================================
   FAVORITE PAGE
   ========================================================================== */

export const Favorite = () => {
  const dispatch = useDispatch();

  const { favoriteResource, isFavoriteLoading, isError } = useSelector((state) => state.favorite);

  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  useEffect(() => {
    dispatch(getUserFavorite());
  }, [dispatch]);

  const resources = useMemo(() => {
    if (!favoriteResource || Array.isArray(favoriteResource)) {
      return [];
    }

    return Object.entries(favoriteResource).flatMap(([resourceType, items]) => {
      if (!Array.isArray(items)) {
        return [];
      }

      return items.filter(Boolean).map((resource) => ({
        resourceType,
        normalizedType: normalizeResourceType(resourceType),
        resource,
      }));
    });
  }, [favoriteResource]);

  const filterOptions = useMemo(() => {
    const counts = resources.reduce((result, item) => {
      const type = item.normalizedType;

      result[type] = (result[type] || 0) + 1;

      return result;
    }, {});

    const configuredOptions = Object.keys(RESOURCE_CONFIG)
      .filter((type) => counts[type] > 0)
      .map((type) => {
        const config = getResourceConfig(type);

        return {
          type,
          count: counts[type],
          ...config,
        };
      });

    const unconfiguredOptions = Object.keys(counts)
      .filter((type) => !RESOURCE_CONFIG[type])
      .map((type) => ({
        type,
        count: counts[type],
        ...getResourceConfig(type),
      }));

    return [
      {
        type: ALL_FILTER,
        label: "All resources",
        singularLabel: "Resource",
        count: resources.length,
        icon: FiGrid,
        primary: "#F1F1F1",
        soft: "rgba(255,255,255,0.055)",
        border: "rgba(255,255,255,0.12)",
        glow: "rgba(255,255,255,0.08)",
      },
      ...configuredOptions,
      ...unconfiguredOptions,
    ];
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (activeFilter === ALL_FILTER) {
      return resources;
    }

    return resources.filter((item) => item.normalizedType === activeFilter);
  }, [activeFilter, resources]);

  const activeFilterConfig = useMemo(() => {
    return filterOptions.find((option) => option.type === activeFilter) || filterOptions[0];
  }, [activeFilter, filterOptions]);

  useEffect(() => {
    const filterStillExists = filterOptions.some((option) => option.type === activeFilter);

    if (!filterStillExists) {
      setActiveFilter(ALL_FILTER);
    }
  }, [activeFilter, filterOptions]);

  const refreshFavorites = () => {
    dispatch(getUserFavorite());
  };

  if (isFavoriteLoading && resources.length === 0) {
    return <Loader />;
  }

  return (
    <section className="space-y-4 pb-8">
      {/* ==========================================================
          PAGE HEADER AND FILTERS
      ========================================================== */}

      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[22px] border border-[#282828] bg-[#191919] shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
          {/* Top highlight */}

          <span className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.16] to-transparent" />

          {/* Decorative elements */}

          <span className="pointer-events-none absolute -right-28 -top-32 size-72 rounded-full border-[48px] border-white/[0.012]" />

          <span className="pointer-events-none absolute -bottom-36 -left-20 size-72 rounded-full bg-white/[0.012] blur-[110px]" />

          {/* Header content */}

          <div className="relative px-5 pb-5 pt-5 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.09] bg-[#222222] text-xl text-[#F1F1F1] shadow-[0_14px_32px_rgba(0,0,0,0.36)]">
                  <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <FiBookmark className="relative" />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#727272]">Personal library</p>

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/[0.12] bg-emerald-400/[0.045] px-2.5 py-1 text-[8px] font-bold text-emerald-300/80">
                      <FiCheckCircle size={10} />
                      Synced
                    </span>
                  </div>

                  <h1 className="mt-1.5 text-xl font-black tracking-[-0.03em] text-[#F1F1F1] sm:text-2xl">Favorite resources</h1>

                  <p className="mt-1.5 max-w-2xl text-[10px] leading-5 text-[#7B7B7B] sm:text-[11px]">Browse and manage the blogs, projects, courses and chapters saved to your personal collection.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-11 items-center gap-3 rounded-xl border border-[#282828] bg-[#101010] px-3.5">
                  <span className="flex size-7 items-center justify-center rounded-lg border border-white/[0.06] bg-[#222222] text-[#727272]">
                    <FiGrid size={12} />
                  </span>

                  <div>
                    <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#727272]">Saved resources</p>

                    <p className="mt-0.5 text-[11px] font-black tabular-nums text-[#F1F1F1]">{resources.length}</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Refresh favorite resources"
                  onClick={refreshFavorites}
                  disabled={isFavoriteLoading}
                  className="group flex size-11 items-center justify-center rounded-xl border border-[#282828] bg-[#101010] text-[#727272] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#222222] hover:text-[#F1F1F1] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiRefreshCw size={14} className={isFavoriteLoading ? "animate-spin" : "transition-transform duration-500 group-hover:rotate-180"} />
                </button>
              </div>
            </div>

            {/* Resource filters */}

            {resources.length > 0 && (
              <div className="mt-5 border-t border-[#282828] pt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FiFilter size={12} className="text-[#727272]" />

                    <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#727272]">Filter collection</p>
                  </div>

                  <p className="text-[8px] font-medium text-[#727272]">
                    Showing <strong className="font-black text-[#F1F1F1]">{filteredResources.length}</strong> of <strong className="font-black text-[#F1F1F1]">{resources.length}</strong>
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {filterOptions.map((option) => {
                    const FilterIcon = option.icon;

                    const isActive = activeFilter === option.type;

                    return (
                      <button
                        key={option.type}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveFilter(option.type)}
                        className={`
                            group/filter
                            relative
                            inline-flex
                            h-9
                            shrink-0
                            items-center
                            gap-2
                            overflow-hidden
                            rounded-xl
                            border
                            px-3
                            text-[8px]
                            font-bold
                            transition-all
                            duration-300
                            ${
                              isActive
                                ? "translate-y-[-1px] bg-[#222222] text-[#F1F1F1] shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
                                : "border-[#282828] bg-[#101010] text-[#727272] hover:border-white/[0.12] hover:bg-[#222222] hover:text-[#F1F1F1]"
                            }
                          `}
                        style={
                          isActive
                            ? {
                                borderColor: option.border,
                                boxShadow: `0 10px 24px rgba(0,0,0,0.28), inset 0 0 0 1px ${option.border}`,
                              }
                            : undefined
                        }
                      >
                        {isActive && (
                          <span
                            className="pointer-events-none absolute inset-x-3 top-0 h-px"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${option.primary}, transparent)`,
                              boxShadow: `0 0 10px ${option.glow}`,
                            }}
                          />
                        )}

                        <FilterIcon
                          size={11}
                          style={{
                            color: isActive ? option.primary : undefined,
                          }}
                        />

                        <span>{option.label}</span>

                        <span
                          className="inline-flex min-w-5 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] px-1.5 py-0.5 text-[7px] font-black tabular-nums"
                          style={{
                            color: isActive ? option.primary : undefined,
                          }}
                        >
                          {option.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Wrapper>

      {/* ==========================================================
          ERROR STATE
      ========================================================== */}

      {isError && (
        <Wrapper className="overflow-hidden p-0">
          <div className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-[22px] border border-rose-400/[0.14] bg-[#191919] p-8 text-center">
            <span className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-rose-400/[0.025] blur-[90px]" />

            <span className="relative flex size-14 items-center justify-center rounded-2xl border border-rose-400/[0.14] bg-rose-400/[0.05] text-xl text-rose-300">
              <FiRefreshCw />
            </span>

            <h2 className="relative mt-4 text-sm font-black text-[#F1F1F1]">Unable to load favorites</h2>

            <p className="relative mt-2 max-w-md text-[10px] leading-5 text-[#7B7B7B]">Your saved resources could not be retrieved. Please try loading the collection again.</p>

            <button
              type="button"
              onClick={refreshFavorites}
              className="relative mt-5 inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.1] bg-[#222222] px-4 text-[9px] font-bold text-[#F1F1F1] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[#282828]"
            >
              <FiRefreshCw size={12} />
              Try again
            </button>
          </div>
        </Wrapper>
      )}

      {/* ==========================================================
          EMPTY COLLECTION
      ========================================================== */}

      {!isError && resources.length === 0 && !isFavoriteLoading && (
        <Wrapper className="overflow-hidden p-0">
          <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden rounded-[22px] border border-dashed border-[#282828] bg-[#191919] p-8 text-center">
            <span className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-white/[0.012] blur-[90px]" />

            <span className="relative flex size-16 items-center justify-center rounded-2xl border border-[#282828] bg-[#222222] text-2xl text-[#727272] shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
              <FiBookmark />
            </span>

            <h2 className="relative mt-4 text-sm font-black text-[#F1F1F1]">No favorite resources</h2>

            <p className="relative mt-2 max-w-md text-[10px] leading-5 text-[#7B7B7B]">Resources you bookmark will appear here for quick access.</p>
          </div>
        </Wrapper>
      )}

      {/* ==========================================================
          FILTERED RESULT HEADER
      ========================================================== */}

      {!isError && resources.length > 0 && (
        <div className="flex flex-col gap-3 rounded-[16px] border border-[#282828] bg-[#191919] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl border bg-[#222222]"
              style={{
                color: activeFilterConfig.primary,
                borderColor: activeFilterConfig.border,
              }}
            >
              {(() => {
                const ActiveIcon = activeFilterConfig.icon;

                return <ActiveIcon size={14} />;
              })()}
            </span>

            <div>
              <h2 className="text-[11px] font-black text-[#F1F1F1]">{activeFilterConfig.label}</h2>

              <p className="mt-0.5 text-[8px] text-[#727272]">
                {filteredResources.length} saved{" "}
                {filteredResources.length === 1 ? activeFilterConfig.singularLabel?.toLowerCase() || "resource" : activeFilterConfig.label?.toLowerCase() || "resources"}
              </p>
            </div>
          </div>

          {activeFilter !== ALL_FILTER && (
            <button
              type="button"
              onClick={() => setActiveFilter(ALL_FILTER)}
              className="inline-flex h-8 w-fit items-center gap-2 rounded-lg border border-[#282828] bg-[#101010] px-3 text-[8px] font-bold text-[#727272] transition-all duration-300 hover:border-white/[0.13] hover:bg-[#222222] hover:text-[#F1F1F1]"
            >
              <FiGrid size={10} />
              Show all resources
            </button>
          )}
        </div>
      )}

      {/* ==========================================================
          RESOURCE GRID
      ========================================================== */}

      {!isError && filteredResources.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredResources.map(({ resourceType, resource }, index) => (
            <FavoriteResourceCard key={`${resourceType}-${resource?._id || resource?.id || resource?.slug || index}`} resourceType={resourceType} resource={resource} />
          ))}
        </div>
      )}
    </section>
  );
};

/* ==========================================================================
   RESOURCE IMAGE
   ========================================================================== */

const FavoriteResourceImage = ({ cover, title }) => {
  const [imageError, setImageError] = useState(false);

  if (!cover || imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,#222222_0%,#191919_52%,#101010_100%)]">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-[#282828] bg-[#222222] text-xl text-[#727272]">
          <FiImage />
        </span>
      </div>
    );
  }

  return (
    <img
      src={cover}
      alt={title}
      loading="lazy"
      onError={() => setImageError(true)}
      className="absolute inset-0 size-full object-cover transition-[transform,filter] duration-700 ease-out group-hover/card:scale-[1.045] group-hover/card:brightness-105"
    />
  );
};

FavoriteResourceImage.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string.isRequired,
};

/* ==========================================================================
   RESOURCE TYPE BADGE
   ========================================================================== */

const ResourceTypeBadge = ({ resourceType }) => {
  const config = getResourceConfig(resourceType);

  const ResourceIcon = config.icon;

  return (
    <span
      className="inline-flex h-7 max-w-[72%] items-center gap-2 rounded-lg border bg-[rgba(16,16,16,0.86)] px-2.5 text-[7px] font-black uppercase tracking-[0.11em] shadow-[0_8px_22px_rgba(0,0,0,0.34)] backdrop-blur-xl"
      style={{
        color: config.primary,
        borderColor: config.border,
      }}
    >
      <ResourceIcon size={9} className="shrink-0" />

      <span className="truncate">{config.singularLabel}</span>
    </span>
  );
};

ResourceTypeBadge.propTypes = {
  resourceType: PropTypes.string.isRequired,
};

/* ==========================================================================
   FAVORITE RESOURCE CARD
   ========================================================================== */

const FavoriteResourceCard = ({ resourceType, resource }) => {
  const config = getResourceConfig(resourceType);

  const ResourceIcon = config.icon;

  const cover = getCover(resource);
  const title = getTitle(resource);

  const description = getDescription(resource);

  const author = getAuthor(resource);

  const resourceUrl = getResourceUrl(resourceType, resource);

  return (
    <article className="group/card relative flex min-h-[370px] flex-col overflow-hidden rounded-[20px] border border-[#282828] bg-[#191919] shadow-[0_12px_34px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-[#1C1C1C] hover:shadow-[0_24px_58px_rgba(0,0,0,0.46)]">
      {/* Type-coloured top highlight */}

      <span
        className="pointer-events-none absolute inset-x-8 top-0 z-30 h-px"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${config.primary}25,
            ${config.primary},
            ${config.primary}25,
            transparent
          )`,
          boxShadow: `0 0 12px ${config.glow}`,
        }}
      />

      {/* Hover ambient glow */}

      <span
        className="pointer-events-none absolute -right-20 -top-20 z-10 size-48 rounded-full opacity-0 blur-[78px] transition-all duration-700 group-hover/card:scale-125 group-hover/card:opacity-100"
        style={{
          background: config.glow,
        }}
      />

      {/* Inner card edge */}

      <span className="pointer-events-none absolute inset-0 z-20 rounded-[20px] ring-1 ring-inset ring-white/[0.018]" />

      <span
        className="pointer-events-none absolute inset-0 z-20 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${config.border}`,
        }}
      />

      {/* Resource preview */}

      <div className="relative h-[180px] shrink-0 overflow-hidden border-b border-[#282828] bg-[#101010]">
        <FavoriteResourceImage cover={cover} title={title} />

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101010]/95 via-[#101010]/10 to-black/10" />

        <span
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 85% 0%, ${config.glow}, transparent 44%)`,
          }}
        />

        <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-3">
          <ResourceTypeBadge resourceType={resourceType} />

          <div className="rounded-xl border border-white/[0.09] bg-[rgba(16,16,16,0.84)] p-1 shadow-[0_8px_22px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <FavoriteButton resourceType={resourceType} resourceId={resource._id} initialFavorited />
          </div>
        </div>

        <NavLink
          to={resourceUrl}
          aria-label={`Open ${title}`}
          className="absolute bottom-3 right-3 z-10 flex size-9 translate-y-2 items-center justify-center rounded-xl border border-white/[0.1] bg-[rgba(16,16,16,0.84)] text-[#7B7B7B] opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:bg-[#222222] hover:text-[#F1F1F1] group-hover/card:translate-y-0 group-hover/card:opacity-100"
        >
          <FiArrowUpRight size={14} />
        </NavLink>
      </div>

      {/* Card content */}

      <div className="relative z-10 flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex max-w-[68%] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[7px] font-bold"
            style={{
              color: config.primary,
              background: config.soft,
              borderColor: config.border,
            }}
          >
            <ResourceIcon size={9} className="shrink-0" />

            <span className="truncate">Saved {config.singularLabel}</span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-1.5 text-[7px] font-semibold text-emerald-300/70">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.4)]" />
            Available
          </span>
        </div>

        <NavLink to={resourceUrl} className="mt-3 block">
          <h2
            title={title}
            style={TWO_LINE_CLAMP}
            className="min-h-[42px] text-[13px] font-black capitalize leading-[1.55] tracking-[-0.02em] text-[#F1F1F1] transition-colors duration-300 group-hover/card:text-white"
          >
            {title}
          </h2>
        </NavLink>

        <p style={THREE_LINE_CLAMP} className="mt-2 min-h-[43px] text-[8px] leading-[1.8] text-[#7B7B7B]">
          {description}
        </p>

        {/* Author information */}

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#282828] bg-[#101010] px-3 py-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#222222] text-[#727272]">
            <FiUser size={11} />
          </span>

          <div className="min-w-0">
            <p className="text-[7px] font-bold uppercase tracking-[0.11em] text-[#727272]">Created by</p>

            <p className="mt-0.5 truncate text-[8px] font-semibold text-[#A4A4A4]">{author}</p>
          </div>
        </div>

        {/* Card action */}

        <div className="mt-auto pt-3">
          <NavLink
            to={resourceUrl}
            className="group/link relative flex h-9 w-full items-center justify-between overflow-hidden rounded-xl border border-[#282828] bg-[#222222] px-3.5 text-[8px] font-black text-[#B6B6B6] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-[#282828] hover:text-[#F1F1F1]"
          >
            <span
              className="pointer-events-none absolute -left-8 top-1/2 size-20 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover/link:opacity-100"
              style={{
                background: config.glow,
              }}
            />

            <span className="relative">View {config.singularLabel.toLowerCase()}</span>

            <span
              className="relative flex size-6 items-center justify-center rounded-lg border transition-all duration-300 group-hover/link:translate-x-0.5"
              style={{
                color: config.primary,
                borderColor: config.border,
                background: config.soft,
              }}
            >
              <FiExternalLink size={11} />
            </span>
          </NavLink>
        </div>
      </div>
    </article>
  );
};

FavoriteResourceCard.propTypes = {
  resourceType: PropTypes.string.isRequired,

  resource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    shortDescription: PropTypes.string,
    metaDescription: PropTypes.string,

    cover: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        filePath: PropTypes.string,
        url: PropTypes.string,
        src: PropTypes.string,
      }),
    ]),

    thumbnail: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        filePath: PropTypes.string,
        url: PropTypes.string,
        src: PropTypes.string,
      }),
    ]),

    image: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        filePath: PropTypes.string,
        url: PropTypes.string,
        src: PropTypes.string,
      }),
    ]),

    user: PropTypes.shape({
      name: PropTypes.string,
    }),

    createdBy: PropTypes.shape({
      name: PropTypes.string,
    }),

    author: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

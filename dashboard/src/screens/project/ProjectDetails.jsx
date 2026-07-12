import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Switch } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { FaCloudDownloadAlt, FaComments, FaLock, FaStar } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BiSolidChevronRight } from "react-icons/bi";
import { IoCheckmarkCircle, IoCloudDownloadOutline, IoEye } from "react-icons/io5";

import { getProjectPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { FavoriteButton, HeadingThree, LikeButton, RichTextRenderer, Wrapper } from "@/routes";
import { generateItemColor } from "@/utils";
import { ActionButton } from "@/components/customeUI/Button";
import { IconWithFallback } from "./ProjectToolsSection";

const getViewCount = (views) => {
  if (Array.isArray(views)) {
    return views.length;
  }

  return Number(views) || 0;
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-AU").format(Number(value) || 0);
};

const ProjectDetailsSkeleton = () => {
  return (
    <Wrapper className="relative overflow-hidden">
      {/* Wrapper background remains unchanged */}

      <div className="h-[42vh] animate-pulse rounded-t-3xl bg-gray-200 dark:bg-white/[0.045]" />

      <div className="space-y-5 px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-white/[0.045]" />

          <div className="flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.045]" />
            <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-white/[0.045]" />
          </div>
        </div>

        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />

        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.045]" />
          ))}
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-3xl bg-gray-200 dark:bg-white/[0.045] 3xl:h-[500px]" />
          ))}
        </div>

        <div className="h-16 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/[0.045]" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div>
            <div className="mb-5 h-7 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />

            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-4 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 h-7 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />

            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="size-5 animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.045]" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-white/[0.045]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const ProjectDetails = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { project, isLoading } = useSelector((state) => state.project);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);

  const userId = user?._id;

  const [localVisibility, setLocalVisibility] = useState("private");
  const [localFeatured, setLocalFeatured] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);
  const [isFeaturedUpdating, setIsFeaturedUpdating] = useState(false);

  const isFavorited = useMemo(() => {
    return Boolean(favoriteResource?.Project?.some((favorite) => favorite?._id === project?._id));
  }, [favoriteResource, project?._id]);

  const likeCount = useMemo(() => {
    return likeState?.likeCounts?.project?.[project?._id] ?? project?.likes?.length ?? 0;
  }, [likeState?.likeCounts, project?._id, project?.likes]);

  const viewCount = useMemo(() => {
    return getViewCount(project?.numOfViews);
  }, [project?.numOfViews]);

  const resourceFileSize = useMemo(() => {
    const size = project?.resourceFile?.file?.size;

    if (!size) {
      return null;
    }

    return (size / (1024 * 1024)).toFixed(2);
  }, [project?.resourceFile?.file?.size]);

  useEffect(() => {
    if (slug) {
      dispatch(getProjectPrivate(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserFavorite(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!project) {
      return;
    }

    setLocalVisibility(project?.visibility || "private");
    setLocalFeatured(Boolean(project?.featured));
  }, [project]);

  const handleVisibilityToggle = async (projectId, newVisibility) => {
    if (!projectId || isVisibilityUpdating) {
      return;
    }

    const previousVisibility = localVisibility;

    try {
      setIsVisibilityUpdating(true);
      setLocalVisibility(newVisibility);

      await dispatch(
        updateVisibility({
          projectId,
          visibility: newVisibility,
        }),
      ).unwrap();

      toast.success(`Project visibility changed to ${newVisibility}.`);
    } catch (error) {
      setLocalVisibility(previousVisibility);

      toast.error(error?.message || "Failed to update project visibility.");
    } finally {
      setIsVisibilityUpdating(false);
    }
  };

  const handleFeaturedToggle = async (projectId, newFeatured) => {
    if (!projectId || isFeaturedUpdating) {
      return;
    }

    const previousFeatured = localFeatured;

    try {
      setIsFeaturedUpdating(true);
      setLocalFeatured(newFeatured);

      await dispatch(
        updateFeaturedStatus({
          projectId,
          featured: newFeatured,
        }),
      ).unwrap();

      toast.success(newFeatured ? "Project added to featured items." : "Project removed from featured items.");
    } catch (error) {
      setLocalFeatured(previousFeatured);

      toast.error(error?.message || "Failed to update featured status.");
    } finally {
      setIsFeaturedUpdating(false);
    }
  };

  const handleFilterClick = (filterType, value) => {
    if (!value) {
      return;
    }

    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);

      return;
    }

    if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  return (
    <Wrapper className="group relative overflow-hidden">
      {/* Wrapper background remains unchanged */}

      <div className="pointer-events-none absolute -right-24 top-[35vh] size-72 rounded-full bg-indigo-500/[0.014] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-cyan-500/[0.012] blur-[100px]" />

      {/* Project hero */}
      <section className="relative min-h-[460px] overflow-hidden rounded-t-3xl">
        {project?.thumbnail?.filePath ? (
          <img
            src={project.thumbnail.filePath}
            alt={project?.thumbnail?.publicId || project?.title || "Project thumbnail"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_42%)]" />
        )}

        {/* Existing coloured image overlay retained */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/70 via-[#111827]/82 to-[#0d1118]/98" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_38%)]" />

        {/* Favourite button */}
        <div className="absolute right-4 top-4 z-20 sm:right-7 sm:top-7">
          <FavoriteButton resourceType="Project" resourceId={project?._id} initialFavorited={isFavorited} />
        </div>

        {/* Publishing controls */}
        <div className="absolute left-4 top-4 z-20 max-w-[calc(100%-150px)] rounded-2xl border border-white/[0.10] bg-black/40 p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:left-7 sm:top-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.045] px-2 py-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-emerald-300/[0.12] bg-emerald-300/[0.07] text-emerald-100/80">
                <FaLock size={10} />
              </span>

              <Switch
                id="visibility-switch"
                ripple={false}
                disabled={isVisibilityUpdating}
                checked={localVisibility === "public"}
                onChange={() => handleVisibilityToggle(project?._id, localVisibility === "public" ? "private" : "public")}
                label={localVisibility === "public" ? "Public" : "Private"}
                className="h-full w-full bg-white/20 checked:bg-emerald-500"
                containerProps={{
                  className: "w-10 h-5",
                }}
                labelProps={{
                  className: "text-white/90 text-[10px] font-medium capitalize",
                }}
                circleProps={{
                  className: "before:hidden left-0.5 border-none",
                }}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.045] px-2 py-1.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-amber-300/[0.12] bg-amber-300/[0.07] text-amber-100/80">
                <FaStar size={10} />
              </span>

              <Switch
                id="featured-switch"
                ripple={false}
                disabled={isFeaturedUpdating}
                checked={localFeatured}
                onChange={() => handleFeaturedToggle(project?._id, !localFeatured)}
                label={localFeatured ? "Featured" : "Not Featured"}
                className="h-full w-full bg-white/20 checked:bg-amber-500"
                containerProps={{
                  className: "w-10 h-5",
                }}
                labelProps={{
                  className: "text-white/90 text-[10px] font-medium capitalize",
                }}
                circleProps={{
                  className: "before:hidden left-0.5 border-none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Project details */}
        <div className="relative z-10 flex min-h-[460px] flex-col justify-end px-5 pb-6 pt-28 sm:px-8 sm:pb-8">
          <div className="max-w-5xl">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold capitalize leading-tight tracking-[-0.025em] text-white/90 sm:text-2xl lg:text-3xl">{project?.title}</h1>

              <VscVerifiedFilled size={21} className="shrink-0 text-emerald-400" />
            </div>

            {project?.metaDescription && <p className="mt-2 max-w-4xl text-[11px] leading-6 text-white/50 sm:text-[12px]">{project.metaDescription}</p>}
          </div>

          <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            {/* Author, category and formats */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.045] py-1.5 pl-1.5 pr-3 backdrop-blur-xl">
                  {project?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                    <div
                      className="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold uppercase text-white"
                      style={{
                        background: generateItemColor(project?.user?.name || project?.name || "X"),
                      }}
                    >
                      {project?.user?.name?.charAt(0) || project?.name?.charAt(0) || "?"}
                    </div>
                  ) : (
                    <div className="size-7 overflow-hidden rounded-full border border-white/[0.10] bg-white/[0.05]">
                      <img
                        src={project?.user?.avatar?.url || project?.avatar?.url}
                        alt={project?.user?.avatar?.publicId || project?.avatar?.publicId || project?.user?.name || "Project author"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <span className="max-w-[140px] truncate text-[10px] font-medium capitalize text-white/65">{project?.user?.name || project?.name || "Unknown author"}</span>
                </div>

                <BiSolidChevronRight className="text-white/20" />

                {project?.category?.title && (
                  <button
                    type="button"
                    onClick={() => handleFilterClick("category", project.category.title)}
                    className="rounded-full border border-indigo-300/[0.12] bg-indigo-300/[0.06] px-3 py-1.5 text-[9px] font-semibold capitalize text-indigo-100/75 transition-all hover:border-indigo-300/25 hover:bg-indigo-300/[0.10]"
                  >
                    {project.category.title}
                  </button>
                )}

                {project?.formats?.length > 0 && (
                  <>
                    <BiSolidChevronRight className="text-white/20" />

                    <div className="flex items-center pl-3">
                      {project.formats.map((format, index) => {
                        const iconName = format?.format?.toLowerCase() || "unknown";
                        const label = format?.format || "Unknown";

                        return (
                          <div
                            key={format?._id || `${label}-${index}`}
                            title={label}
                            className="-ml-3 flex size-8 items-center justify-center overflow-hidden rounded-full border border-white/[0.10] bg-[#161b24]/90 p-1.5 shadow-[0_7px_18px_rgba(0,0,0,0.20)] transition-all hover:z-10 hover:-translate-y-0.5"
                          >
                            <IconWithFallback value={iconName} alt={`${label} icon`} className="h-full w-full object-contain" />
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Tags */}
              {project?.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {project.tags.map((tag) => (
                    <button
                      type="button"
                      key={tag?._id || tag?.tag}
                      onClick={() => handleFilterClick("tag", tag?.tag)}
                      className="rounded-full border border-teal-300/[0.12] bg-teal-300/[0.055] px-2.5 py-1 text-[9px] font-medium italic text-teal-100/70 transition-all hover:border-teal-300/25 hover:bg-teal-300/[0.10]"
                    >
                      #{tag?.tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics and actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.055] px-3 text-white/65 backdrop-blur-xl">
                <IoEye className="text-blue-300/80" />

                <span className="text-[10px] font-medium tabular-nums">{formatNumber(viewCount)}</span>
              </div>

              <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.055] px-2 text-white/65 backdrop-blur-xl">
                <LikeButton resourceType="project" contentId={project?._id} initialLikes={project?.likes || []} showtrue />

                <span className="pr-1 text-[10px] font-medium tabular-nums">{formatNumber(likeCount)}</span>
              </div>

              <div className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.055] px-3 text-white/65 backdrop-blur-xl">
                <FaComments className="text-emerald-300/75" />

                <span className="text-[10px] font-medium tabular-nums">200</span>
              </div>

              <NavLink
                target="_blank"
                rel="noopener noreferrer"
                to={project?.urllink || "#"}
                className={`inline-flex min-h-10 items-center rounded-xl border border-white/[0.09] bg-white/[0.055] px-4 text-[10px] font-semibold text-white/75 backdrop-blur-xl transition-all hover:border-white/[0.16] hover:bg-white/[0.10] ${
                  !project?.urllink ? "pointer-events-none opacity-40" : ""
                }`}
              >
                Preview
              </NavLink>

              <ActionButton className="flex h-10 items-center gap-2 rounded-xl px-4">
                <span className="text-[10px]">Add to cart</span>

                <span className="text-[10px] font-bold">${project?.price || 0}</span>
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      {/* Project content */}
      <section className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Asset gallery */}
        {project?.assets?.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {project.assets.map((image) => (
              <div
                key={image?.publicId || image?.filePath}
                className="group/image relative h-80 overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-100 shadow-[0_14px_35px_rgba(15,23,42,0.08)] dark:border-white/[0.05] dark:bg-white/[0.018] dark:shadow-[0_16px_38px_rgba(0,0,0,0.22)] 3xl:h-[500px]"
              >
                <img
                  src={image?.filePath}
                  alt={image?.publicId || project?.title || "Project asset"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/image:scale-[1.02]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
              </div>
            ))}
          </div>
        )}

        {/* Download banner */}
        <div className="relative my-5 overflow-hidden rounded-2xl border border-emerald-300/20 bg-emerald-500/[0.055] p-3.5 dark:border-emerald-300/[0.08] dark:bg-emerald-300/[0.025]">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-emerald-500/[0.08] blur-[45px]" />

          <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-500/[0.08] text-emerald-700 dark:border-emerald-300/[0.10] dark:bg-emerald-300/[0.045] dark:text-emerald-200/75">
                <FaCloudDownloadAlt size={17} />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-100/75">All-Access download</p>

                <p className="mt-0.5 text-[9px] leading-5 text-emerald-700/75 dark:text-emerald-200/45">You can download this product with the All-Access Pass.</p>
              </div>
            </div>

            <button
              type="button"
              className="w-fit rounded-xl border border-emerald-400/25 bg-emerald-600 px-5 py-2.5 text-[10px] font-semibold text-white shadow-[0_8px_20px_rgba(16,185,129,0.18)] transition-all hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              Get All-Access
            </button>
          </div>
        </div>

        {/* Overview and project information */}
        <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:px-8 xl:px-14">
          {/* Overview */}
          <div className="min-w-0">
            <HeadingThree className="mb-4">Overview</HeadingThree>

            <div className="text-gray-700 dark:text-white/65">
              <RichTextRenderer content={project?.description || ""} />
            </div>
          </div>

          {/* Highlights and formats */}
          <aside className="min-w-0">
            <div className="rounded-2xl border border-gray-200/70 bg-gray-50/45 p-4 dark:border-white/[0.045] dark:bg-white/[0.016]">
              <HeadingThree className="mb-4">Highlights</HeadingThree>

              <div className="space-y-3">
                {project?.highlights?.map((highlight) => (
                  <div key={highlight?._id || highlight?.highlight} className="flex items-start gap-2.5">
                    <IoCheckmarkCircle size={17} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-200/65" />

                    <p className="text-[10px] leading-5 text-gray-600 dark:text-white/45">{highlight?.highlight}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-gray-200/70 pt-6 dark:border-white/[0.05]">
                <HeadingThree className="mb-4">Format</HeadingThree>

                <div className="flex flex-wrap gap-2">
                  {project?.formats?.map((format, index) => {
                    const iconName = format?.format?.toLowerCase() || "unknown";
                    const label = format?.format || "Unknown";

                    return (
                      <div
                        key={format?._id || `${label}-${index}`}
                        className="flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/60 px-3 py-2 text-[9px] font-medium text-gray-600 transition-all hover:border-indigo-300/30 hover:bg-indigo-500/[0.04] dark:border-white/[0.05] dark:bg-white/[0.022] dark:text-white/45 dark:hover:border-indigo-300/[0.10] dark:hover:text-indigo-200/65"
                      >
                        <div className="flex size-5 shrink-0 items-center justify-center">
                          <IconWithFallback value={iconName} alt={`${label} icon`} className="h-full w-full object-contain" />
                        </div>

                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {project?.resourceFile?.type === "file" && resourceFileSize && (
                <div className="mt-7 flex items-center gap-3 rounded-xl border border-blue-300/20 bg-blue-500/[0.05] p-3 dark:border-blue-300/[0.08] dark:bg-blue-300/[0.025]">
                  <span className="flex size-8 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-500/[0.07] text-blue-700 dark:border-blue-300/[0.09] dark:bg-blue-300/[0.04] dark:text-blue-200/70">
                    <IoCloudDownloadOutline size={16} />
                  </span>

                  <div>
                    <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-gray-400 dark:text-white/25">Resource size</p>

                    <p className="mt-0.5 text-[10px] font-semibold text-gray-700 dark:text-white/60">{resourceFileSize} MB</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </Wrapper>
  );
};

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Chip, Switch } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { AiFillLike } from "react-icons/ai";
import { FaComments, FaLock, FaStar, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";

import { DateFormatter } from "@/components/common/DateFormatter";
import { getBlogPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { Comments, FavoriteButton, LikeButton, RichTextRenderer, Wrapper } from "@/routes";

const getViewCount = (views) => {
  if (Array.isArray(views)) {
    return views.length;
  }

  return Number(views) || 0;
};

export const BlogDetails = () => {
  const { slug } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blog } = useSelector((state) => state.blog);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);

  const userId = user?._id;

  const [localVisibility, setLocalVisibility] = useState("private");
  const [localFeatured, setLocalFeatured] = useState(false);
  const [isVisibilityUpdating, setIsVisibilityUpdating] = useState(false);
  const [isFeaturedUpdating, setIsFeaturedUpdating] = useState(false);

  const isFavorited = useMemo(() => {
    return Boolean(favoriteResource?.Blog?.some((favorite) => favorite?._id === blog?._id));
  }, [favoriteResource, blog?._id]);

  const likeCount = useMemo(() => {
    return likeState?.likeCounts?.blog?.[blog?._id] ?? blog?.likes?.length ?? 0;
  }, [likeState?.likeCounts, blog?._id, blog?.likes]);

  const viewCount = useMemo(() => {
    return getViewCount(blog?.numOfViews);
  }, [blog?.numOfViews]);

  const commentCount = blog?.commentsCount ?? blog?.comments?.length ?? 200;

  useEffect(() => {
    if (slug) {
      dispatch(getBlogPrivate(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserFavorite(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!blog) {
      return;
    }

    setLocalVisibility(blog?.visibility || "private");
    setLocalFeatured(Boolean(blog?.featured));
  }, [blog]);

  const handleVisibilityToggle = async (blogId, newVisibility) => {
    if (!blogId || isVisibilityUpdating) {
      return;
    }

    const previousVisibility = localVisibility;

    try {
      setIsVisibilityUpdating(true);
      setLocalVisibility(newVisibility);

      await dispatch(
        updateVisibility({
          blogId,
          visibility: newVisibility,
        }),
      ).unwrap();

      toast.success(`Blog visibility changed to ${newVisibility}.`);
    } catch (error) {
      setLocalVisibility(previousVisibility);

      toast.error(error?.message || "Failed to update blog visibility.");
    } finally {
      setIsVisibilityUpdating(false);
    }
  };

  const handleFeaturedToggle = async (blogId, newFeatured) => {
    if (!blogId || isFeaturedUpdating) {
      return;
    }

    const previousFeatured = localFeatured;

    try {
      setIsFeaturedUpdating(true);
      setLocalFeatured(newFeatured);

      await dispatch(
        updateFeaturedStatus({
          blogId,
          featured: newFeatured,
        }),
      ).unwrap();

      toast.success(newFeatured ? "Blog added to featured posts." : "Blog removed from featured posts.");
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

  return (
    <>
      <Wrapper className="group relative overflow-hidden p-5 sm:p-6">
        {/* Wrapper background remains unchanged */}

        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-indigo-500/[0.016] blur-[95px] transition-all duration-700 group-hover:bg-indigo-500/[0.024]" />

        <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-cyan-500/[0.014] blur-[95px] transition-all duration-700 group-hover:bg-cyan-500/[0.022]" />

        {/* Cover image */}
        <div className="relative z-10 h-[280px] overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-100 dark:border-white/[0.055] dark:bg-white/[0.018] sm:h-[380px]">
          {blog?.cover?.filePath ? (
            <img
              src={blog.cover.filePath}
              alt={blog?.cover?.fileName || blog?.title || "Blog cover"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.08),transparent_42%)] text-gray-400 dark:text-white/25">
              No cover image
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15" />

          {/* Like and favourite actions */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <LikeButton resourceType="blog" contentId={blog?._id} initialLikes={blog?.likes || []} />

            <FavoriteButton resourceType="Blog" resourceId={blog?._id} initialFavorited={isFavorited} />
          </div>

          {/* Publishing controls */}
          <div className="absolute bottom-3 right-3 max-w-[calc(100%-24px)] rounded-xl border border-white/[0.10] bg-black/55 p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg border border-emerald-300/[0.10] bg-emerald-300/[0.06] text-emerald-100/70">
                  <FaLock size={10} />
                </span>

                <Switch
                  id="visibility-switch"
                  ripple={false}
                  disabled={isVisibilityUpdating}
                  className="h-full w-full checked:bg-emerald-500"
                  label={localVisibility === "public" ? "Public" : "Private"}
                  checked={localVisibility === "public"}
                  onChange={() => handleVisibilityToggle(blog?._id, localVisibility === "public" ? "private" : "public")}
                  containerProps={{
                    className: "w-10 h-5",
                  }}
                  labelProps={{
                    className: "text-white/75 text-[10px] font-medium capitalize",
                  }}
                  circleProps={{
                    className: "before:hidden left-0.5 border-none",
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg border border-amber-300/[0.10] bg-amber-300/[0.06] text-amber-100/70">
                  <FaStar size={10} />
                </span>

                <Switch
                  id="featured-switch"
                  ripple={false}
                  disabled={isFeaturedUpdating}
                  className="h-full w-full checked:bg-amber-500"
                  label={localFeatured ? "Featured" : "Not Featured"}
                  checked={localFeatured}
                  onChange={() => handleFeaturedToggle(blog?._id, !localFeatured)}
                  containerProps={{
                    className: "w-10 h-5",
                  }}
                  labelProps={{
                    className: "text-white/75 text-[10px] font-medium capitalize",
                  }}
                  circleProps={{
                    className: "before:hidden left-0.5 border-none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="relative z-10 flex flex-col gap-4 border-b border-gray-200/70 py-5 dark:border-white/[0.05] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[10px] text-gray-500 dark:text-white/30">
            <span>
              <DateFormatter date={blog?.createdAt} />
            </span>

            <span className="hidden h-4 w-px bg-gray-300 dark:bg-white/[0.08] sm:block" />

            <span className="inline-flex items-center gap-1.5 capitalize">
              <FaUser size={10} className="text-indigo-600 dark:text-indigo-200/55" />

              {blog?.user?.name || "Unknown author"}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <IoEye className="text-blue-600 dark:text-blue-200/55" />

              <span className="tabular-nums">{viewCount}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <AiFillLike className="text-rose-600 dark:text-rose-200/55" />

              <span className="tabular-nums">{likeCount}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <FaComments className="text-emerald-600 dark:text-emerald-200/55" />

              <span className="tabular-nums">{commentCount}</span>
            </span>
          </div>

          {blog?.category?.title && (
            <button
              type="button"
              onClick={() => handleFilterClick("category", blog.category.title)}
              className="w-fit rounded-full border border-indigo-300/20 bg-indigo-500/[0.05] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-indigo-700 transition-all hover:border-indigo-400/35 hover:bg-indigo-500/[0.09] dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.04] dark:text-indigo-200/70"
            >
              {blog.category.title}
            </button>
          )}
        </div>

        {/* Blog heading */}
        <div className="relative z-10 pt-5">
          <h1 className="max-w-5xl text-xl font-bold capitalize leading-tight tracking-[-0.025em] text-gray-900 dark:text-white/90 sm:text-2xl">{blog?.title}</h1>

          {/* Tags */}
          {blog?.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {blog.tags.map((tag) => (
                <Chip
                  key={tag?._id || tag?.tag}
                  variant="outlined"
                  value={tag?.tag}
                  onClick={() => handleFilterClick("tag", tag?.tag)}
                  className="cursor-pointer rounded-full border-indigo-300/25 bg-indigo-500/[0.035] px-3 py-1.5 text-[9px] font-semibold normal-case text-indigo-700 transition-all hover:bg-indigo-500/[0.08] dark:border-indigo-300/[0.10] dark:bg-indigo-300/[0.035] dark:text-indigo-200/65"
                />
              ))}
            </div>
          )}

          {blog?.metaDescription && (
            <p className="mt-5 rounded-xl border border-gray-200/70 bg-gray-50/45 p-4 text-[12px] leading-6 text-gray-600 dark:border-white/[0.045] dark:bg-white/[0.016] dark:text-white/40">
              {blog.metaDescription}
            </p>
          )}

          <div className="mt-6 text-gray-700 dark:text-white/65">
            <RichTextRenderer content={blog?.description || ""} />
          </div>
        </div>
      </Wrapper>

      <Comments />
    </>
  );
};

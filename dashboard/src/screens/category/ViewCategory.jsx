import { getCategory } from "@/redux/slices/resources/categorySlice";
import { BreadcrumbsComponent, Loader } from "@/routes";
import { CalendarDays, FileText, FolderOpen, ImageOff, Layers3, Tag, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

/* ==========================================================================
   HELPERS
   ========================================================================== */

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getPostCover = (post) => {
  return post?.cover?.filePath || post?.image?.filePath || post?.thumbnail?.filePath || post?.coverImage || post?.image || null;
};

const getAuthorName = (post) => {
  return post?.createdBy?.name || post?.createdBy?.fullName || post?.author?.name || post?.author?.fullName || post?.user?.name || "Unknown author";
};

/* ==========================================================================
   RELATED POST CARD
   ========================================================================== */

const RelatedPostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  const postCover = getPostCover(post);

  const title = post?.title || post?.name || "Untitled Post";

  const description = post?.description || post?.excerpt || post?.content?.replace(/<[^>]*>/g, "").slice(0, 110) || "No description is available for this post.";

  const postType = post?.type || post?.status || "Post";

  return (
    <article className="group/post relative overflow-hidden rounded-2xl border border-gray-200/70 bg-gray-50/60 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30 hover:bg-white/80 hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] dark:border-white/[0.055] dark:bg-white/[0.022] dark:shadow-[0_14px_34px_rgba(0,0,0,0.18)] dark:hover:border-indigo-300/[0.13] dark:hover:bg-white/[0.035] dark:hover:shadow-[0_20px_46px_rgba(0,0,0,0.28)]">
      {/* Muted card lighting */}
      <div className="pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full bg-indigo-500/[0.025] opacity-60 blur-[70px] transition-all duration-700 group-hover/post:scale-110 group-hover/post:opacity-90" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.018),transparent_35%,transparent_76%,rgba(255,255,255,0.003))]" />

      {/* Post image */}
      <div className="relative h-44 overflow-hidden border-b border-gray-200/70 bg-gray-100 dark:border-white/[0.045] dark:bg-white/[0.02]">
        {postCover && !imageError ? (
          <img src={postCover} alt={title} onError={() => setImageError(true)} className="h-full w-full object-cover transition-transform duration-500 group-hover/post:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400 dark:text-white/22">
            <ImageOff size={28} strokeWidth={1.6} />

            <span className="text-[10px] font-medium">No cover image</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-black/45 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-white/70 backdrop-blur-md">
          <Tag size={9} strokeWidth={2} />

          {postType}
        </span>
      </div>

      {/* Post information */}
      <div className="relative z-10 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/88">{title}</h3>

        <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-gray-500 dark:text-white/30">{description}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200/70 pt-3 text-[9px] dark:border-white/[0.05]">
          <span className="flex min-w-0 items-center gap-1.5 text-gray-500 dark:text-white/27">
            <UserRound className="shrink-0" size={10} strokeWidth={2} />

            <span className="truncate">{getAuthorName(post)}</span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5 text-gray-500 dark:text-white/27">
            <CalendarDays size={10} strokeWidth={2} />

            {formatDate(post?.createdAt || post?.updatedAt)}
          </span>
        </div>
      </div>
    </article>
  );
};

/* ==========================================================================
   VIEW CATEGORY
   ========================================================================== */

export const ViewCategory = () => {
  const dispatch = useDispatch();

  const { id: categoryId } = useParams();

  const { category, isLoading } = useSelector((state) => state.category);

  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (categoryId) {
      dispatch(getCategory(categoryId));
    }
  }, [dispatch, categoryId]);

  useEffect(() => {
    setCoverError(false);
  }, [category?.cover?.filePath]);

  const relatedPosts = useMemo(() => {
    const possiblePosts = category?.posts || category?.relatedPosts || category?.post || [];

    return Array.isArray(possiblePosts) ? possiblePosts : [];
  }, [category]);

  const categoryTitle = category?.title || "Category Details";

  const categoryType = category?.type || "Category";

  const categoryCover = category?.cover?.filePath || null;

  return (
    <>
      {isLoading && <Loader />}

      <BreadcrumbsComponent text="Category Details" />

      {/* ================================================================
          CATEGORY HERO
          ================================================================ */}

      <section className="group relative my-5 min-h-[22rem] w-full overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-100 shadow-[0_18px_50px_rgba(15,23,42,0.10)] dark:border-white/[0.055] dark:bg-white/[0.018] dark:shadow-[0_22px_60px_rgba(0,0,0,0.30)]">
        {/* Cover image */}
        {categoryCover && !coverError ? (
          <img
            src={categoryCover}
            alt={categoryTitle}
            onError={() => setCoverError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.10),transparent_40%)]">
            <ImageOff className="text-gray-400 dark:text-white/15" size={64} strokeWidth={1.2} />
          </div>
        )}

        {/* Dark overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080b10]/95 via-[#080b10]/72 to-[#080b10]/35" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080b10]/95 via-transparent to-black/20" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.035),transparent_35%,transparent_75%)]" />

        {/* Decorative lighting */}
        <div className="pointer-events-none absolute -bottom-28 -right-20 size-72 rounded-full bg-indigo-500/[0.10] blur-[95px]" />

        <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full bg-cyan-500/[0.07] blur-[95px]" />

        {/* Hero content */}
        <div className="relative z-10 flex min-h-[22rem] items-end px-6 py-8 sm:px-9 sm:py-10 lg:px-12">
          <div className="w-full max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-300/[0.14] bg-indigo-300/[0.08] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.10em] text-indigo-100/80 backdrop-blur-md">
                <FolderOpen size={11} strokeWidth={2} />
                Category
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-black/25 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.10em] text-white/55 backdrop-blur-md">
                <Layers3 size={11} strokeWidth={2} />

                {categoryType}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-black/25 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.10em] text-white/55 backdrop-blur-md">
                <FileText size={11} strokeWidth={2} />
                {relatedPosts.length} {relatedPosts.length === 1 ? "Post" : "Posts"}
              </span>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.20em] text-white/35">Category overview</p>

            <h1 className="mt-3 max-w-3xl break-words text-3xl font-extrabold uppercase leading-[1.05] tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">{categoryTitle}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-white/42">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={11} strokeWidth={2} />
                Created {formatDate(category?.createdAt)}
              </span>

              {category?.updatedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={11} strokeWidth={2} />
                  Updated {formatDate(category.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          RELATED POSTS
          ================================================================ */}

      <section className="relative mb-5 overflow-hidden rounded-3xl border border-gray-200/70 bg-gray-50/45 p-5 shadow-[0_14px_38px_rgba(15,23,42,0.06)] dark:border-white/[0.055] dark:bg-white/[0.014] dark:shadow-[0_18px_46px_rgba(0,0,0,0.22)] sm:p-6">
        <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full bg-indigo-500/[0.018] blur-[85px]" />

        <div className="pointer-events-none absolute -left-20 -top-24 size-64 rounded-full bg-cyan-500/[0.014] blur-[85px]" />

        {/* Section header */}
        <div className="relative z-10 mb-5 flex flex-col gap-3 border-b border-gray-200/70 pb-4 dark:border-white/[0.05] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-indigo-300/[0.10] bg-[linear-gradient(145deg,rgba(70,64,130,0.52),rgba(42,39,75,0.90))] text-indigo-100/80 shadow-[0_8px_22px_rgba(0,0,0,0.20)]">
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),transparent_48%)]" />

              <FileText className="relative" size={18} strokeWidth={1.9} />
            </div>

            <div>
              <h2 className="text-sm font-semibold tracking-[-0.015em] text-gray-900 dark:text-white/90">Related Posts</h2>

              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/27">Posts published under this category</p>
            </div>
          </div>

          <span className="w-fit rounded-full border border-indigo-300/[0.10] bg-indigo-300/[0.04] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-200/65">
            {relatedPosts.length} {relatedPosts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {/* Related post cards */}
        {relatedPosts.length > 0 ? (
          <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((post, index) => (
              <RelatedPostCard key={post?._id || post?.id || `${post?.title}-${index}`} post={post} />
            ))}
          </div>
        ) : (
          <div className="relative z-10 flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/45 px-5 text-center dark:border-white/[0.07] dark:bg-white/[0.012]">
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/[0.10] bg-indigo-300/[0.04] text-indigo-700 dark:text-indigo-200/55">
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_48%)]" />

              <FolderOpen className="relative" size={27} strokeWidth={1.6} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-white/65">No related posts found</h3>

            <p className="mt-1.5 max-w-sm text-[10px] leading-5 text-gray-500 dark:text-white/27">Posts assigned to this category will be displayed here when they become available.</p>
          </div>
        )}
      </section>
    </>
  );
};

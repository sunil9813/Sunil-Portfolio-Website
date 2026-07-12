import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { ArrowUpRight, BookOpen, CalendarDays, Eye, Heart, ImageOff, MessageCircle, Star, UserRound } from "lucide-react";
import { truncateText } from "@/utils";

const DEFAULT_IMAGE = "https://via.placeholder.com/1200x800?text=Blog";

/*
 * Only accent elements use these colours:
 * - top shining line
 * - category indicator
 * - Read full article button
 * - subtle card hover glow
 *
 * The card background stays neutral and matches the sidebar.
 */
const CARD_PALETTE = [
  {
    primary: "#7EA4CC",
    soft: "rgba(126, 164, 204, 0.09)",
    border: "rgba(126, 164, 204, 0.24)",
    glow: "rgba(126, 164, 204, 0.11)",
  },
  {
    primary: "#70B0A3",
    soft: "rgba(112, 176, 163, 0.09)",
    border: "rgba(112, 176, 163, 0.24)",
    glow: "rgba(112, 176, 163, 0.11)",
  },
  {
    primary: "#9B8BC2",
    soft: "rgba(155, 139, 194, 0.09)",
    border: "rgba(155, 139, 194, 0.24)",
    glow: "rgba(155, 139, 194, 0.11)",
  },
  {
    primary: "#C3A06B",
    soft: "rgba(195, 160, 107, 0.09)",
    border: "rgba(195, 160, 107, 0.24)",
    glow: "rgba(195, 160, 107, 0.11)",
  },
  {
    primary: "#C37F86",
    soft: "rgba(195, 127, 134, 0.09)",
    border: "rgba(195, 127, 134, 0.24)",
    glow: "rgba(195, 127, 134, 0.11)",
  },
  {
    primary: "#88A18E",
    soft: "rgba(136, 161, 142, 0.09)",
    border: "rgba(136, 161, 142, 0.24)",
    glow: "rgba(136, 161, 142, 0.11)",
  },
];

const blogShape = PropTypes.shape({
  _id: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
  publicId: PropTypes.string,
  metaDescription: PropTypes.string,
  image: PropTypes.string,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  featured: PropTypes.bool,
  isFeatured: PropTypes.bool,
  visibility: PropTypes.string,

  category: PropTypes.shape({
    title: PropTypes.string,
  }),

  user: PropTypes.shape({
    name: PropTypes.string,
  }),

  cover: PropTypes.shape({
    filePath: PropTypes.string,
    url: PropTypes.string,
  }),

  numOfViews: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  likes: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  comments: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  numOfComments: PropTypes.number,
  commentCount: PropTypes.number,
});

const twoLineClamp = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const getPalette = (index) => CARD_PALETTE[index % CARD_PALETTE.length];

const getCount = (value) => {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value === undefined || value === null) {
    return 0;
  }

  const numericValue = Number(value);

  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const formatCount = (value) => {
  const count = getCount(value);

  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }

  return count.toString();
};

const getCommentCount = (blog) => {
  if (Array.isArray(blog?.comments)) {
    return blog.comments.length;
  }

  return blog?.comments ?? blog?.numOfComments ?? blog?.commentCount ?? 0;
};

const getImageSource = (blog) => blog?.cover?.filePath || blog?.cover?.url || blog?.image || DEFAULT_IMAGE;

const getBlogLink = (blog) => {
  const reference = blog?.slug || blog?._id || blog?.id || "";

  return `/view-blog/${reference}`;
};

const getFormattedDate = (value) => {
  if (!value) {
    return "Recently added";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently added";
  }

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAuthorInitial = (name) => (name || "A").trim().charAt(0).toUpperCase();

const BlogImage = ({ blog }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#171C23] via-[#11161D] to-[#0B0F14]">
        <span className="flex size-12 items-center justify-center rounded-xl border border-[#2A323C] bg-[#151A21] text-[#687382] shadow-[0_14px_32px_rgba(0,0,0,0.32)]">
          <ImageOff size={19} />
        </span>
      </div>
    );
  }

  return (
    <img
      src={getImageSource(blog)}
      alt={blog?.title || blog?.publicId || "Blog cover"}
      loading="lazy"
      onError={() => setImageError(true)}
      className="absolute inset-0 size-full object-cover transition-[transform,filter] duration-700 ease-out group-hover/card:scale-[1.045] group-hover/card:brightness-105"
    />
  );
};

BlogImage.propTypes = {
  blog: blogShape.isRequired,
};

const CategoryBadge = ({ blog, palette }) => {
  const category = blog?.category?.title || "General";

  return (
    <span
      title={category}
      className="inline-flex h-7 max-w-[72%] items-center gap-2 rounded-lg border bg-[#0A0E13]/85 px-2.5 text-[7px] font-black uppercase tracking-[0.11em] shadow-[0_8px_22px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      style={{
        color: palette.primary,
        borderColor: palette.border,
      }}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{
          background: palette.primary,
          boxShadow: `0 0 7px ${palette.primary}70`,
        }}
      />

      <span className="truncate">{category}</span>
    </span>
  );
};

CategoryBadge.propTypes = {
  blog: blogShape.isRequired,

  palette: PropTypes.shape({
    primary: PropTypes.string,
    border: PropTypes.string,
  }).isRequired,
};

const FeaturedBadge = () => (
  <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-white/[0.12] bg-[#0A0E13]/85 px-2.5 text-[7px] font-black uppercase tracking-[0.09em] text-[#D7DCE3] shadow-[0_8px_22px_rgba(0,0,0,0.28)] backdrop-blur-xl">
    <Star size={9} className="fill-current text-[#D7DCE3]" />
    Featured
  </span>
);

const VisibilityBadge = ({ visibility }) => {
  const value = visibility || "public";

  const isPublic = value.toLowerCase() === "public";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#29313B] bg-[#151A21] px-2.5 py-1 text-[7px] font-bold capitalize text-[#8F9AA8]">
      <span className={`size-1.5 rounded-full ${isPublic ? "bg-emerald-400/80" : "bg-amber-400/80"}`} />

      {value}
    </span>
  );
};

VisibilityBadge.propTypes = {
  visibility: PropTypes.string,
};

const MetricItem = ({ icon: Icon, label, value }) => (
  <span title={label} className="inline-flex items-center gap-1.5 text-[8px] font-medium text-[#74808E]">
    <Icon size={10} className="shrink-0 text-[#586472]" />

    <span className="tabular-nums">{value}</span>
  </span>
);

MetricItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const BlogMetrics = ({ blog }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
    <MetricItem icon={Eye} label="Views" value={formatCount(blog?.numOfViews)} />

    <MetricItem icon={Heart} label="Likes" value={formatCount(blog?.likes)} />

    <MetricItem icon={MessageCircle} label="Comments" value={formatCount(getCommentCount(blog))} />
  </div>
);

BlogMetrics.propTypes = {
  blog: blogShape.isRequired,
};

const AuthorInformation = ({ blog }) => {
  const author = blog?.user?.name || "Admin";

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#2B333D] bg-[#181D24] text-[10px] font-black text-[#D0D5DC]">
        {getAuthorInitial(author)}

        <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-[#181D24] bg-emerald-400" />
      </span>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <UserRound size={9} className="shrink-0 text-[#66717E]" />

          <span className="truncate text-[8px] font-bold text-[#B7C0CB]">{author}</span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-[7px] text-[#5F6A77]">
          <CalendarDays size={8} className="shrink-0" />

          {getFormattedDate(blog?.createdAt)}
        </div>
      </div>
    </div>
  );
};

AuthorInformation.propTypes = {
  blog: blogShape.isRequired,
};

const BlogCard = ({ blog, index }) => {
  const palette = getPalette(index);

  const title = blog?.title || "Untitled blog";

  const description = blog?.metaDescription || "Explore this article and discover useful information, ideas and insights.";

  const isFeatured = blog?.featured || blog?.isFeatured;

  return (
    <article
      className="group/card relative flex h-full min-h-[382px] flex-col overflow-hidden rounded-[20px] border bg-[#11161D] shadow-[0_12px_32px_rgba(0,0,0,0.26)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#121820] hover:shadow-[0_22px_50px_rgba(0,0,0,0.42)]"
      style={{
        borderColor: "#262E38",
      }}
    >
      {/* Inner border */}
      <span className="pointer-events-none absolute inset-0 z-30 rounded-[20px] ring-1 ring-inset ring-white/[0.025]" />

      {/* Coloured shining line */}
      <span
        className="pointer-events-none absolute inset-x-8 top-0 z-40 h-px"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${palette.primary}30,
            ${palette.primary},
            ${palette.primary}30,
            transparent
          )`,
          boxShadow: `0 0 12px ${palette.glow}`,
        }}
      />

      {/* Matching hover border */}
      <span
        className="pointer-events-none absolute inset-0 z-20 rounded-[20px] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px ${palette.border}`,
        }}
      />

      {/* Matching hover glow */}
      <span
        className="pointer-events-none absolute -right-20 -top-20 z-20 size-44 rounded-full opacity-0 blur-[70px] transition-all duration-700 group-hover/card:scale-125 group-hover/card:opacity-100"
        style={{
          background: palette.glow,
        }}
      />

      {/* Image */}
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden border-b border-[#242C35] bg-[#0D1218]">
        <BlogImage blog={blog} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080C11]/80 via-transparent to-black/5" />

        <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
          <CategoryBadge blog={blog} palette={palette} />

          {isFeatured && <FeaturedBadge />}
        </div>

        <NavLink
          to={getBlogLink(blog)}
          aria-label={`Open ${title}`}
          className="absolute bottom-3 right-3 z-10 flex size-9 translate-y-2 items-center justify-center rounded-xl border border-white/[0.1] bg-[#0B1016]/82 text-white/65 opacity-0 shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] hover:bg-[#1A2028] hover:text-white group-hover/card:translate-y-0 group-hover/card:opacity-100"
        >
          <ArrowUpRight size={14} />
        </NavLink>
      </div>

      {/* Card content */}
      <div className="relative z-10 flex flex-1 flex-col p-3.5">
        <div className="flex items-center justify-between gap-3">
          <VisibilityBadge visibility={blog?.visibility} />

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#29313B] bg-[#151A21] px-2.5 py-1 text-[7px] font-semibold text-[#717C89]">
            <BookOpen size={8} />
            Article
          </span>
        </div>

        <NavLink to={getBlogLink(blog)} className="mt-3 block">
          <h3
            title={title}
            style={twoLineClamp}
            className="min-h-[39px] text-[13px] font-black leading-[1.48] tracking-[-0.02em] text-[#E1E5EA] transition-colors duration-300 group-hover/card:text-white"
          >
            {truncateText(title, 82)}
          </h3>
        </NavLink>

        <p style={twoLineClamp} className="mt-1.5 min-h-[31px] text-[8px] leading-[1.8] text-[#84909E]">
          {truncateText(description, 110)}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#232B34] pt-3">
          <AuthorInformation blog={blog} />

          <BlogMetrics blog={blog} />
        </div>

        {/* Previous coloured button design */}
        <div className="mt-auto pt-3">
          <NavLink
            to={getBlogLink(blog)}
            className="group/link relative flex h-9 w-full items-center justify-between overflow-hidden rounded-xl border px-3.5 text-[8px] font-black transition-all duration-300 hover:-translate-y-0.5"
            style={{
              color: palette.primary,
              background: palette.soft,
              borderColor: palette.border,
              boxShadow: `0 8px 22px ${palette.glow}`,
            }}
          >
            <span
              className="pointer-events-none absolute -left-10 top-1/2 size-20 -translate-y-1/2 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover/link:opacity-100"
              style={{
                background: palette.glow,
              }}
            />

            <span className="relative">Read full article</span>

            <span
              className="relative flex size-6 items-center justify-center rounded-lg border transition-all duration-300 group-hover/link:translate-x-0.5"
              style={{
                borderColor: palette.border,
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <ArrowUpRight size={11} />
            </span>
          </NavLink>
        </div>
      </div>
    </article>
  );
};

BlogCard.propTypes = {
  blog: blogShape.isRequired,
  index: PropTypes.number.isRequired,
};

const EmptyBlogCollection = () => (
  <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[22px] border border-dashed border-[#29323C] bg-[#0E141B] px-6 text-center">
    <span className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-white/[0.018] blur-[90px]" />

    <div className="relative">
      <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[#29323C] bg-[#11171E] text-[#687586] shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
        <BookOpen size={21} />
      </span>

      <h3 className="mt-4 text-[12px] font-black text-[#D8DEE8]">No blog records found</h3>

      <p className="mt-2 max-w-sm text-[9px] leading-5 text-[#687586]">There are currently no blog articles available to display.</p>
    </div>
  </div>
);

export const BentoCard = ({ blogs = [], startIndex = 0 }) => {
  const validBlogs = useMemo(() => (Array.isArray(blogs) ? blogs.filter(Boolean) : []), [blogs]);

  if (validBlogs.length === 0) {
    return <EmptyBlogCollection />;
  }

  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {validBlogs.map((blog, localIndex) => {
        const globalIndex = startIndex + localIndex;

        const cardKey = blog?._id || blog?.id || blog?.slug || `${blog?.title}-${globalIndex}`;

        return <BlogCard key={cardKey} blog={blog} index={globalIndex} />;
      })}
    </section>
  );
};

BentoCard.propTypes = {
  blogs: PropTypes.arrayOf(blogShape),
  startIndex: PropTypes.number,
};

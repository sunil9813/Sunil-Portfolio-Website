import { DateFormatter } from "@/components/DateFormatter";
import { truncateText } from "@/utils";
import PropTypes from "prop-types";
import { BsArrowRight } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export const BlogListCard = ({ rowData = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[28px] bg-white/[0.035] p-3 backdrop-blur-2xl">
            <div className="h-56 animate-pulse rounded-[22px] bg-white/[0.045]" />
            <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-white/[0.045]" />
            <div className="mt-4 h-16 animate-pulse rounded-2xl bg-white/[0.035]" />
          </div>
        ))}
      </div>
    );
  }

  if (!rowData?.length) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-12 text-center backdrop-blur-2xl">
        <h3 className="text-2xl font-semibold textColor">No blogs found</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 textColor opacity-60">Blogs published from your dashboard will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {rowData.map((blog, index) => (
        <BlogCard key={blog?._id || blog?.slug || index} blog={blog} featured={index === 0} />
      ))}
    </div>
  );
};

const BlogCard = ({ blog, featured }) => {
  const image = blog?.cover?.filePath || "../image/home/b1.webp";
  const category = blog?.category?.title || "Article";

  return (
    <article className={`group relative overflow-hidden rounded-[30px] bg-[#111821]/90 p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-2xl ${featured ? "md:col-span-2 lg:col-span-2" : ""}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(94,234,212,0.14),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(216,180,254,0.1),transparent_32%)] opacity-0 transition duration-500 group-hover:opacity-100"></div>

      <NavLink to={`/view-blog/${blog?.slug}`} className={`relative block overflow-hidden rounded-[24px] bg-white/[0.04] ${featured ? "h-72" : "h-56"}`}>
        <img src={image} alt={blog?.cover?.publicId || blog?.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111821] via-[#111821]/10 to-black/5"></div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
          <span className="flex h-8 max-w-[70%] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-black/35 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-xl">
            {category}
          </span>
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
            <BsArrowRight size={16} />
          </span>
        </div>
      </NavLink>

      <div className="relative flex min-h-56 flex-col px-4 pb-4 pt-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium textColor opacity-50">
          <FaRegCalendarAlt size={12} />
          <DateFormatter date={blog?.createdAt} />
        </div>

        <NavLink to={`/view-blog/${blog?.slug}`}>
          <h2 className={`${featured ? "text-2xl md:text-3xl" : "text-xl"} line-clamp-2 font-semibold leading-tight textColor transition group-hover:text-teal-200`}>
            {truncateText(blog?.title, featured ? 95 : 72)}
          </h2>
        </NavLink>

        <p className="mt-4 line-clamp-3 text-sm leading-6 textColor opacity-60">{blog?.metaDescription || "Read the full story, notes, and practical lessons inside this article."}</p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="rounded-full bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] textColor opacity-70">Read article</span>
          <NavLink to={`/view-blog/${blog?.slug}`} className="flex size-10 items-center justify-center rounded-full bg-white/[0.06] textColor transition hover:bg-white hover:text-black">
            <BsArrowRight size={15} />
          </NavLink>
        </div>
      </div>
    </article>
  );
};

BlogListCard.propTypes = {
  rowData: PropTypes.any,
  isLoading: PropTypes.bool,
};

BlogCard.propTypes = {
  blog: PropTypes.any,
  featured: PropTypes.bool,
};

import { DotBackground } from "@/components/customeUI/DotBackground";
import { Pagination } from "@/components/Pagination";
import { getallBlog } from "@/redux/slices/blogSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { BlogListCard } from "./BlogListCard";

export const BlogList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { blogs, isLoading } = useSelector((state) => state.blog);
  const { BlogList = [], total = 0 } = blogs || {};
  const activeCategory = searchParams.get("category") || "";
  const activeTag = searchParams.get("tag") || "";
  const activeFilterLabel = activeCategory || activeTag;
  const activeFilterType = activeCategory ? "category" : activeTag ? "tag" : "";

  useEffect(() => {
    dispatch(getallBlog());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeTag]);

  const filteredBlogs = useMemo(() => {
    const normalize = (value = "") => String(value).trim().toLowerCase();

    if (activeCategory) {
      return BlogList.filter((blog) => normalize(blog?.category?.title) === normalize(activeCategory));
    }

    if (activeTag) {
      return BlogList.filter((blog) => (blog?.tags || []).some((tag) => normalize(tag?.tag || tag?.title || tag?.name || tag) === normalize(activeTag)));
    }

    return BlogList;
  }, [BlogList, activeCategory, activeTag]);

  const categories = useMemo(() => {
    const values = BlogList.map((blog) => blog?.category?.title).filter(Boolean);
    return ["All Stories", ...new Set(values)].slice(0, 5);
  }, [BlogList]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category) => {
    if (category === "All Stories") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category });
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <>
      <DotBackground />
      <section className="blogs isolate overflow-hidden pb-20">
        <div className="pointer-events-none absolute -top-[18rem] left-1/2 -z-10 h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[110px]"></div>
        <div className="pointer-events-none absolute right-[-12rem] top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute left-[-10rem] top-[42rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-teal-300/10 blur-[120px]"></div>

        <div className="background">
          <div className="bg absolute left-0 top-0 z-10 opacity-65">
            <img src="../image/bg/hero-background-top.png" alt="blog background" className="h-32 object-cover md:h-44 lg:h-auto" />
          </div>
          <div className="bg absolute -top-24 left-0 blur-xl md:-top-44 lg:-top-72">
            <img src="../image/hero-background-lights.png" alt="blog lights" />
          </div>
        </div>

        <div className="absolute left-0 top-20 z-20 h-[38vh] w-full overflow-hidden opacity-55 md:top-0 lg:top-36">
          <img src="../image/bg/horzantal-line.svg" alt="blog line" className="h-full w-full object-contain" />
        </div>

        <div className="container relative z-30">
          <div className="mx-auto mb-14 mt-20 max-w-6xl text-center lg:mt-32">
            <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-200/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
              <span className="size-1.5 rounded-full bg-teal-300 shadow-[0_0_16px_rgba(94,234,212,0.9)]"></span>
              Gorkcoder Journal
            </div>

            <h1 className="gardient-text mx-auto max-w-5xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] md:text-6xl lg:text-7xl">Stories, Ideas & Build Notes For Modern Developers.</h1>
            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 textColor opacity-70 md:text-lg">
              Browse {activeFilterLabel ? filteredBlogs.length : total || BlogList.length} curated blogs spanning web development, product thinking, project lessons, design inspiration, and everyday curiosity.
            </p>

            {activeFilterLabel && (
              <div className="mx-auto mt-5 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full bg-white/[0.045] px-3 py-2 text-xs textColor ring-1 ring-white/[0.055] backdrop-blur-xl">
                <span className="rounded-full bg-teal-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-100/75">
                  Showing {activeFilterType}
                </span>
                <span className="font-normal">{activeFilterLabel}</span>
                <button type="button" onClick={clearFilter} className="rounded-full bg-white/[0.06] px-3 py-1 text-[10px] font-semibold textColor opacity-70 transition hover:bg-white/[0.1] hover:opacity-100">
                  Clear
                </button>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {categories.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleCategoryClick(item)}
                  className={`rounded-full border border-white/10 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-xl transition hover:-translate-y-0.5 ${
                    (!activeCategory && index === 0) || activeCategory === item ? "bg-white text-black" : "bg-white/[0.035] textColor opacity-75 hover:opacity-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <BlogListCard rowData={currentItems} isLoading={isLoading} />

          <div className="flexC pb-20 pt-8">{filteredBlogs.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
        </div>
      </section>
    </>
  );
};

export const CenteredLightRays = () => {
  const rays = [
    { id: 1, opacity: 0.15, scale: 0.7, rotate: 0, width: "60%" },
    { id: 2, opacity: 0.25, scale: 0.9, rotate: 25, width: "90%" },
    { id: 3, opacity: 0.36, scale: 0.74, rotate: 11, width: "85%" },
    { id: 4, opacity: 1, scale: 1, rotate: -12, width: "100%" },
    { id: 5, opacity: 1, scale: 1, rotate: -24, width: "100%" },
    { id: 6, opacity: 0.16, scale: 0.67, rotate: -18, width: "75%" },
    { id: 7, opacity: 0.16, scale: 0.68, rotate: -18, width: "76%" },
    { id: 8, opacity: 0.16, scale: 0.68, rotate: -18, width: "76%" },
    { id: 9, opacity: 0.19, scale: 0.74, rotate: -5, width: "82%" },
    { id: 10, opacity: 0.19, scale: 0.75, rotate: -5, width: "83%" },
    { id: 11, opacity: 0.66, scale: 0.76, rotate: -5, width: "84%" },
    { id: 12, opacity: 1, scale: 1, rotate: -3, width: "100%" },
    { id: 13, opacity: 1, scale: 1, rotate: 18, width: "100%" },
    { id: 14, opacity: 1, scale: 1, rotate: 6, width: "100%" },
  ];

  return (
    <div className="light-rays-container">
      <div className="rays-blur">
        {rays.map((ray) => (
          <div
            key={ray.id}
            className="ray"
            style={{
              opacity: ray.opacity,
              transform: `scale(${ray.scale}) rotate(${ray.rotate}deg)`,
              width: ray.width,
              left: "-30%",
              top: "-90%",
            }}
          />
        ))}
        <div className="light-source" />
      </div>
    </div>
  );
};

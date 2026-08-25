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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (category) => {
    if (category === "All Stories") {
      setSearchParams({});
      return;
    }

    setSearchParams({
      category,
    });
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  return (
    <>
      <DotBackground />

      <section className="blogs   isolate overflow-hidden bg-[#0D1218] pb-20">
        {/* ==================================================== */}
        {/* BASE BACKGROUND                                      */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-0 -z-40 bg-[#0D1218]"></div>

        <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(180deg,#0D1218_0%,#10151C_28%,#10151C_66%,#0E141A_100%)]"></div>

        {/* ==================================================== */}
        {/* PREMIUM TOP ATMOSPHERE                               */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[900px] overflow-hidden">
          {/* purple crown */}

          <div className="absolute left-1/2 top-[-390px] h-[760px] w-[1340px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22)_0%,rgba(124,58,237,0.105)_27%,rgba(99,102,241,0.042)_50%,rgba(76,29,149,0.014)_67%,transparent_80%)] blur-[120px]"></div>

          {/* soft center indigo */}

          <div className="absolute left-1/2 top-[-25px] h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.085)_0%,rgba(129,140,248,0.035)_40%,transparent_74%)] blur-[125px]"></div>

          {/* left teal atmosphere */}

          <div className="absolute -left-[210px] top-[170px] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.085)_0%,rgba(20,184,166,0.027)_43%,transparent_74%)] blur-[145px]"></div>

          {/* right pink transition */}

          <div className="absolute right-[3%] top-[100px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.05)_0%,rgba(217,70,239,0.018)_45%,transparent_74%)] blur-[140px]"></div>

          {/* warm peach highlight */}

          <div className="absolute -right-[150px] top-[260px] h-[470px] w-[470px] rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.06)_0%,rgba(251,146,60,0.018)_44%,transparent_74%)] blur-[135px]"></div>
        </div>

        {/* ==================================================== */}
        {/* CENTER HERO HALO                                     */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute left-1/2 top-[300px] -z-10 h-[520px] w-[1050px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.055)_0%,rgba(240,171,252,0.022)_35%,rgba(15,21,27,0)_72%)] blur-[100px]"></div>

        {/* ==================================================== */}
        {/* SOFT HERO → BLOG TRANSITION                          */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute left-1/2 top-[560px] -z-10 h-[500px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,rgba(45,212,191,0.018)_42%,transparent_72%)] blur-[120px]"></div>

        {/* ==================================================== */}
        {/* LOWER BACKGROUND CONTINUATION                        */}
        {/* ==================================================== */}

        <div className="pointer-events-none absolute inset-x-0 top-[690px] -z-20 h-[1700px] overflow-hidden">
          <div className="absolute -left-[350px] top-[20px] h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.075)_0%,rgba(20,184,166,0.023)_44%,transparent_74%)] blur-[180px]"></div>

          <div className="absolute left-1/2 top-[160px] h-[760px] w-[1250px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.032)_0%,rgba(99,102,241,0.012)_46%,transparent_76%)] blur-[175px]"></div>

          <div className="absolute -right-[370px] top-[360px] h-[920px] w-[920px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.065)_0%,rgba(236,72,153,0.018)_44%,transparent_74%)] blur-[185px]"></div>

          <div className="absolute left-[3%] top-[980px] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.045)_0%,rgba(20,184,166,0.012)_45%,transparent_74%)] blur-[190px]"></div>
        </div>

        {/* ==================================================== */}
        {/* ORIGINAL BACKGROUND ASSETS                           */}
        {/* ==================================================== */}

        <div className="background">
          <div className="bg absolute left-0 top-0 z-10 opacity-45">
            <img src="../image/bg/hero-background-top.png" alt="blog background" className="h-32 object-cover md:h-44 lg:h-auto" />
          </div>

          <div className="bg absolute -top-24 left-0 opacity-60 blur-xl md:-top-44 lg:-top-72">
            <img src="../image/hero-background-lights.png" alt="blog lights" />
          </div>
        </div>

        {/* ==================================================== */}
        {/* ORIGINAL HORIZONTAL LINE                             */}
        {/* ==================================================== */}

        <div className="absolute left-0 top-20 z-20 h-[38vh] w-full overflow-hidden opacity-28 md:top-0 lg:top-36">
          <img src="../image/bg/horzantal-line.svg" alt="blog line" className="h-full w-full object-contain" />
        </div>

        {/* ==================================================== */}
        {/* LIGHT DETAILS                                        */}
        {/* ==================================================== */}

        <span className="pointer-events-none absolute left-[9%] top-[250px] z-20 h-1.5 w-1.5 rounded-full bg-teal-300/65 shadow-[0_0_18px_rgba(94,234,212,0.6)]"></span>

        <span className="pointer-events-none absolute right-[12%] top-[300px] z-20 h-1.5 w-1.5 rounded-full bg-orange-200/60 shadow-[0_0_17px_rgba(253,186,116,0.5)]"></span>

        <span className="pointer-events-none absolute left-[28%] top-[455px] z-20 h-1 w-1 rounded-full bg-violet-300/60 shadow-[0_0_14px_rgba(196,181,253,0.52)]"></span>

        <span className="pointer-events-none absolute right-[28%] top-[540px] z-20 h-1 w-1 rounded-full bg-fuchsia-300/40 shadow-[0_0_12px_rgba(240,171,252,0.42)]"></span>

        {/* ==================================================== */}
        {/* CONTENT                                              */}
        {/* ==================================================== */}

        <div className="container relative z-30">
          {/* ================================================== */}
          {/* BLOG HERO                                          */}
          {/* ================================================== */}

          <div className="relative mx-auto mb-12 mt-20 max-w-[1180px] text-center lg:mt-32">
            {/* eyebrow */}

            <div className="mb-7 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-violet-200/30"></span>

              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-[#151521]/55 px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_11px_rgba(94,234,212,0.55)]"></span>

                <span className="text-[8px] font-semibold uppercase tracking-[0.24em] text-white/48">Gorkcoder Journal</span>
              </div>

              <span className="h-px w-10 bg-gradient-to-l from-transparent to-orange-200/25"></span>
            </div>

            {/* ================================================= */}
            {/* HERO HEADING                                      */}
            {/* ================================================= */}

            <div className="relative mx-auto max-w-[1080px]">
              <h1 className="text-[42px] font-medium leading-[0.95] tracking-[-0.06em] text-white sm:text-[52px] md:text-[66px] lg:text-[78px]">
                <span className="block">
                  <span className="relative inline-flex overflow-hidden rounded-[14px] border border-white/[0.065] bg-[linear-gradient(135deg,rgba(196,181,253,0.105),rgba(240,171,252,0.065),rgba(253,186,116,0.045))] px-4 py-1.5 shadow-[0_14px_38px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl sm:px-5 md:px-6">
                    <span className="pointer-events-none absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>

                    <span className="pointer-events-none absolute inset-x-5 bottom-0 h-8 bg-violet-300/[0.04] blur-[20px]"></span>

                    <span className="relative bg-gradient-to-r from-[#c4b5fd] via-[#f0abfc] to-[#fdba74] bg-clip-text text-transparent">Stories</span>
                  </span>{" "}
                  <span className="text-white">from</span>
                </span>

                <span className="mt-1 block text-white">building real digital products.</span>
              </h1>
            </div>

            {/* ================================================= */}
            {/* DESCRIPTION                                       */}
            {/* ================================================= */}

            <p className="mx-auto mt-6 max-w-[760px] text-[13px] font-medium leading-7 text-white/52 sm:text-[14px] md:text-[16px] md:leading-8">
              Practical thoughts on development, design, product decisions, project lessons, and the process behind building better digital experiences.
            </p>

            {/* ================================================= */}
            {/* ACTIVE FILTER                                     */}
            {/* ================================================= */}

            {activeFilterLabel && (
              <div className="mx-auto mt-5 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl">
                <span className="rounded-full bg-teal-300/[0.08] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-teal-100/70">{activeFilterType}</span>

                <span className="px-1 text-[10px] font-medium text-white/48">{activeFilterLabel}</span>

                <button
                  type="button"
                  onClick={clearFilter}
                  className="flex h-7 items-center rounded-full border border-white/[0.05] bg-white/[0.025] px-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/35 transition-all duration-300 hover:border-white/[0.10] hover:bg-white/[0.06] hover:text-white/70"
                >
                  Clear
                </button>
              </div>
            )}

            {/* ================================================= */}
            {/* CATEGORY FILTER                                   */}
            {/* ================================================= */}

            <div className="relative mx-auto mt-7 max-w-[1050px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/[0.022] blur-[45px]"></div>

              <div className="relative flex flex-wrap items-center justify-center gap-2.5">
                {categories.map((item, index) => {
                  const isActive = (!activeCategory && index === 0) || activeCategory === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleCategoryClick(item)}
                      className={`group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border px-5 text-[8px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl transition-all duration-300 ${
                        isActive
                          ? "border-white bg-white text-[#101318] shadow-[0_12px_30px_rgba(255,255,255,0.08)]"
                          : "border-white/[0.07] bg-white/[0.018] text-white/35 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white/65"
                      }`}
                    >
                      {!isActive && <span className="h-1 w-1 rounded-full bg-violet-300/45 transition-all duration-300 group-hover:bg-teal-300/70"></span>}

                      {item}

                      {isActive && <span className="h-1 w-1 rounded-full bg-teal-500/70"></span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================================================== */}
          {/* BLOG CARDS - UNCHANGED                             */}
          {/* ================================================== */}

          <BlogListCard rowData={currentItems} isLoading={isLoading} />

          {/* ================================================== */}
          {/* PAGINATION                                         */}
          {/* ================================================== */}

          <div className="flexC pb-20 pt-8">{filteredBlogs.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
        </div>
      </section>
    </>
  );
};

/* ========================================================== */
/* CENTER LIGHT RAYS - LOGIC UNCHANGED                        */
/* ========================================================== */

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

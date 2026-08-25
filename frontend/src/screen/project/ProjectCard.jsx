import { HeadingThree, InputLabel, InputTitle } from "@/components/customeUI/Title";
import { getAllProject } from "@/redux/slices/projectSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateGradientBackground, generateItemColor, getIconUrls, getRandomGradient, truncateText } from "../../utils";
import { NavLink } from "react-router";
import { Pagination } from "@/components/Pagination";
import { BsArrowRight } from "react-icons/bs";
import { CustomDropdown } from "@/components/ui/CustomDropdown";

export const ProjectCard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accessFilter, setAccessFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { projects, isLoading } = useSelector((state) => state.project);
  const { posts = [] } = projects || {};
  const projectPosts = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, accessFilter, sortBy]);

  const categoryOptions = useMemo(() => {
    return [...new Set(projectPosts.map((project) => project?.category?.title).filter(Boolean))];
  }, [projectPosts]);

  const getProjectPrice = (project) => Number(project?.price || 0);
  const getProjectViews = (project) => (Array.isArray(project?.views) ? project.views.length : Number(project?.views || 0));

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projectPosts
      .filter((project) => {
        const title = project?.title?.toLowerCase() || "";
        const description = project?.metaDescription?.toLowerCase() || "";
        const category = project?.category?.title || "";
        const formats =
          project?.formats
            ?.map((item) => item?.format)
            .join(" ")
            .toLowerCase() || "";
        const matchesSearch = !query || title.includes(query) || description.includes(query) || formats.includes(query);
        const matchesCategory = categoryFilter === "all" || category === categoryFilter;
        const price = getProjectPrice(project);
        const matchesAccess = accessFilter === "all" || (accessFilter === "free" ? price === 0 : price > 0);

        return matchesSearch && matchesCategory && matchesAccess;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return getProjectViews(b) - getProjectViews(a);
        if (sortBy === "free") return getProjectPrice(a) - getProjectPrice(b);
        if (sortBy === "paid") return getProjectPrice(b) - getProjectPrice(a);
        if (sortBy === "price-low") return getProjectPrice(a) - getProjectPrice(b);
        if (sortBy === "price-high") return getProjectPrice(b) - getProjectPrice(a);
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      });
  }, [accessFilter, categoryFilter, projectPosts, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setAccessFilter("all");
    setSortBy("newest");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <ProjectFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        accessFilter={accessFilter}
        setAccessFilter={setAccessFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryOptions={categoryOptions}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="projects mx-auto grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`relative z-10 mb-5 ${getBentoClass(index)}`}>
              <div className="rounded-[1.7rem] bg-white/[0.025] p-3 shadow-[0_22px_70px_rgba(0,0,0,.20)] backdrop-blur-3xl">
                <div className="h-60 animate-pulse rounded-[1.3rem] bg-white/[0.045]" />
                <div className="mt-5 h-28 animate-pulse rounded-2xl bg-white/[0.035]" />
              </div>
            </div>
          ))}
        </div>
      ) : currentItems.length > 0 ? (
        <div className="projects grid grid-cols-1 items-stretch gap-7 md:grid-cols-2 xl:grid-cols-6">
          {currentItems.map((project, index) => {
            return <ProjectCardDesignFrist key={project?._id || project?.slug} project={project} index={index} />;
          })}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.035] p-10 text-center shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-300/[0.08] blur-3xl"></div>
          <div className="relative">
            <p className="mx-auto mb-4 inline-flex rounded-full bg-white/[0.05] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-100/65">No matches</p>
            <HeadingThree>No projects found</HeadingThree>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 textColor opacity-60">
              Try a different keyword, category, or pricing filter. Projects added from the dashboard will appear here automatically.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-white px-6 py-3 text-xs font-semibold text-[#071319] shadow-[0_14px_35px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
      <div className="flexC mt-10">{filteredPosts.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
    </>
  );
};

const getBentoClass = (index = 0) => {
  const pattern = ["xl:col-span-4", "xl:col-span-2", "xl:col-span-3", "xl:col-span-3", "xl:col-span-2", "xl:col-span-2", "xl:col-span-2"];

  return pattern[index % pattern.length];
};

const ProjectFilters = ({ searchTerm, setSearchTerm, categoryFilter, setCategoryFilter, accessFilter, setAccessFilter, sortBy, setSortBy, categoryOptions, onReset }) => {
  const categoryOptionsList = [{ value: "all", label: "All categories" }, ...categoryOptions.map((category) => ({ value: category, label: category }))];
  const accessOptions = [
    { value: "all", label: "All access" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Popular" },
    { value: "free", label: "Free first" },
    { value: "paid", label: "Paid first" },
    { value: "price-low", label: "Price low" },
    { value: "price-high", label: "Price high" },
  ];

  return (
    <div className="relative z-[90] mb-10 rounded-[1.7rem] bg-[#121820]/66 p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-[28px]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects, stacks, layouts..."
            autoComplete="off"
            className="h-12 w-full rounded-full px-5 text-sm font-normal text-white/75 outline-none bg-white/10 backdrop-blur-2xl transition placeholder:text-white/35 focus:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(150px,1fr)_minmax(130px,1fr)_minmax(120px,1fr)_auto] lg:w-auto">
          <CustomDropdown value={categoryFilter} onChange={setCategoryFilter} options={categoryOptionsList} />
          <CustomDropdown value={accessFilter} onChange={setAccessFilter} options={accessOptions} />
          <CustomDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
          <button
            type="button"
            onClick={onReset}
            className="flex h-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFFFFF_0%,#E8E8E8_100%)] px-12 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow-[inset_0_1px_0_rgba(255,255,255,.8),inset_0_-10px_18px_rgba(0,0,0,.12),0_16px_36px_rgba(255,255,255,.10)] transition hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,.9),inset_0_-10px_18px_rgba(0,0,0,.14),0_22px_46px_rgba(255,255,255,.16)]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProjectCardDesignFrist = ({ project, index = 0 }) => {
  const price = Number(project?.price || 0);
  const hasDiscount = Number(project?.discount || 0) > 0;
  const formatCount = project?.formats?.length || 0;
  const accent = generateGradientBackground(project?.title);
  const displayPrice = price > 0 ? `$ ${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "Free";
  const coverImage = project?.thumbnail?.filePath || project?.thumbnail?.url || "../image/home/b1.webp";
  const bentoClass = getBentoClass(index);
  const isFeatureCard = index % 7 === 0;
  const isWideCard = bentoClass.includes("xl:col-span-4") || bentoClass.includes("xl:col-span-3");

  return (
    <div className={`group relative z-10 h-full ${bentoClass}`} key={project?._id}>
      <div className="absolute inset-x-10 -bottom-5 h-16 rounded-full bg-[#335240]/20 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"></div>

      <article
        className={`relative flex h-full flex-col overflow-hidden rounded-[1.8rem] bg-[#11171d]/78 p-3 shadow-[0_22px_70px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,.025)] backdrop-blur-2xl transition duration-500 group-hover:-translate-y-1 group-hover:bg-[#121b20]/88 group-hover:shadow-[0_32px_95px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,.035)] ${
          isFeatureCard ? "min-h-[430px]" : "min-h-[462px]"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[radial-gradient(circle_at_78%_0%,rgba(51,82,64,.13),transparent_30%),radial-gradient(circle_at_6%_100%,rgba(61,220,255,.045),transparent_36%),linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.006)_38%,rgba(0,0,0,.14))]"></div>
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full opacity-[0.05] blur-2xl transition duration-500 group-hover:opacity-[0.09]"
          style={{ background: accent }}
        ></div>

        <div className="relative flex h-full flex-col">
          <NavLink to={`/project-details/${project?.slug}`} className="block">
            <div
              className={`relative overflow-hidden rounded-[1.38rem] bg-[#0c1418] shadow-[inset_0_1px_0_rgba(255,255,255,.045),0_16px_42px_rgba(0,0,0,.26)] ${
                isWideCard ? "h-60 lg:h-[270px]" : "h-56 lg:h-[238px]"
              }`}
            >
              <img
                src={coverImage}
                alt={project?.thumbnail?.publicId || project?.title || "Project preview"}
                className="h-full w-full object-cover opacity-[0.82] transition duration-700 group-hover:scale-[1.04] group-hover:opacity-[0.96]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#081117] via-[#081117]/30 to-black/10"></div>
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#081117] to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
                <InputLabel className="flex h-8 max-w-[62%] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-[#071018]/72 px-4 text-center text-[9px] capitalize text-white/82 shadow-[inset_0_1px_0_rgba(255,255,255,.065),0_8px_24px_rgba(0,0,0,.18)] backdrop-blur-xl">
                  {project?.category?.title || "Project"}
                </InputLabel>
                {hasDiscount ? (
                  <InputTitle className="flex h-8 shrink-0 items-center justify-center rounded-full bg-white/90 px-4 text-center text-[9px] gardient-text2 shadow-[0_10px_30px_rgba(255,255,255,.10)]">
                    {project?.discount}% off
                  </InputTitle>
                ) : (
                  <InputTitle className="flex h-8 shrink-0 items-center justify-center rounded-full bg-[#071018]/78 px-4 text-center text-[10px] font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,.065),0_8px_24px_rgba(0,0,0,.18)] backdrop-blur-xl">
                    {displayPrice}
                  </InputTitle>
                )}
              </div>
            </div>
          </NavLink>

          <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
            <div className="flex items-start justify-between gap-3">
              <NavLink to={`/project-details/${project?.slug}`} className="min-w-0">
                <HeadingThree
                  className={`line-clamp-2 min-h-[46px] font-semibold leading-6 tracking-[-0.02em] text-white/92 transition group-hover:text-white ${isWideCard ? "text-[19px]" : "text-[17px]"}`}
                >
                  {truncateText(project?.title, isWideCard ? 78 : 58)}
                </HeadingThree>
              </NavLink>
              <NavLink
                to={`/project-details/${project?.slug}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] textColor shadow-[inset_0_1px_0_rgba(255,255,255,.05)] transition duration-300 group-hover:bg-white/90 group-hover:text-[#101923]"
              >
                <BsArrowRight size={15} />
              </NavLink>
            </div>

            <p className="mt-3 line-clamp-3 min-h-[56px] text-[11.5px] leading-6 textColor opacity-60">
              {project?.metaDescription || "Explore this project with full details, preview, resources, and implementation notes."}
            </p>

            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center pl-3">
                  {project?.formats?.slice(0, 6).map((format, index) => {
                    const iconName = format?.format?.toLowerCase() || "unknown";
                    const label = format?.format || "Unknown";
                    return (
                      <div
                        className="img size-6 flexC -ml-2.5 rounded-full bg-[#17222d]/92 shadow-[0_8px_18px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:z-10 hover:scale-110"
                        key={format?._id || `${label}-${index}`}
                      >
                        {iconName && <IconWithFallback value={iconName} alt={`${label} icon`} className="h-full w-full object-contain p-1.5 hover:cursor-pointer" />}
                      </div>
                    );
                  })}
                  {formatCount > 6 && <span className="ml-1 text-[10px] textColor opacity-50">+{formatCount - 6}</span>}
                </div>

                <InputLabel className="flex h-7 max-w-[48%] shrink-0 items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-white/[0.045] px-3.5 text-center text-[9px] capitalize tracking-normal textColor opacity-76 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] backdrop-blur-xl">
                  {project?.layout || "Custom"} Layout
                </InputLabel>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export const ProjectCardDesignSecond = ({ project }) => {
  return (
    <>
      <div className="rounded-2xl flex justify-between bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl" key={project?._id}>
        <div className="rounded-l-2xl h-96 w-1/2 pr-10 pt-10 relative" style={{ background: getRandomGradient() }}>
          <div className="absolute top-0 left-0 bg-noise w-full h-full opacity-5">
            {/* <img src="https://rainbowit.net/splash/html/nuron/assets/images/bg/noise.gif" alt="" className="w-full h-full object-cover" /> */}
          </div>
          <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover rounded-tr-2xl shadow-xl" />
        </div>
        <div className="details p-10 relative z-50 w-1/2">
          <div className="flex justify-between mb-5">
            <div className="relative">
              <span className="px-5 h-7 bg-slate-500/5 backdrop-blur-xl flexC rounded-full capitalize text-white" style={{ backgroundColor: generateItemColor(project?.title) }}>
                {project?.category?.title}
              </span>
            </div>
            <div className="flex flex-col justify-between">
              {project?.discount !== 0 ? (
                <InputTitle className="gardient-text2 text-xl font-semibold">{project?.discount}% off</InputTitle>
              ) : (
                <InputTitle className="textColor text-xl font-semibold">${project?.price}</InputTitle>
              )}
            </div>
          </div>
          <NavLink to={`/project-details/${project?.slug}`}>
            <h2 className="text-3xl textColor capitalize leading-snug">{truncateText(project?.title, 55)} </h2>
          </NavLink>
          <p className="my-4">{project?.metaDescription}</p>

          <span className=" capitalize">{project?.layout} Layout</span>
          <div className="flex items-center ml-4 pt-4">
            {project?.formats?.slice(0, 6).map((format) => {
              const iconName = format?.format?.toLowerCase() || "unknown";
              const label = format?.format || "Unknown";
              return (
                <div className="img size-10 bg-white/60 backdrop-blur-2xl flexC rounded-full -ml-5" key={format?._id || Math.random()}>
                  {iconName && <IconWithFallback value={iconName} alt={`${label} icon`} className="w-full h-full object-contain p-2 hover:z-10 focus:z-10 hover:cursor-pointer" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const IconWithFallback = ({ value, alt, className }) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const urls = getIconUrls(value);

  const handleError = (e) => {
    if (urlIndex < urls.length - 1) {
      setUrlIndex(urlIndex + 1);
    } else {
      e.target.style.display = "none";
    }
  };

  return <img src={urls[urlIndex]} alt={alt} className={className} onError={handleError} />;
};

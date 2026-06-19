import { HeadingThree, InputLabel, InputTitle } from "@/components/customeUI/Title";
import { getAllProject } from "@/redux/slices/projectSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateGradientBackground, generateItemColor, getIconUrls, getRandomGradient, truncateText } from "../../utils";
import { NavLink } from "react-router";
import { Pagination } from "@/components/Pagination";

export const ProjectCard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items per page

  const { projects } = useSelector((state) => state.project);
  const { posts } = projects;

  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil(posts?.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {currentItems?.map((project) => {
          return <ProjectCardDesignFrist project={project} />;
        })}
      </div>
      <div className="flexC mt-10">{posts?.length > itemsPerPage && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}</div>
    </>
  );
};

export const ProjectCardDesignFrist = ({ project }) => {
  return (
    <>
      <div className="relative z-10 mb-5" key={project?._id}>
        <div className="rounded-2xl p-3 bg-[rgba(0,0,0,0.03)] backdrop-blur-3xl">
          <div className="rounded-2xl lg:h-56 h-44">
            <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div className="details p-3 h-24 relative z-50">
            <div className="flexI justify-between">
              <NavLink to={`/project-details/${project?.slug}`}>
                <HeadingThree>{truncateText(project?.title, 25)}</HeadingThree>
              </NavLink>
              {project?.discount !== 0 ? (
                <InputTitle className="gardient-text2 ">{project?.discount}% off</InputTitle>
              ) : (
                <InputTitle className="text-black dark:text-white">${project?.price}</InputTitle>
              )}
            </div>
            <span className=" capitalize">{project?.layout} Layout</span>
            <div className="flex justify-between items-center">
              <div className="flex items-center ml-3 pt-2">
                {project?.formats?.slice(0, 6).map((format) => {
                  const iconName = format?.format?.toLowerCase() || "unknown";
                  const label = format?.format || "Unknown";
                  return (
                    <div className="img size-7 bg-slate-500/10 backdrop-blur-2xl flexC rounded-full -ml-3" key={format?._id || Math.random()}>
                      {iconName && <IconWithFallback value={iconName} alt={`${label} icon`} className="w-full h-full object-contain p-1.5 hover:z-10 focus:z-10 hover:cursor-pointer" />}
                    </div>
                  );
                })}
              </div>
              <div className="relative">
                <InputLabel className="px-5 h-7 bg-slate-500/5 backdrop-blur-xl flexC rounded-full capitalize text-xs lg:text-sm">{project?.category?.title}</InputLabel>
              </div>
            </div>
          </div>
        </div>
        <div className="overlay-card w-[90%] mx-5 h-56 absolute -bottom-2 left-0 rounded-2xl -z-20 bg-[rgba(255,255,255,0.1)] backdrop-blur-3xl"></div>
        <div
          className="overlay-card w-[80%] mx-10 h-56 absolute -bottom-4 left-0 rounded-2xl -z-30 bg-[rgba(255,255,255,0.1)] opacity-30"
          style={{ background: generateGradientBackground(project?.title) }}
        ></div>
        {/* <div className="overlay-card w-[90%] mx-5 h-56 absolute -bottom-5 left-0 rounded-2xl -z-30 bg-[rgba(255,255,255,0.1)] opacity-20" style={{ background: getRandomGradient() }}></div> */}
        {/* <div className="overlay-card w-[90%] mx-5 h-56 absolute -bottom-5 left-0 rounded-2xl -z-30 bg-[rgba(255,255,255,0.1)] opacity-20" style={{ background: getRandomGradient() }}></div> */}
      </div>
    </>
  );
};

export const ProjectCardDesignSecond = ({ project }) => {
  return (
    <>
      <div className="rounded-2xl flex justify-between bg-[rgba(255,255,255,0.03)] backdrop-blur-3xl" key={project?._id}>
        <div className="rounded-l-2xl h-96 w-1/2 pr-10 pt-10 relative" style={{ background: getRandomGradient() }}>
          <div class="absolute top-0 left-0 bg-noise w-full h-full opacity-5">
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

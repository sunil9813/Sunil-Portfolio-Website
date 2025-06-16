import { InputLabel, InputTitle } from "@/components/customeUI/Title";
import { getAllProject } from "@/redux/slices/projectSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIconUrls, getRandomTransform, truncateText } from "../../utils";
import { NavLink } from "react-router";

export const ProjectCard = () => {
  const dispatch = useDispatch();
  const [projectTransforms, setProjectTransforms] = useState({});

  const { projects } = useSelector((state) => state.project);
  const { posts } = projects;

  useEffect(() => {
    dispatch(getAllProject());
  }, [dispatch]);

  // Generate random rotations when posts are loaded
  useEffect(() => {
    if (posts?.length) {
      const transforms = {};
      posts.forEach((project) => {
        transforms[project._id] = Array(3)
          .fill()
          .map(() => getRandomTransform());
      });
      setProjectTransforms(transforms);
    }
  }, [posts]);
  //assets
  return (
    <>
      <div className="projects grid grid-cols-4 gap-5">
        {posts?.map((project) => {
          const transforms =
            projectTransforms[project._id] ||
            Array(3)
              .fill()
              .map(() => getRandomTransform());
          return (
            <div className="project rounded-2xl relative" key={project?._id}>
              <div className="-z-10 absolute top-0 left-5 p-5">
                <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full object-cover p-2" />
              </div>
              <div className="item z-10 rounded-2xl bg-slate-700/10 backdrop-blur-3xl">
                <div className="assets h-44">
                  {project?.assets?.length !== 3 ? (
                    <div className="rounded-2xl p-1 h-44">
                      <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                  ) : (
                    <>
                      <div className="asset-images rounded-2xl">
                        {project?.assets?.slice(0, 3).map((asset, index) => {
                          const t = transforms[index];
                          return (
                            <div
                              key={asset?.publicId}
                              style={{
                                "--tx": `${t.translateX}px`,
                                "--ty": `${t.translateY}px`,
                                "--rotate": `${t.rotation}deg`,
                                "--scale": t.scale,
                                "--hover-tx": `${t.hoverTranslateX}px`,
                                "--hover-ty": `${t.hoverTranslateY}px`,
                                "--hover-rotate": `${t.hoverRotation}deg`,
                              }}
                              className="asset-image"
                            >
                              <img src={asset?.filePath} alt={asset?.publicId} className="w-full h-full object-cover rounded-2xl" />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
                <div className="details p-3 relative z-50">
                  <div className="flexI justify-between">
                    <NavLink to={`/project-details/${project?.slug}`}>
                      <InputTitle className="heading-gardient">{truncateText(project?.title, 20)}</InputTitle>
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
                      <div className="-z-10 absolute bottom-0 right-0 m-auto rounded-full w-14 h-3">
                        <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-14 h-3 object-cover rounded-full blur-md" />
                      </div>
                      <InputLabel className="px-5 h-7 bg-slate-500/5 backdrop-blur-xl flexC rounded-full capitalize">{project?.category?.title}</InputLabel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { getProjectPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { FavoriteButton, HeadingThree, LikeButton, RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect, useMemo, useState } from "react";
import { FaCloudDownloadAlt, FaComments } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { VscVerifiedFilled } from "react-icons/vsc";
import { generateItemColor } from "@/utils";
import { BiSolidChevronRight } from "react-icons/bi";
import { IoCheckmarkCircle, IoCloudDownloadOutline, IoEye } from "react-icons/io5";
import { IconWithFallback } from "./ProjectToolsSection";
import { Switch } from "@material-tailwind/react";
import { ActionButton } from "@/components/customeUI/Button";

export const ProjectDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { project, isLoading } = useSelector((state) => state.project);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);
  const userId = user?._id;

  // Local state for switches and their loading states
  const [localVisibility, setLocalVisibility] = useState(project?.visibility || "private");
  const [localFeatured, setLocalFeatured] = useState(project?.featured || false);

  const isFavorited = useMemo(() => favoriteResource?.Project?.some((fav) => fav._id === project?._id), [favoriteResource, project?._id]);
  const likeCount = useMemo(() => {
    return likeState.likeCounts["project"]?.[project?._id] ?? project?.likes?.length ?? 0;
  }, [likeState, project?._id, project?.likes]);

  // Initial fetch of project details
  useEffect(() => {
    dispatch(getProjectPrivate(slug));
  }, [slug, dispatch]);

  // Fetch user's favorite resources
  useEffect(() => {
    dispatch(getUserFavorite(userId));
  }, [dispatch, userId]);

  // Sync local state with Redux state when project changes
  useEffect(() => {
    if (project) {
      setLocalVisibility(project.visibility);
      setLocalFeatured(project.featured);
    }
  }, [project]);

  const handleVisibilityToggle = async (projectId, newVisibility) => {
    try {
      setLocalVisibility(newVisibility);
      await dispatch(updateVisibility({ projectId, visibility: newVisibility })).unwrap();
    } catch (error) {
      toast.error("Failed to update visibility:", error);
      setLocalVisibility(project.visibility);
    }
  };

  const handleFeaturedToggle = async (projectId, newFeatured) => {
    try {
      setLocalFeatured(newFeatured);
      await dispatch(updateFeaturedStatus({ projectId, featured: newFeatured })).unwrap();
    } catch (error) {
      toast.error("Failed to update featured status:", error);
      setLocalFeatured(project.featured);
    }
  };

  const handleFilterClick = (filterType, value) => {
    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <Wrapper className="relative">
      {/* Header Skeleton */}

      <div className="top-header relative h-[40vh] rounded-t-3xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

      {/* Title and description skeleton */}
      <div className="title-desc w-full px-8 py-3">
        <div className="flex justify-between items-center gap-5 mb-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6"></div>

        {/* User and category skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Images skeleton */}
      <div className="p-8">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-96 3xl:h-[500px] rounded-3xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          ))}
        </div>

        {/* Download section skeleton */}
        <div className="flex justify-between items-center my-5 p-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse h-16"></div>

        {/* Content skeleton */}
        <div className="flex justify-between gap-3 px-16">
          <div className="w-2/3">
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
            ))}
          </div>
          <div className="w-1/3">
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-2 mb-3">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Wrapper className="relative">
        <div className="top-header relative h-[40vh] rounded-t-3xl overflow-hidden">
          <div className="h-[40vh] rounded-t-3xl w-full">
            <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover rounded-t-3xl" />
          </div>
          <div className="bg-gradient-to-b h-[40vh] absolute top-0 left-0 w-full rounded-t-3xl bg-light-surface1/90 dark:bg-dark-surface1/95"> </div>
          <div className=" absolute top-0 right-0 m-8">
            <FavoriteButton resourceType="Project" resourceId={project?._id} initialFavorited={isFavorited} />
          </div>

          <div className="title-desc w-full absolute bottom-0 px-8 py-3">
            <div className="flex justify-between items-center gap-5 absolute top-8 right-0 m-8 z-10">
              <div>
                <Switch
                  id="visibility-switch"
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  label={localVisibility === "public" ? "Public" : "Private"}
                  checked={localVisibility === "public"}
                  onChange={() => handleVisibilityToggle(project?._id, localVisibility === "public" ? "private" : "public")}
                  containerProps={{ className: "w-11 h-6" }}
                  labelProps={{ className: "text-white font-normal capitalize" }}
                  circleProps={{ className: "before:hidden left-0.5 border-none" }}
                />
              </div>
              <div>
                <Switch
                  id="featured-switch"
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  label={localFeatured === true ? "Featured In Home" : "None"}
                  checked={localFeatured === true}
                  onChange={() => handleFeaturedToggle(project?._id, !localFeatured)}
                  containerProps={{ className: "w-11 h-6" }}
                  labelProps={{ className: "text-white font-normal capitalize" }}
                  circleProps={{ className: "before:hidden left-0.5 border-none" }}
                />
              </div>
            </div>

            <div className="flex items-center">
              <h1 className="textColor text-xl 3xl:text-2xl capitalize py-4">{project?.title}</h1>
              <VscVerifiedFilled size={20} className="text-green-400" />
            </div>
            <p className="textColor text-xs opacity-70">{project?.metaDescription}</p>
            <div className="flex items-center justify-between mt-5">
              <div className="flexC gap-1">
                <div>
                  {project?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                    <div
                      className="font-semibold capitalize w-5 h-5 3xl:w-7 3xl:h-7 rounded-full flex justify-center items-center text-white text-xs"
                      style={{
                        background: generateItemColor(project?.user?.name || project?.name || "X"),
                      }}
                    >
                      {(project?.user?.name?.charAt(0) || project?.name?.charAt(0)) ?? "?"}
                    </div>
                  ) : (
                    <div className=" w-5 h-5 3xl:w-7 3xl:h-7 rounded-full">
                      <img
                        src={project?.user?.avatar?.url || project?.avatar?.url}
                        alt={project?.user?.avatar?.publicId || project?.avatar?.publicId}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs textColor opacity-70 capitalize">{project?.user?.name || project?.name}</span>
                <BiSolidChevronRight className="textColor opacity-30" />
                <span className="text-xs textColor opacity-70 capitalize cursor-pointer hover:opacity-100" onClick={() => handleFilterClick("category", project?.category?.title)}>
                  {project?.category?.title}
                </span>
                <BiSolidChevronRight className="textColor opacity-30 mr-3" />

                {project?.formats?.map((format) => {
                  const iconName = format?.format?.toLowerCase() || "unknown";
                  const label = format?.format || "Unknown";
                  return (
                    <div className="img size-7 highlightbg flexC rounded-full -ml-4" key={format?._id || Math.random()}>
                      {iconName && <IconWithFallback value={iconName} alt={`${label} icon`} className="w-full h-full object-contain p-1.5 hover:z-10 focus:z-10 hover:cursor-pointer" />}
                    </div>
                  );
                })}
              </div>
              <div className="flexC gap-1">
                <button className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                  <IoEye />
                  <span className="textSizeSm">{project?.numOfViews?.length === 0 ? "0" : project?.numOfViews}</span>
                </button>
                <button className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                  <LikeButton resourceType="project" contentId={project?._id} initialLikes={project?.likes || []} showtrue={true} />
                  <span className="textSizeSm">{likeCount === 0 ? "0" : likeCount}</span>
                </button>
                <button className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                  <FaComments />
                  <span className="textSizeSm">200</span>
                </button>
                <NavLink target="_blank" to={project?.urllink} className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                  <span className="textSizeSm">Preview</span>
                </NavLink>
                <ActionButton className="flex items-center gap-2 h-auto p-2.5 px-4">
                  <span className="textSizeSm">Add to cart</span>
                  <span className="textSizeSm font-semibold">${project?.price}</span>
                </ActionButton>
              </div>
            </div>
            <div className="tags flex items-center gap-1 py-1">
              {project?.tags &&
                project?.tags?.length > 0 &&
                project?.tags?.map((tag) => (
                  <button className="py-1 px-2 text-xs border border-teal-400 dark:border-teal-900 rounded-full italic text-teal-500" key={tag?._id} onClick={() => handleFilterClick("tag", tag.tag)}>
                    {`#${tag.tag}`}
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="description p-8">
          <div className="grid grid-cols-2 gap-4">
            {project?.assets?.map((image) => (
              <div className="h-96 3xl:h-[500px] rounded-3xl" key={image?.publicId}>
                <img src={image?.filePath} alt={image?.publicId} className="w-full h-full object-cover rounded-3xl" />
              </div>
            ))}
          </div>
          <div className="download-btn flex justify-between items-center my-5 highlightbg p-3 rounded-full">
            <div className="flex items-center gap-4">
              <div className="icon h-9 w-9 3xl:w-10 3xl:h-10 border border-gray-500/20 dark:border-gray-50/20 rounded-full flexC">
                <FaCloudDownloadAlt size={18} className="textColor" />
              </div>
              <span className="text-green-600 text-xs 3xl:textSizeSm">You can download this product with the All-Access Pass.</span>
            </div>
            <button className="bg-green-500 px-6 py-2.5 rounded-full text-xs text-white">Get All-Access</button>
          </div>

          <div className="flex justify-between gap-3 px-16">
            <div className="left w-2/3">
              <HeadingThree className="mb-3">Overview</HeadingThree>
              <RichTextRenderer content={project?.description || ""} />
            </div>
            <div className="left w-1/3">
              <HeadingThree className="mb-3">Highlights</HeadingThree>
              {project?.highlights?.map((highlight) => (
                <div className="flex justify-start gap-1 mb-3" key={highlight?._id}>
                  <p className="w-5">
                    <IoCheckmarkCircle size={18} className="text-green-500" />
                  </p>
                  <div className="w-full">
                    <p className="textColor textSizeSm">{highlight?.highlight}</p>
                  </div>
                </div>
              ))}
              <HeadingThree className="mb-3 mt-10">Format</HeadingThree>

              <div className="flex flex-wrap gap-1">
                {project?.formats?.map((format) => {
                  const iconName = format?.format?.toLowerCase() || "unknown";
                  const label = format?.format || "Unknown";
                  return (
                    <div
                      className={`highlightbg px-4 py-2 text-xs rounded-full flex items-center gap-2 w-auto border border-transparent hover:border-gray-500/20 hover:cursor-pointer`}
                      key={format?._id || Math.random()}
                    >
                      <div className="size-5 flexC">
                        <IconWithFallback value={iconName} alt={`${label} icon`} />
                      </div>
                      <span>{format?.format}</span>
                    </div>
                  );
                })}
              </div>
              {project?.resourceFile?.type === "file" && (
                <div className="flex items-center mt-8 gap-2">
                  <IoCloudDownloadOutline />
                  <span className="textColor textSizeSm">{(project?.resourceFile?.file?.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};

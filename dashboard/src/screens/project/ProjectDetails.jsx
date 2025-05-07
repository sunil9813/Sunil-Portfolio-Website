import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { getProjectPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/projectSlice";
import { PrimaryButton, Wrapper } from "@/utils/Router";
import { useEffect, useMemo, useState } from "react";
import { FaCloudDownloadAlt, FaComments, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { VscVerifiedFilled } from "react-icons/vsc";
import { generateItemColor } from "@/utils";
import { BiSolidChevronRight } from "react-icons/bi";
import { IoEye } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";

export const ProjectDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { project } = useSelector((state) => state.project);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);
  const userId = user?._id;

  // Local state for switches and their loading states
  const [localVisibility, setLocalVisibility] = useState(project?.visibility || "private");
  const [localFeatured, setLocalFeatured] = useState(project?.featured || false);

  const isFavorited = useMemo(() => favoriteResource?.Blog?.some((fav) => fav._id === project?._id), [favoriteResource, project?._id]);
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

  console.log("====================================");
  console.log(project);
  console.log("====================================");
  return (
    <>
      <Wrapper className="relative">
        <div className="top-header relative h-[30vh] rounded-t-3xl overflow-hidden">
          <div className="h-[30vh] rounded-t-3xl w-full">
            <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover rounded-t-3xl" />
          </div>
          <div className="bg-gradient-to-b h-[30vh] absolute top-0 left-0 w-full rounded-t-3xl bg-light-surface1/90 dark:bg-dark-surface1/95"> </div>

          <div className="title-desc w-full absolute bottom-0 px-8 py-3">
            <div className="flex">
              <h1 className="textColor text-3xl capitalize">{project?.title}</h1>
              <VscVerifiedFilled size={20} className="text-green-400" />
            </div>
            <p className="textColor text-xs opacity-70">{project?.metaDescription}</p>

            <div className="flex items-center justify-between mt-7">
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
                <span className="text-xs textColor opacity-70 capitalize">{project?.category?.title}</span>
                <BiSolidChevronRight className="textColor opacity-30" />
                {project?.formats?.map((format) => (
                  <div className="img" key={format?._id}>
                    <span>{format?.format}</span>
                  </div>
                ))}
              </div>
              <div className="flexC gap-2">
                <button className="flexC gap-1 bg-white dark:bg-gray-800 p-2 px-4 rounded-full textColor">
                  <IoEye />
                  <span className="textSizeSm">{project?.numOfViews?.length === 0 ? "0" : project?.numOfViews}</span>
                </button>
                <button className="flexC gap-1 bg-white dark:bg-gray-800 p-2 px-4 rounded-full textColor">
                  <AiFillLike />
                  <span className="textSizeSm">{likeCount === 0 ? "0" : likeCount}</span>
                </button>
                <button className="flexC gap-1 bg-white dark:bg-gray-800 p-2 px-4 rounded-full textColor">
                  <FaComments />
                  <span className="textSizeSm">200</span>
                </button>
                <NavLink target="_blank" to={project?.urllink} className="flexC gap-1 bg-white dark:bg-gray-800 p-2 px-4 rounded-full textColor">
                  <span className="textSizeSm">Preview</span>
                </NavLink>
                <button className="flexC gap-2 bg-indigo-500 p-2 px-4 rounded-full text-white shadow-sm">
                  <span className="textSizeSm">Add to cart</span>
                  <span className="textSizeSm">${project?.price}</span>
                </button>
              </div>
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
        </div>
      </Wrapper>
    </>
  );
};

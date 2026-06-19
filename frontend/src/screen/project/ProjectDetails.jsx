import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { getProject } from "@/redux/slices/projectSlice";
import { useEffect, useMemo } from "react";
import { FaCloudDownloadAlt, FaComments, FaFacebookF, FaTelegramPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AiFillStar, AiFillTags, AiOutlineInstagram, AiOutlineLink, AiOutlineTwitter, AiOutlineUpload } from "react-icons/ai";
import { BsFillCalendarCheckFill, BsGrid1X2Fill, BsStars } from "react-icons/bs";
import { HeadingTwo } from "@/components/customeUI/Title";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BiSolidChevronRight } from "react-icons/bi";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { LikeButton } from "@/components/LikeButton";
import { ActionButton, SecondaryButton, TertiaryButton } from "@/components/customeUI/Button";
import { IconWithFallback } from "./ProjectCard";
import { DateFormatter } from "@/components/DateFormatter";
import { CommentBoxComponents } from "@/components/CommentBox";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";

export const ProjectDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { project, isLoading } = useSelector((state) => state.project);
  console.log(project);

  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  //  const likeState = useSelector((state) => state.like);
  const userId = user?._id;

  // Local state for switches and their loading states
  const isFavorited = useMemo(() => favoriteResource?.Project?.some((fav) => fav._id === project?._id), [favoriteResource, project?._id]);
  //   const likeCount = useMemo(() => {
  //     return likeState.likeCounts["project"]?.[project?._id] ?? project?.likes?.length ?? 0;
  //   }, [likeState, project?._id, project?.likes]);

  // Initial fetch of project details
  useEffect(() => {
    dispatch(getProject(slug));
  }, [slug, dispatch]);

  // Fetch user's favorite resources
  // useEffect(() => {
  //   dispatch(getUserFavorite(userId));
  // }, [dispatch, userId]);

  const handleFilterClick = (filterType, value) => {
    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };
  return (
    <>
      <section className="project-details">
        <div className="h-[50vh] overflow-hidden absolute top-0 w-full">
          <div className="w-full">
            <img src={project?.thumbnail?.filePath} alt={project?.thumbnail?.publicId} className="w-full h-full object-cover" />
          </div>
          <div className="bg-gradient-to-t h-[50vh] absolute top-0 left-0 w-full bg-dark-primary/90"> </div>
        </div>
        <div className="top-content">
          <div className="h-[45vh] w-full"></div>
          <div className="title-desc w-full absolute top-56">
            <div className="container">
              <div className="flex items-center">
                <h1 className="gardient-text2 text-2xl">{project?.title}</h1>
                <VscVerifiedFilled size={20} className="text-green-400" />
              </div>
              <p className="textColor text-sm opacity-70 my-3">{project?.metaDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flexC gap-1">
                  <span className="text-m textColor opacity-90 cursor-pointer hover:opacity-100 uppercase" onClick={() => handleFilterClick("category", project?.category?.title)}>
                    {project?.category?.title}
                  </span>
                  <BiSolidChevronRight className="textColor opacity-30 mr-3" />
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
                <div className="flexC gap-1">
                  <button className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                    <IoEye />
                    <span className="textSizeSm">{project?.numOfViews?.length === 0 ? "0" : project?.numOfViews}</span>
                  </button>
                  <button className="flexC gap-1 bg-white dark:bg-gray-500/10 p-2.5 px-4 rounded-full textColor">
                    <FaComments />
                    <span className="textSizeSm">200</span>
                  </button>
                  <NavLink target="_blank" to={project?.urllink} className="flexC gap-1 bg-white dark:bg-gray-500/30 p-2.5 px-4 rounded-full textColor">
                    <span className="textSizeSm">Preview</span>
                  </NavLink>
                  <div className=" relative">
                    <LikeButton resourceType="project" contentId={project?._id} initialLikes={project?.likes || []} showtrue={true} />
                    {/* <span className="textSizeSm">{project === 0 ? "0" : project}</span> */}
                  </div>
                  <FavoriteButton resourceType="Project" resourceId={project?._id} initialFavorited={isFavorited} />

                  <TertiaryButton className="flex items-center gap-2 h-auto p-2.5 px-4">
                    <span className="textSizeSm">Add to cart</span>
                    <span className="textSizeSm font-semibold">${project?.price}</span>
                  </TertiaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container relative">
          <div className="content">
            {project?.assets?.length > 1 ? (
              <div className="images grid grid-cols-2 gap-5">
                {project?.assets?.map((image) => (
                  <div className="h-96 3xl:h-[500px] rounded-3xl" key={image?.publicId}>
                    <img src={image?.filePath} alt={image?.publicId} className="w-full h-full object-cover rounded-3xl" />
                  </div>
                ))}
              </div>
            ) : (
              project?.assets?.map((image) => (
                <div className="h-96 3xl:h-[500px] rounded-3xl" key={image?.publicId}>
                  <img src={image?.filePath} alt={image?.publicId} className="w-full h-full object-cover rounded-3xl" />
                </div>
              ))
            )}

            <div className="download-btn flex justify-between items-center my-5 highlightbg p-3 rounded-full">
              <div className="flex items-center gap-4">
                <div className="icon h-9 w-9 3xl:w-10 3xl:h-10 border border-gray-500/20 dark:border-gray-50/20 rounded-full flexC">
                  <FaCloudDownloadAlt size={18} className="textColor" />
                </div>
                <span className="text-green-600 text-xs 3xl:textSizeSm">You can download this product with the All-Access Pass.</span>
              </div>
              <button className="bg-green-500 px-6 py-2.5 rounded-full text-xs text-white">Get All-Access</button>
            </div>
            <div className="description">
              <h2 className="text-2xl font-medium mb-5 text-text_light dark:text-white">Overview</h2>
              <RichTextRenderer content={project?.description || ""} />
              <div className="grid grid-cols-3 gap-2 my-16">
                <div className="box">
                  <h2 className="text-2xl font-medium mb-5 text-text_light dark:text-white">Highlights</h2>
                  {project?.highlights?.map((highlight) => (
                    <div className="flex justify-start gap-1 mb-3" key={highlight?._id}>
                      <p className="w-5">
                        <IoCheckmarkCircle size={18} className="text-green-500" />
                      </p>
                      <div className="w-full">
                        <p>{highlight?.highlight}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="box">
                  <h2 className="text-2xl font-medium mb-5 text-text_light dark:text-white">Published</h2>
                  <ul className="flex gap-4 flex-col">
                    <li className="flex items-center gap-2">
                      <AiOutlineUpload /> Last Update :
                      <span className="text-white">
                        <DateFormatter date={project?.updatedAt} />
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsFillCalendarCheckFill /> Published :
                      <span className="text-white">
                        <DateFormatter date={project?.createdAt} />
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <BsGrid1X2Fill /> Layout :<span className="text-white capitalize">{project?.layout}</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-16 flex justify-start">
                        <AiFillTags size={18} /> <span className="ml-1">Tags :</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project?.tags &&
                          project?.tags?.length > 0 &&
                          project?.tags?.map((tag) => (
                            <button
                              className="py-1 px-2 text-xs border border-teal-400 dark:border-teal-900 rounded-full italic text-teal-500"
                              key={tag?._id}
                              onClick={() => handleFilterClick("tag", tag.tag)}
                            >
                              {`#${tag.tag}`}
                            </button>
                          ))}
                      </div>
                    </li>
                  </ul>
                </ul>
                <div className="reviews">
                  <h2 className="text-2xl font-medium mb-5 text-text_light dark:text-white">Reviews</h2>
                  <div className="flex">
                    <div className="border-r border-[#ddd] dark:border-border_dark2 w-1/3">
                      <SecondaryButton className="flexC">
                        <span>4.33</span> <BsStars size={25} />
                      </SecondaryButton>
                      <br />
                      <HeadingTwo>3 Reviews</HeadingTwo>
                    </div>
                    <div className="w-2/3 pl-4">
                      <ul className="flex items-center gap-3 flex-col">
                        <li className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            5 <AiFillStar size={15} className="text-white" />
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            4 <AiFillStar size={15} className="text-white" />
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            3 <AiFillStar size={15} className="text-white" />
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            2 <AiFillStar size={15} className="text-white" />
                          </span>
                          <span>1</span>
                        </li>
                        <li className="flex items-center justify-between gap-4">
                          <span className="flex items-center gap-2">
                            1 <AiFillStar size={15} className="text-white" />
                          </span>
                          <span>1</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share and format */}
              <div className="bottom flex justify-between items-center border-t border-white/20 pt-8 pb-4">
                <div className="social flex items-center gap-3">
                  <span className="mr-5">Share this project:</span>
                  <ActionButton className="!p-0 size-10 flexC">
                    <FaFacebookF size={18} />
                  </ActionButton>
                  <ActionButton className="!p-0 size-10 flexC">
                    <AiOutlineInstagram size={18} />
                  </ActionButton>
                  <ActionButton className="!p-0 size-10 flexC">
                    <AiOutlineTwitter size={18} />
                  </ActionButton>
                  <ActionButton className="!p-0 size-10 flexC">
                    <FaTelegramPlane size={18} />
                  </ActionButton>
                  <ActionButton className="flexC">
                    <AiOutlineLink size={18} />
                    Copy link
                  </ActionButton>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="mr-5">Format:</span>
                  <div className="flex items-center -space-x-3">
                    {project?.formats?.slice(0, 6).map((format) => {
                      const iconName = format?.format?.toLowerCase() || "unknown";
                      const label = format?.format || "Unknown";
                      return (
                        <div className="img size-8 bg-slate-50/10 backdrop-blur-2xl flexC rounded-full" key={format?._id || Math.random()}>
                          {iconName && <IconWithFallback value={iconName} alt={`${label} icon`} className="w-full h-full object-contain p-1.5 hover:z-10 focus:z-10 hover:cursor-pointer" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <CommentBoxComponents />
          </div>
        </div>
      </section>
    </>
  );
};

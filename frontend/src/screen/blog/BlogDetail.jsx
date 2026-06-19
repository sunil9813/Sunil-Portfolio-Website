import BlogImg from "@/assets/bg/blogdbg.avif";
import { CommentBoxComponents } from "@/components/CommentBox";
import { ActionButton } from "@/components/customeUI/Button";
import { HeadingTwo, InputLabel } from "@/components/customeUI/Title";
import { DateFormatter } from "@/components/DateFormatter";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LikeButton } from "@/components/LikeButton";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { getBlog } from "@/redux/slices/blogSlice";
import { generateItemColor } from "@/utils";
import { useEffect, useMemo } from "react";
import { AiFillLike, AiOutlineInstagram, AiOutlineLink, AiOutlineTwitter } from "react-icons/ai";
import { FaComments, FaFacebookF, FaTelegramPlane, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blog } = useSelector((state) => state.blog);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);

  const isFavorited = useMemo(() => favoriteResource?.Blog?.some((fav) => fav._id === blog?._id), [favoriteResource, blog?._id]);
  const likeCount = useMemo(() => {
    return likeState.likeCounts["blog"]?.[blog?._id] ?? blog?.likes?.length ?? 0;
  }, [likeState, blog?._id, blog?.likes]);

  // Initial fetch of blog details
  useEffect(() => {
    dispatch(getBlog(slug));
  }, [slug, dispatch]);

  const handleFilterClick = (filterType, value) => {
    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  return (
    <>
      <div className="h-[50vh] overflow-hidden absolute top-0 max-w-full">
        <div className="w-full">
          <img src={BlogImg} alt="BlogImg" className="w-full h-full object-cover" />
        </div>
      </div>
      <section className="blog-details">
        <div className="container relative z-10">
          <div className="heading p-5 text-center">
            <InputLabel className="pt-16 text-center pb-3">{blog?.metaDescription}</InputLabel>
            <h1 className="heading-gardient blog-detail-title text-3xl font-semibold text-center">{blog?.title}</h1>
          </div>
          <div className="flex justify-end gap-5">
            <span className="uppercase text-sm cursor-pointer" onClick={() => handleFilterClick("category", blog?.category?.title)}>
              {blog?.category?.title}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-end gap-5">
                <div className="flex items-center gap-3">
                  {blog?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                    <div
                      className="font-semibold capitalize w-8 h-8 3xl:w-10 3xl:h-10 rounded-full flex justify-center items-center text-white text-xl"
                      style={{
                        background: generateItemColor(blog?.user?.name || blog?.name || "X"), // Unique background color
                      }}
                    >
                      {(blog?.user?.name?.charAt(0) || blog?.name?.charAt(0)) ?? "?"}
                    </div>
                  ) : (
                    <div className="w-8 h-8 3xl:w-10 3xl:h-10 rounded-full">
                      <img src={blog?.user?.avatar?.url || blog?.avatar?.url} alt={blog?.user?.avatar?.publicId || blog?.avatar?.publicId} className="w-full h-full object-cover rounded-full" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className=" capitalize">{blog?.user?.name || blog?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 capitalize text-gray-400">
                  <IoEye size={18} />
                  <span className="text-sm">{blog?.numOfViews?.length === 0 ? "0" : blog?.numOfViews}</span>
                </div>
                <div className="flex items-center gap-2 capitalize text-gray-400">
                  <AiFillLike size={18} />
                  <span className="text-sm">{likeCount === 0 ? "0" : likeCount}</span>
                </div>
                <div className="flex items-center gap-2 capitalize text-gray-400">
                  <FaComments size={18} />
                  <span className="text-sm">200</span>
                </div>
                <span className="font-normal flex items-center justify-center text-sm">
                  <span className="flex justify-center items-center h-[20px] w-[1px] self-stretch bg-slate-500/50 mr-4"></span>
                  <DateFormatter date={blog?.createdAt} />
                </span>
              </div>

              <div className="flexC gap-2">
                <LikeButton resourceType="blog" contentId={blog?._id} initialLikes={blog?.likes || []} />
                <FavoriteButton resourceType="Blog" resourceId={blog?._id} initialFavorited={isFavorited} />
              </div>
            </div>
            <div className="my-2 h-[1px] w-full self-stretch bg-dark-highlight mb-4"></div>
          </div>

          <div className="flex justify-between gap-4">
            <div className="w-[75%]">
              {/* <div className="w-full h-[70vh]">
                <img src={blog?.cover?.filePath} alt={blog?.cover?.fileName} className="w-full h-full object-cover rounded-xl" />
              </div> */}

              <div className="py-4">
                <RichTextRenderer content={blog?.description || ""} />
              </div>
            </div>
            <div className="w-[25%]">
              <div className="tags bg-dark-highlight rounded-xl p-4">
                <HeadingTwo className="mb-4">Tags</HeadingTwo>
                <div className="flex flex-wrap gap-2">
                  {blog?.tags &&
                    blog?.tags?.length > 0 &&
                    blog?.tags?.map((tag) => (
                      <button
                        className="py-2 px-6 text-sm border border-teal-400 dark:border-teal-900 rounded-full text-teal-500 hover:bg-teal-500 hover:text-white transition-colors delay-75 ease-in-out"
                        key={tag?._id}
                        onClick={() => handleFilterClick("tag", tag.tag)}
                      >
                        {`#${tag.tag}`}
                      </button>
                    ))}
                </div>
              </div>
              <div className="tags bg-dark-highlight rounded-xl p-4 my-3">
                <HeadingTwo className="mb-4">Top Categories</HeadingTwo>
              </div>
              <div className="tags bg-dark-highlight rounded-xl p-4 my-3">
                <HeadingTwo className="mb-4">Popular Posts</HeadingTwo>
              </div>
              <div className="tags bg-dark-highlight rounded-xl p-4 my-3">
                <HeadingTwo className="mb-4">Popular Tags</HeadingTwo>
              </div>
              <div className="tags bg-dark-highlight rounded-xl p-4 my-3">
                <HeadingTwo className="mb-4">Share project</HeadingTwo>
                <div className="social flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <ActionButton className="!p-0 size-10 flexC">
                      <FaFacebookF size={18} className="text-[#3fb0f1]" />
                    </ActionButton>
                    <InputLabel className="text-[#3fb0f1]">Facebook</InputLabel>
                  </div>
                  <div className="flex items-center gap-3">
                    <ActionButton className="!p-0 size-10 flexC">
                      <AiOutlineInstagram size={18} className="text-[#e1306c]" />
                    </ActionButton>
                    <InputLabel className="text-[#e1306c]">Instagram</InputLabel>
                  </div>
                  <div className="flex items-center gap-3">
                    <ActionButton className="!p-0 size-10 flexC">
                      <AiOutlineTwitter size={18} className="text-[#1da1f2]" />
                    </ActionButton>
                    <InputLabel className="text-[#1da1f2]">Twitter</InputLabel>
                  </div>
                  <div className="flex items-center gap-3">
                    <ActionButton className="!p-0 size-10 flexC">
                      <FaTelegramPlane size={18} className="text-[#0088cc]" />
                    </ActionButton>
                    <InputLabel className="text-[#0088cc]">Telegram</InputLabel>
                  </div>
                  <div className="flex items-center gap-3">
                    <ActionButton className="flexC gap-2 w-full">
                      <AiOutlineLink size={18} className="text-gray-200" />
                      Copy link
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CommentBoxComponents />
        </div>
      </section>
    </>
  );
};

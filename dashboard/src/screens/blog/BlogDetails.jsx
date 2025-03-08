import { DateFormatter } from "@/components/common/DateFormatter";
import { getBlogPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";
import { FavoriteButton, LikeButton, Loader, Wrapper } from "@/utils/Router";
import { Chip, Switch } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import parse from "html-react-parser";
import hljs from "highlight.js";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";

export const BlogDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const navigate = useNavigate();

  const { favoriteResource } = useSelector((state) => state.favorite);
  const { blog, isLoading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const description = blog?.description || "";
  const isFavorited = favoriteResource?.Blog?.some((fav) => fav._id === blog?._id);

  useEffect(() => {
    dispatch(getBlogPrivate(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    dispatch(getUserFavorite(userId));
  }, [dispatch, userId]);

  const handleVisibilityToggle = (blogId, visibility) => {
    dispatch(updateVisibility({ blogId, visibility }));
  };

  const handleFeaturedToggle = (blogId, featured) => {
    dispatch(updateFeaturedStatus({ blogId, featured }));
  };

  const handleFilterClick = (filterType, value) => {
    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [description]);

  return (
    <>
      {isLoading && <Loader />}
      <Wrapper className="p-5">
        <div className="h-96 relative">
          <img src={blog?.cover?.filePath} alt={blog?.cover?.fileName} className="w-full h-full object-cover rounded-xl" />
          <div className="absolute bottom-0 left-0 m-2 flex gap-2">
            <LikeButton resourceType="blog" contentId={blog?._id} initialLikes={blog?.likes || []} />
            <FavoriteButton resourceType="Blog" resourceId={blog?._id} initialFavorited={isFavorited} />
          </div>
          <div className="absolute bottom-0 right-0 bg-teal-700 text-white p-2 m-3 h-10 rounded-lg">
            <div className="flex justify-between items-center gap-5">
              <div>
                <Switch
                  id="visibility-switch"
                  ripple={false}
                  className="h-full w-full checked:bg-[#2ec946]"
                  label={blog?.visibility === "public" ? "Public" : "Private"}
                  checked={blog?.visibility === "public"}
                  onChange={() => handleVisibilityToggle(blog?._id, blog?.visibility === "public" ? "private" : "public")}
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
                  label={blog?.featured === true ? "Featured In Home" : "None"}
                  checked={blog?.featured === true}
                  onChange={() => handleFeaturedToggle(blog?._id, !blog?.featured)}
                  containerProps={{ className: "w-11 h-6" }}
                  labelProps={{ className: "text-white font-normal capitalize" }}
                  circleProps={{ className: "before:hidden left-0.5 border-none" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 py-5">
            <span className="font-normal text-gray-400 text-sm">
              <DateFormatter date={blog?.createdAt} />
            </span>
            <div className="inline-block h-[25px] w-[1px] self-stretch bg-white/50"></div>
            <div className="flex items-center gap-2 capitalize text-gray-400">
              <FaUser size={12} />
              <span className="text-sm">{blog?.user?.name}</span>
            </div>
            <div className="flex items-center gap-2 capitalize text-gray-400">
              <IoEye />
              <span className="text-sm">{blog?.numOfViews?.length === 0 ? "0" : blog?.numOfViews}</span>
            </div>
            <div className="flex items-center gap-2 capitalize text-gray-400">
              <AiFillLike />
              <span className="text-sm">{blog?.likes.length === 0 ? "0" : blog?.likes.length}</span>
            </div>
            <div className="flex items-center gap-2 capitalize text-gray-400">
              <FaComments />
              <span className="text-sm">200</span>
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <span className="uppercase text-sm cursor-pointer" onClick={() => handleFilterClick("category", blog?.category?.title)}>
              {blog?.category?.title}
            </span>
          </div>
        </div>
        <h2 className="text-xl capitalize">{blog?.title}</h2>
        <div className="my-4 h-[1px] w-full self-stretch bg-white/40"></div>
        <div className="tags flex items-center gap-2">
          {blog?.tags &&
            blog?.tags?.length > 0 &&
            blog?.tags?.map((tag) => <Chip key={tag?._id} variant="outlined" color="indigo" className="rounded-sm cursor-pointer" value={tag.tag} onClick={() => handleFilterClick("tag", tag.tag)} />)}
        </div>
        <p className="text-textcolor py-4">{blog?.metaDescription}</p>
        <div className="tiptap" ref={contentRef}>
          <div className="prose prose-lg focus:outline-none prose-invert max-w-full mx-auto h-full text-white">{parse(description)}</div>
        </div>
      </Wrapper>
    </>
  );
};

import { DateFormatter } from "@/components/common/DateFormatter";
import { getBlogPrivate, updateFeaturedStatus, updateVisibility } from "@/redux/slices/blogSlice";
import { getUserFavorite } from "@/redux/slices/common/favoriteSlice";
import { Comments, FavoriteButton, LikeButton, Wrapper, RichTextRenderer } from "@/utils/Router";
import { useEffect, useMemo, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Chip, Switch } from "@material-tailwind/react";
import { toast } from "react-toastify";

export const BlogDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { blog } = useSelector((state) => state.blog);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { user } = useSelector((state) => state.auth);
  const likeState = useSelector((state) => state.like);
  const userId = user?._id;

  // Local state for switches and their loading states
  const [localVisibility, setLocalVisibility] = useState(blog?.visibility || "private");
  const [localFeatured, setLocalFeatured] = useState(blog?.featured || false);

  const isFavorited = useMemo(() => favoriteResource?.Blog?.some((fav) => fav._id === blog?._id), [favoriteResource, blog?._id]);
  const likeCount = useMemo(() => {
    return likeState.likeCounts["blog"]?.[blog?._id] ?? blog?.likes?.length ?? 0;
  }, [likeState, blog?._id, blog?.likes]);

  // Initial fetch of blog details
  useEffect(() => {
    dispatch(getBlogPrivate(slug));
  }, [slug, dispatch]);

  // Fetch user's favorite resources
  useEffect(() => {
    dispatch(getUserFavorite(userId));
  }, [dispatch, userId]);

  // Sync local state with Redux state when blog changes
  useEffect(() => {
    if (blog) {
      setLocalVisibility(blog.visibility);
      setLocalFeatured(blog.featured);
    }
  }, [blog]);

  const handleVisibilityToggle = async (blogId, newVisibility) => {
    try {
      setLocalVisibility(newVisibility);
      await dispatch(updateVisibility({ blogId, visibility: newVisibility })).unwrap();
    } catch (error) {
      toast.error("Failed to update visibility:", error);
      setLocalVisibility(blog.visibility);
    }
  };

  const handleFeaturedToggle = async (blogId, newFeatured) => {
    try {
      setLocalFeatured(newFeatured);
      await dispatch(updateFeaturedStatus({ blogId, featured: newFeatured })).unwrap();
    } catch (error) {
      toast.error("Failed to update featured status:", error);
      setLocalFeatured(blog.featured);
    }
  };

  const handleFilterClick = (filterType, value) => {
    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  return (
    <>
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
                  label={localVisibility === "public" ? "Public" : "Private"}
                  checked={localVisibility === "public"}
                  onChange={() => handleVisibilityToggle(blog?._id, localVisibility === "public" ? "private" : "public")}
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
                  onChange={() => handleFeaturedToggle(blog?._id, !localFeatured)}
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
              <span className="text-sm">{likeCount === 0 ? "0" : likeCount}</span>
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
        <RichTextRenderer content={blog?.description || ""} />
      </Wrapper>

      <Comments />
    </>
  );
};

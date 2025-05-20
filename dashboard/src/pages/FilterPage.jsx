import { DateFormatter } from "@/components/common/DateFormatter";
import { getBlogsByCategoryAndTag } from "@/redux/slices/blogSlice";
import { truncateText } from "@/utils";
import { Loader, Wrapper } from "@/utils/Router";
import { Chip } from "@material-tailwind/react";
import { useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import { FaComments, FaUser } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export const FilterPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  useEffect(() => {
    if (category || tag) {
      dispatch(getBlogsByCategoryAndTag({ category, tag }));
    }
  }, [category, tag, dispatch]);
  return (
    <>
      {isLoading && <Loader />}
      <Wrapper className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="relative">
                <img src={blog?.cover?.filePath} alt={blog?.cover?.fileName} className="w-full h-48 object-cover" />
                <div className=" absolute bottom-0 right-0 m-2">
                  <Chip value={blog?.category?.title} color="indigo" className=" rounded-sm shadow-sm" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white capitalize">{truncateText(blog?.title, 32)}</h3>
                <p className="text-gray-400 text-sm mt-2">{truncateText(blog?.metaDescription, 80)}</p>
                <div className="flex items-center gap-4 mt-4 text-gray-400 text-sm">
                  <span>
                    <DateFormatter date={blog?.createdAt} />
                  </span>
                  <div className="flex items-center gap-1">
                    <FaUser size={12} />
                    {blog?.user?.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <IoEye />
                    {blog?.numOfViews || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <AiFillLike />
                    {blog?.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComments />
                    200 {/* Replace with actual comment count */}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No blogs found for this category or tag.</p>
        )}
      </Wrapper>
    </>
  );
};

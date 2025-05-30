import { getChapter } from "@/redux/slices/universityStructure/chapterSlice";
import { generateItemColor } from "@/utils";
import { LikeButton, RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const ChapterDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { chapter } = useSelector((state) => state.chapter);

  useEffect(() => {
    dispatch(getChapter(slug));
  }, [dispatch, slug]);

  return (
    <>
      <Wrapper>
        {chapter?.thumbnail?.filePath && (
          <div className="rounded-xl h-56 relative transition-all duration-500">
            <img src={chapter?.thumbnail?.filePath} alt={chapter?.thumbnail?.publicId} className="w-full h-full object-cover rounded-xl" />
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-2">
          <div className="flexC gap-1">
            <div>
              {chapter?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                <div
                  className="font-semibold capitalize size-7 3xl:size-9 rounded-full flex justify-center items-center text-white text-xs"
                  style={{
                    background: generateItemColor(chapter?.user?.name || chapter?.name || "X"),
                  }}
                >
                  {(chapter?.user?.name?.charAt(0) || chapter?.name?.charAt(0)) ?? "?"}
                </div>
              ) : (
                <div className="size-7 3xl:size-9 rounded-full">
                  <img
                    src={chapter?.user?.avatar?.url || chapter?.avatar?.url}
                    alt={chapter?.user?.avatar?.publicId || chapter?.avatar?.publicId}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              )}
            </div>
            <span className="text-xs textColor opacity-70 capitalize">{chapter?.user?.name || chapter?.name}</span>
            <BiSolidChevronRight className="textColor opacity-30" />
            <div
              className="text-xs flex items-center gap-3 textColor opacity-70 capitalize cursor-pointer hover:opacity-100"
              // onClick={() => handleFilterClick("category", chapter?.category?.title)}
            >
              {chapter?.subject?.name}
            </div>
          </div>
          <div className="flexC gap-1">
            <button className="px-4 py-2 border border-gray-900/10 dark:border-gray-50/10 rounded-full textSizeSm textColor opacity-55 flex items-center gap-1">
              <IoEye />
              <span className="textSizeSm">{chapter?.numOfViews?.length === 0 ? "0" : chapter?.numOfViews}</span>
            </button>

            <button className="px-4 py-2 border border-gray-900/10 dark:border-gray-50/10 rounded-full textSizeSm textColor opacity-55 flex items-center gap-1">
              <FaComments />
              <span className="textSizeSm">200</span>
            </button>
            <button className="button !py-[7px] !m-0 border border-gray-900/10 dark:border-gray-50/20 rounded-full">
              <LikeButton resourceType="chapter" contentId={chapter?._id} initialLikes={chapter?.likes || []} showtrue={true} />
              <span className="textSizeSm">{chapter?.likeCount === 0 ? "0" : chapter?.likeCount}</span>
            </button>
          </div>
        </div>

        {chapter?.tags && (
          <div className="tags flex items-center gap-1 py-1 px-4">
            {chapter?.tags &&
              chapter?.tags?.length > 0 &&
              chapter?.tags?.map((tag) => (
                <button
                  className="py-1 px-2 text-xs border border-teal-400 dark:border-teal-900 rounded-sm text-teal-500"
                  key={tag?._id}
                  // onClick={() => handleFilterClick("tag", tag.tag)} do laters
                >
                  {`#${tag.tag}`}
                </button>
              ))}
          </div>
        )}

        <div className="px-5">
          <RichTextRenderer content={chapter?.description || ""} />
        </div>

        {chapter?.video?.filePath && (
          <div className="rounded-xl px-5 pb-8">
            <video src={chapter.video.filePath} controls className="w-full h-full object-cover rounded-xl">
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Wrapper>
    </>
  );
};

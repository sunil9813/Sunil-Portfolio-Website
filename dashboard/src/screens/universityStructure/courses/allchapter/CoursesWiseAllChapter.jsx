import { getChaptersBySubjectSlug } from "@/redux/slices/universityStructure/courseSlice";
import { generateItemColor } from "@/utils";
import { LikeButton, RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect, useState } from "react";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const CoursesWiseAllChapter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slug } = useParams();

  // Get the saved index from localStorage or default to 0
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem(`chapterIndex_${slug}`);
    return savedIndex ? parseInt(savedIndex) : 0;
  });

  const { chapterByCourse } = useSelector((state) => state.course);
  const { chapters, subject, total } = chapterByCourse;

  useEffect(() => {
    if (slug) {
      dispatch(getChaptersBySubjectSlug(slug));
    }
  }, [dispatch, slug]);

  // When chapters change, reset to first or saved index
  useEffect(() => {
    if (chapters?.length > 0) {
      const savedIndex = localStorage.getItem(`chapterIndex_${slug}`);
      setCurrentIndex(savedIndex ? Math.min(parseInt(savedIndex), chapters.length - 1) : 0);
    }
  }, [chapters, slug]);

  // Save currentIndex to localStorage whenever it changes
  useEffect(() => {
    if (slug && chapters?.length > 0) {
      localStorage.setItem(`chapterIndex_${slug}`, currentIndex.toString());
    }
  }, [currentIndex, slug, chapters]);

  const currentChapter = chapters?.[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const getBackground = () => {
    try {
      const color = subject?.logo?.filePath ? generateItemColor(subject?.logo?.filePath) : null;
      return color || "linear-gradient(to right, #4b6cb7, #182848)";
    } catch (error) {
      toast.error("Error generating background:", error);
      return "linear-gradient(to right, #4b6cb7, #182848)";
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
    <Wrapper className="rounded-md flex justify-between">
      <div className="side w-1/5 bg-blue-gray-900 rounded-md border-r border-r-gray-500/20 dark:border-r-gray-50/20">
        <div className="subject-logo m-1 shadow-lg rounded-md flex items-center p-2 gap-2" style={{ background: getBackground() }}>
          <div className="logo">
            <div className="size-16 shadow-2xl rounded-full">
              <img src={subject?.logo?.filePath} alt={subject?.logo?.publicId} className="w-full h-full object-fill" />
            </div>
          </div>
          <h3 className="textColor text-sm">{subject?.name}</h3>
        </div>
        <ul>
          {chapters?.map((chapter, index) => (
            <li
              key={chapter?._id}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer textSizeSm flex p-3 textColor border-b border-b-gray-500/20 dark:border-b-gray-50/20 last:border-b-0 ${
                currentIndex === index ? "bg-teal-700 text-white" : ""
              }`}
            >
              <span className="font-semibold w-5 block">{index + 1}.</span>
              <span className="w-full">{chapter?.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="content w-4/5 p-1">
        {currentChapter ? (
          <>
            <div className="px-4 rounded-md py-2 border-b border-e-gray-900/20 dark:border-gray-50/20">
              <div className="flex justify-between items-center">
                <h1 className="text-xl  font-semibold textColor capitalize flex items-center gap-3 leading-none">
                  <span className="">Chapter {currentIndex + 1} </span>
                  {currentChapter?.metaTitle}
                </h1>
                <div className="flex justify-end">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 bg-gray-200 dark:bg-black border border-gray-900/10 dark:border-gray-50/20 rounded-full textSizeSm textColor cursor-pointer disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === chapters.length - 1}
                    className="px-4 py-2 bg-gray-200 dark:bg-black border border-gray-900/10 dark:border-gray-50/20 rounded-full textSizeSm textColor cursor-pointer disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flexC gap-1">
                  <div>
                    {currentChapter?.user?.avatar === "https://cdn-icons-png.flaticon.com/512/3940/3940417.png" ? (
                      <div
                        className="font-semibold capitalize size-7 3xl:size-9 rounded-full flex justify-center items-center text-white text-xs"
                        style={{
                          background: generateItemColor(currentChapter?.user?.name || currentChapter?.name || "X"),
                        }}
                      >
                        {(currentChapter?.user?.name?.charAt(0) || currentChapter?.name?.charAt(0)) ?? "?"}
                      </div>
                    ) : (
                      <div className="size-7 3xl:size-9 rounded-full">
                        <img
                          src={currentChapter?.user?.avatar?.url || currentChapter?.avatar?.url}
                          alt={currentChapter?.user?.avatar?.publicId || currentChapter?.avatar?.publicId}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-xs textColor opacity-70 capitalize">{currentChapter?.user?.name || currentChapter?.name}</span>
                  <BiSolidChevronRight className="textColor opacity-30" />
                  <div
                    className="text-xs flex items-center gap-3 textColor opacity-70 capitalize cursor-pointer hover:opacity-100"
                    onClick={() => handleFilterClick("category", currentChapter?.category?.title)}
                  >
                    {subject?.name}
                  </div>
                  <div className="bg-teal-400/20 text-teal-500 dark:bg-teal-300/20 dark:text-teal-300 rounded-full text-[10px] 3xl:text-xs px-3 py-1">{total === 0 ? "0" : total} Chapters</div>
                </div>
                <div className="flexC gap-1">
                  <button className="px-4 py-2 border border-gray-900/10 dark:border-gray-50/10 rounded-full textSizeSm textColor opacity-55 flex items-center gap-1">
                    <IoEye />
                    <span className="textSizeSm">{currentChapter?.numOfViews?.length === 0 ? "0" : currentChapter?.numOfViews}</span>
                  </button>

                  <button className="px-4 py-2 border border-gray-900/10 dark:border-gray-50/10 rounded-full textSizeSm textColor opacity-55 flex items-center gap-1">
                    <FaComments />
                    <span className="textSizeSm">200</span>
                  </button>
                  <button className="button !py-[7px] !m-0 border border-gray-900/10 dark:border-gray-50/20 rounded-full">
                    <LikeButton resourceType="currentChapter" contentId={currentChapter?._id} initialLikes={currentChapter?.likes || []} showtrue={true} />
                    <span className="textSizeSm">{currentChapter?.likeCount === 0 ? "0" : currentChapter?.likeCount}</span>
                  </button>
                </div>
              </div>
            </div>

            {currentChapter?.tags && (
              <div className="tags flex items-center gap-1 py-1 px-4">
                {currentChapter?.tags &&
                  currentChapter?.tags?.length > 0 &&
                  currentChapter?.tags?.map((tag) => (
                    <button className="py-1 px-2 text-xs border border-teal-400 dark:border-teal-900 rounded-sm text-teal-500" key={tag?._id} onClick={() => handleFilterClick("tag", tag.tag)}>
                      {`#${tag.tag}`}
                    </button>
                  ))}
              </div>
            )}
            <div className="px-4">
              <RichTextRenderer content={currentChapter?.description || ""} />
            </div>
            {currentChapter?.video?.filePath && (
              <div className="rounded-xl px-5 pb-8">
                <video src={currentChapter.video.filePath} controls className="w-full h-full object-cover rounded-xl">
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </>
        ) : (
          <p>No chapter selected.</p>
        )}
      </div>
    </Wrapper>
  );
};

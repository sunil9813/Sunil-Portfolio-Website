import React, { useEffect, useState } from "react";
import { generateItemColor, getRandomGradient } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getChaptersBySubjectSlug } from "@/redux/slices/universityStructure/courseSlice";
import { BiSolidChevronRight } from "react-icons/bi";
import { FaComments } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { AiFillLike } from "react-icons/ai";

export const CourseDetailsPage = () => {
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
      setCurrentIndex(savedIndex ? Math.min(parseInt(savedIndex), chapters?.length - 1) : 0);
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
    if (currentIndex < chapters?.length - 1) setCurrentIndex(currentIndex + 1);
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
      <section className="course-list overflow-hidden">
        {/* background of colour of page  */}
        <div className="project-bg !overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <span className="absolute -left-[10%] top-[20%] block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -top-[20%] -left-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <span className="absolute -left-[10%] top-[20%] block aspect-[1.5489] w-[87.5%] -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] rounded-[100%] bg-[#2B2B44] opacity-30 blur-3xl"></span>
            <span className="absolute -top-[20%] -right-[30%] block aspect-[1.3555] w-[69%] -rotate-45 rounded-[100%] bg-[radial-gradient(50%_50%_at_50%_50%,#268D8C_0%,rgba(38,141,140,0)_100%)] opacity-40 blur-3xl"></span>
          </div>
        </div>
        {/* end here */}

        <div className="img absolute top-2/3">
          <img src="../image/bg/supp-line-3.png" alt="" />
        </div>
        <div className="img absolute top-3/4">
          <img src="../image/bg/supp-line-2.png" alt="" />
        </div>
        {/* here is the content goes */}
        <div className="container pb-10 relative">
          {/* wraper of container of courses  */}
          <div className="w-full course-list_content_list  ">
            <ContentCardBg />

            <div className="flex items-center px-3 pt-2 border-b border-gray-900/20 dark:border-gray-50/20">
              <div className="w-full top-content">
                {/* <div className="px-4 rounded-md py-2 border-b border-e-gray-900/20 dark:border-gray-50/20"> */}
                <div>
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl  font-semibold textColor capitalize flex items-center gap-3 leading-none">
                      <span className="">Chapter {currentIndex + 1} : </span>
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
                        disabled={currentIndex === chapters?.length - 1}
                        className="px-4 py-2 bg-gray-200 dark:bg-black border border-gray-900/10 dark:border-gray-50/20 rounded-full textSizeSm textColor cursor-pointer disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
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
                      <button className="px-4 py-2 border border-gray-900/10 dark:border-gray-50/10 rounded-full textSizeSm textColor opacity-55 flex items-center gap-1">
                        <AiFillLike />
                        <span className="textSizeSm">200</span>
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
              </div>
            </div>

            <div className="flex">
              <div className="side-bar w-[20%]">
                {/* <div className="h-full rounded-[20px] rounded-tr-none rounded-br-none transition ease-in-out duration-300 bg-[rgba(255,255,255,0.1)]"> */}
                <div className="h-full rounded-tr-none rounded-br-none transition ease-in-out duration-300 border-r border-gray-900/20 dark:border-gray-50/20 ">
                  <ul>
                    {chapters?.map((chapter, index) => (
                      <li
                        key={chapter?._id}
                        onClick={() => setCurrentIndex(index)}
                        className={`cursor-pointer textSizeSm flex p-3 textColor border-b border-b-gray-500/20 dark:border-b-gray-50/5 last:border-b-0 ${
                          currentIndex === index ? "bg-teal-700 text-white" : ""
                        }`}
                      >
                        <span className="font-semibold w-5 block">{index + 1}.</span>
                        <span className="w-full">{chapter?.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="main-content w-[80%]">
                {currentChapter ? (
                  <>
                    <div className="p-4">
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
            </div>
          </div>
          {/* end here */}
        </div>
      </section>
    </>
  );
};

export const ContentCardBg = () => {
  // Generate random gradients for the elements
  const randomGradient1 = getRandomGradient();
  const randomGradient2 = getRandomGradient();

  // Make sure we don't use the same gradient twice
  let randomGradient3;
  do {
    randomGradient3 = getRandomGradient();
  } while (randomGradient3 === randomGradient2);

  return (
    <>
      <div className="background relative">
        <div
          className="pointer-events-none absolute z-50 left-[250px] top-[102px] h-[548px] w-[800px] rounded-full opacity-[0.11] blur-[100px]"
          style={{ background: randomGradient1 }}
          aria-hidden="true"
        ></div>

        {/* for background */}
        <div className="pointer-events-none absolute right-[25%] top-[-52px] h-[248px] w-[490px] rounded-full opacity-[0.25] blur-[100px]" style={{ background: randomGradient2 }}></div>

        {/* for line */}
        <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter"></div>
        {/* line more bright  */}
        <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#FFFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[1px]"></div>
        {/* line more blur  */}
        <div className="pointer-events-none absolute right-[25%] top-0 z-20 h-[1px] w-[524px] bg-[linear-gradient(90deg,rgba(255,255,255,0)_10%,#BAFFFF_42.53%,rgba(255,255,255,0)_100%)] mix-blend-plus-lighter blur-[5px]"></div>

        {/* for blur color light */}
        <div className="pointer-events-none absolute right-[35%] top-[-11px] h-[23px] w-[400px] rounded-[50%] bg-[#E6FCFF] opacity-20 mix-blend-plus-lighter blur-[25px]"></div>
        <div className="pointer-events-none absolute right-[35%] top-[-16px] h-[32px] w-[448px] rounded-[50%] bg-[#67DBFF] opacity-25 mix-blend-plus-lighter blur-[50px]"></div>
      </div>
    </>
  );
};

import React, { useEffect } from "react";
import { NavLink } from "react-router";
import { HandbookCard } from "./card/CourseCard";
import { BsArrowRight } from "react-icons/bs";
import { getRandomGradient, truncateText } from "@/utils";
import { TertiaryButton } from "@/components/customeUI/Button";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourseWithChapters } from "@/redux/slices/universityStructure/courseSlice";

export const CourseList = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getAllCourseWithChapters());
  }, [dispatch]);

  console.log("====================================");
  console.log(courses);
  console.log("====================================");

  return (
    <>
      <section className="course-list overflow-hidden">
        <div className="beam-light absolute top-0 left-[15%]">
          <img src="../image/bg/beamlight.svg" alt="beamlight" className="h-full w-full object-cover" />
        </div>
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
        <div className="img absolute top-2/3">
          <img src="../image/bg/supp-line-3.png" alt="" />
        </div>
        <div className="img absolute top-3/4">
          <img src="../image/bg/supp-line-2.png" alt="" />
        </div>

        <div className="container relative z-20">
          <div className="heading m-auto text-center mt-32 mb-10">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text course-title">Fuel Your Curiosity with World-Class Courses</h1>
            <h2 className="text-sm md:text-lg py-2 lg:text-2xl textColor font-medium heading-gardient">Learn, Grow, and Succeed with Expert-Led Training in Tech, Creativity, and Beyond</h2>
            <p className="text-xs md:text-sm textColor">Join 925,459 Readers Learning, Sharing, and Growing Together.</p>
          </div>
          {courses?.data?.map((course) => (
            <CourseCardList course={course} key={course?._id} />
          ))}
        </div>
      </section>
    </>
  );
};

export const CourseCardList = ({ course }) => {
  return (
    <div className="course-list_content flex relative z-50 mb-12">
      <div className="absolute top-20 left-1/3 h-full">
        <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="bg" className="flexC" />
      </div>
      <div className="left w-1/5 mr-2">
        <HandbookCard total={course?.chapters?.length} logo={course?.thumbnail} title={course?.name} desc={course?.metaDescription} free="98" show={true} />
        {/*   <CourseCard
          logo="https://cdn.iconscout.com/icon/free/png-256/free-html-5-logo-icon-download-in-svg-png-gif-file-formats--programming-langugae-language-pack-logos-icons-1175208.png"
          title="HTML"
          desc="A comprehensive series of tutorials covering Xcode, React JS"
          free="98"
          show={true}
        /> */}
      </div>
      <CourseChpaterLists course={course} />
    </div>
  );
};

export const CourseChpaterLists = ({ course }) => {
  return (
    <>
      <div className="right w-4/5 ml-8">
        <div className="w-full course-list_content_list">
          <ContentCardBg />
          <div className="p-5">
            <span className="text-sm mb-2 block">{course?.chapters?.length} TUTORIALS</span>
            <div className="items grid grid-cols-3 gap-2 h-80 overflow-x-auto">
              {course?.chapters?.map((chapter, index) => (
                <ContentChapter chapter={chapter} key={chapter?._id} count={index + 1} slug={course?.slug} />
              ))}
            </div>
          </div>
        </div>

        <TertiaryButton className="flexC gap-2 mt-2">
          <span>Read More</span>
          <BsArrowRight size={15} />
        </TertiaryButton>
      </div>
    </>
  );
};

export const ContentChapter = ({ chapter, count, slug }) => {
  return (
    <>
      <div className="box p-2 py-3 rounded-md transition ease-in-out duration-300 border border-transparent hover:cursor-pointer hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]">
        <div className="top flex items-start justify-between">
          <div className="w-20">
            <span className="bg-[rgba(68,66,178,0.1)] dark:bg-[rgba(0,0,0,0.2)] w-10 h-10 flex items-center justify-center rounded-full">{count}</span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white">
                <NavLink to={`/course/${slug}`}>{truncateText(chapter?.title, 20)}</NavLink>
              </h5>
              <span className="bg-[rgba(68,66,178,0.1)] text-sm dark:bg-[rgba(0,0,0,0.2)] rounded-md px-3 py-1">4:58 m</span>
            </div>
            <p className="text-sm"> {truncateText(chapter?.metaDescription, 60)}</p>
          </div>
        </div>
      </div>
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
          className="pointer-events-none absolute z-50 left-[250px] top-[-102px] h-[248px] w-[800px] rounded-full opacity-[0.11] blur-[100px]"
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

import { AiOutlineFilePdf } from "react-icons/ai";
import { GoProjectRoadmap } from "react-icons/go";
import { InputTitle } from "@/components/customeUI/Title";
import { NavLink } from "react-router";
import { getRandomGradient } from "@/utils";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotePageSubjects } from "@/redux/slices/universityStructure/courseSlice";
import { getSubjectResources } from "@/utils/courseResource";

import Img from "../../assets/bg/lightgreen.png";

export const NoteList = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getNotePageSubjects());
  }, [dispatch]);

  const notes = Array.isArray(courses?.data) ? courses.data : Array.isArray(courses) ? courses : [];

  return (
    <>
      <section className="notes pb-20">
        <div className="absolute top-0 left-0 blur-3xl">
          <img src={Img} alt="Img" />
        </div>
        <div className="absolute -top-20 md:right-0 lg:-right-40 blur-3xl overflow-hidden">
          <img src={Img} alt="Img" className=" rotate-[70deg]" />
        </div>
        <div className=" hidden md:visible absolute top-20 left-0 md:left-[20%] lg:left-[35%]">
          <img src={Img} alt="Img" className="rotate-[47deg] blur-lg" />
        </div>
        <div className="circle-group">
          <div className="circle1"></div>
          <div className="circle2"></div>
        </div>
        <div className=" absolute left-[27%] top-0 w-1/2 h-[60vh] overflow-hidden">
          <img src="https://framerusercontent.com/images/eVPQSYBoVqwchmpN78sjyYtovY.svg" alt="images" className="w-full h-full object-cover" />
        </div>
        <div className="container">
          <div className="heading m-auto text-center pt-12 lg:pt-28 mb-10 w-full lg:w-2/3 relative z-20">
            <h1 className="text-xl md:text-3xl lg:text-6xl font-semibold gardient-text note-title">Curated Reads for Modern Learners</h1>
            <h2 className="text-lg md:text-xl lg:text-2xl textColor font-medium">Timeless and trailblazing reads supporting your academic growth and intellectual journey.</h2>
            <p className="text-xs md:text-sm mt-3">Read by learners, leaders, and forward-thinkers in over 100 countries.</p>
          </div>
          <div className="relative z-20 grid grid-cols-1 items-stretch justify-items-center gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-4">
            {notes?.map((item, index) => (
              <>
                <BookCard
                  key={item?._id || index}
                  index={index}
                  item={{
                    slug: item?.slug,
                    topic: item?.name,
                    desc: item?.metaDescription,
                    page: item?.totalpage || getSubjectResources(item).length || 1,
                    link: `/note/${item?.slug}`,
                    logo: item?.thumbnail?.filePath || "../../image/book/web.png",
                  }}
                />
              </>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export const BookCard = ({ item, index }) => {
  return (
    <NavLink className="handbook-card__link" to={item?.link}>
      <div className="handbook-card__wrapper">
        <div className="handbook-card__main">
          <div className="handbook-card__image-wrapper size-10 absolute top-0 right-0 m-4">
            <img src={item?.logo} alt="handbook logo" className="handbook-card__logo size-10 rounded-full" />
          </div>
          <div className="handbook-card__content flex flex-col gap-3 relative max-w-[220px] ">
            <InputTitle className="handbook-card__title gardient-text text-xll">{item?.topic}</InputTitle>
            <p className="[handbook-card__description text-[11px] leading-5 ">{item?.desc}</p>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <GoProjectRoadmap className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">{item?.page} free resources</p>
            </div>
            <div className="handbook-card__info flex items-center gap-2">
              <div className="handbook-card__icon-wrapper flexC size-8 rounded-full">
                <AiOutlineFilePdf className="handbook-card__icon" />
              </div>
              <p className="handbook-card__info-text">Videos, PDF, files</p>
            </div>
            {/*  <div className="flex gap-2">
              <div className="size-10">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Purbanchal_University_Logo.png/285px-Purbanchal_University_Logo.png" alt="" />
              </div>
            </div> */}
          </div>
        </div>
        <div className="handbook-card__background" style={{ background: getRandomGradient(index) }}></div>
      </div>
    </NavLink>
  );
};

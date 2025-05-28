import { getCourse } from "@/redux/slices/universityStructure/courseSlice";
import { RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const CourseDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getCourse(slug));
  }, [dispatch, slug]);

  return (
    <Wrapper>
      <div className="rounded-xl h-56 relative transition-all duration-500">
        <img src={course?.thumbnail?.filePath} alt={course?.thumbnail?.publicId} className="w-full h-full object-cover rounded-xl" />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="logo size-28 highlightbg -mt-10 ml-5 shadow-xl rounded-full">
            {course?.university?.logo?.filePath && (
              <img src={course.university.logo.filePath} alt={course?.university?.logo.publicId || "University logo"} className="w-full h-full object-cover" crossOrigin="anonymous" />
            )}
          </div>
          <div className="pt-5">
            <h1 className="text-xl font-semibold textColor capitalize flex items-center gap-3 leading-none">
              {course?.name} <VscVerifiedFilled size={25} className="text-green-500" />
            </h1>
            <span className="text-sm block">{course?.faculty?.name}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <RichTextRenderer content={course?.description || ""} />
      </div>
    </Wrapper>
  );
};

import { getUniversity } from "@/redux/slices/universityStructure/universitySlice";
import { generateItemColor } from "@/utils";
import { RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { BiWorld } from "react-icons/bi";
import { MdLocationPin } from "react-icons/md";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const UniversityDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { university } = useSelector((state) => state.university);

  useEffect(() => {
    dispatch(getUniversity(slug));
  }, [dispatch, slug]);

  const getBackground = () => {
    try {
      const color = university?.name ? generateItemColor(university.name) : null;
      return color || "linear-gradient(to right, #4b6cb7, #182848)";
    } catch (error) {
      toast.error("Error generating background:", error);
      return "linear-gradient(to right, #4b6cb7, #182848)";
    }
  };

  return (
    <Wrapper>
      <div className="p-10 rounded-xl h-56 relative transition-all duration-500" style={{ background: getBackground() }}></div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="logo size-28 highlightbg -mt-10 ml-5 shadow-lg rounded-full">
            {university?.logo?.filePath && <img src={university.logo.filePath} alt={university?.logo?.publicId || "University logo"} className="w-full h-full object-cover" crossOrigin="anonymous" />}
          </div>
          <div className="pt-5">
            <h1 className="text-xl font-semibold textColor capitalize flex items-center gap-3 leading-none">
              {university?.name} <VscVerifiedFilled size={25} className="text-green-500" />
            </h1>
            <span className="text-sm leading-none block">Since {university?.edate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-5">
          <NavLink to="" className="icon cursor-pointer size-9 3xl:size-10 bg-pink-300 rounded-full flex items-center justify-center text-white">
            <MdLocationPin size={18} />
          </NavLink>
          <NavLink to={university?.website} target="_blank" className="icon cursor-pointer size-9 3xl:size-10 bg-teal-300 rounded-full flex items-center justify-center text-white">
            <BiWorld size={18} />
          </NavLink>
        </div>
      </div>

      <div className="p-5">
        <RichTextRenderer content={university?.description || ""} />
      </div>
    </Wrapper>
  );
};

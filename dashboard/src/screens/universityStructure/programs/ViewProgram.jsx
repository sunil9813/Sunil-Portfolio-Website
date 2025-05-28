import { getProgram } from "@/redux/slices/universityStructure/programSlice";
import { RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const ViewProgram = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { program } = useSelector((state) => state.program);

  useEffect(() => {
    dispatch(getProgram(slug));
  }, [dispatch, slug]);

  return (
    <Wrapper>
      <div className="rounded-xl h-56 relative transition-all duration-500">
        <img src={program?.thumbnail?.filePath} alt={program?.thumbnail?.publicId} className="w-full h-full object-cover rounded-xl" />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="logo size-28 highlightbg -mt-10 ml-5 shadow-xl rounded-full">
            {program?.university?.logo?.filePath && (
              <img src={program.university.logo.filePath} alt={program?.university?.logo.publicId || "University logo"} className="w-full h-full object-cover" crossOrigin="anonymous" />
            )}
          </div>
          <div className="pt-5">
            <h1 className="text-xl font-semibold textColor capitalize flex items-center gap-3 leading-none">
              {program?.name} <VscVerifiedFilled size={25} className="text-green-500" />
            </h1>
            <span className="text-sm leading-none block">{program?.faculty?.name}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <RichTextRenderer content={program?.description || ""} />
      </div>
    </Wrapper>
  );
};

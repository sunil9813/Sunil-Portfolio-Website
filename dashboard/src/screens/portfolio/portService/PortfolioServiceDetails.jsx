import { getService } from "@/redux/slices/portfolio/portServiceService";
import { RichTextRenderer, Wrapper } from "@/utils/Router";
import { useEffect } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const PortfolioServiceDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { service } = useSelector((state) => state.service);

  useEffect(() => {
    dispatch(getService(slug));
  }, [dispatch, slug]);

  return (
    <>
      <Wrapper>
        <div className="rounded-t-3xl h-72 relative transition-all duration-500">
          {service?.cover?.filePath && (
            <img src={service.cover.filePath} alt={service?.cover?.publicId || "Service cover"} className="w-full h-full object-cover rounded-t-3xl" crossOrigin="anonymous" />
          )}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-5">
            <div className="logo size-28 highlightbg -mt-10 ml-5 shadow-lg rounded-full">
              {service?.user?.avatar?.url && (
                <img src={service?.user?.avatar?.url} alt={service?.user?.avatar?.publicId || "University logo"} className="w-full h-full object-cover" crossOrigin="anonymous" />
              )}
            </div>
            <div className="pt-5">
              <h1 className="text-xl font-semibold textColor capitalize flex items-center gap-3 leading-none">
                {service?.title} <VscVerifiedFilled size={25} className="text-green-500" />
              </h1>
            </div>
          </div>
        </div>

        <div className="p-5">
          <RichTextRenderer content={service?.description || ""} />
        </div>
      </Wrapper>
    </>
  );
};

import { getCategory } from "@/redux/slices/resources/categorySlice";
import { BreadcrumbsComponent, Loader } from "@/utils/Router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export const ViewCategory = () => {
  const dispatch = useDispatch();
  const { id: categoryId } = useParams();
  const { category, isLoading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategory(categoryId));
  }, [dispatch, categoryId]);
  return (
    <>
      {isLoading && <Loader />}
      <BreadcrumbsComponent text="Category Details" />
      <div className="relative my-5 h-[20rem] w-full rounded-xl overflow-hidden flex justify-center items-center text-center">
        <div color="transparent" style={{ backgroundImage: `url(${category?.cover?.filePath})`, borderRadius: "12px" }} className="absolute inset-0 m-0 h-full w-full rounded-none bg-cover bg-center">
          <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-primarybg via-primarybg/70" />
        </div>

        <div className="relative py-14 px-6 md:px-12  ">
          <h1 className="uppercase text-white font-bold text-[50px]">{category?.title}</h1>
        </div>
      </div>
      <div className="w-full">
        <h1 className="uppercase text-white font-bold text-[50px]">Please show Realted Post here</h1>
      </div>
    </>
  );
};

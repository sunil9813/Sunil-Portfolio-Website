import { getCategoriesByType } from "@/redux/slices/resources/categorySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "./Loader";
import { CommonClassForInput } from "@/utils";

export const CategoryDropDown = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoriesByType(props.type));
  }, [dispatch, props.type]);

  const { categorys, loading } = useSelector((state) => state?.category);

  const handleChange = (event) => {
    const selectedCategory = categorys.find((category) => category._id === event.target.value);
    props.onChange(selectedCategory); // Send the entire selected category object, not just its ID
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <select name="visibility" value={props.value ? props.value.value : ""} onChange={handleChange} className={`${CommonClassForInput} capitalize px-4 py-2.5 text-textcolor text-sm outline-none`}>
          <option className="text-textcolor bg-primarybg" value="">
            Select Category
          </option>

          {categorys?.map((category) => (
            <option key={category?._id} className="text-textcolor bg-primarybg" value={category?._id}>
              {category?.title}
            </option>
          ))}
        </select>
      )}
    </>
  );
};

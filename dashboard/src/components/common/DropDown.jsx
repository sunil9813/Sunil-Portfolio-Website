import { getCategoriesByType } from "@/redux/slices/resources/categorySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "./Loader";
import { CommonClassForInput } from "@/utils";
import PropTypes from "prop-types";

const inputClassName =
  "w-full h-11 3xl:h-12 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

export const CategoryDropDown = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategoriesByType(props.type));
  }, [dispatch, props.type]);

  const { categorys, loading } = useSelector((state) => state?.category);

  const handleChange = (event) => {
    const selectedCategory = categorys?.find((category) => category?._id === event.target.value);
    props.onChange(selectedCategory); // Send the entire selected category object, not just its ID
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <select name="visibility" value={props.value ? props.value.value : ""} onChange={handleChange} className={`${CommonClassForInput + inputClassName} !bg-transparent !h-auto outline-none`}>
          <option className="textColor text-xs 3xl:text-sm dark:!bg-black dark:text-white" value="">
            Select Category
          </option>

          {categorys?.map((category) => (
            <option key={category?._id} className="textColor capitalize text-xs 3xl:text-sm dark:!bg-black dark:text-white" value={category?._id}>
              {category?.title}
            </option>
          ))}
        </select>
      )}
    </>
  );
};
CategoryDropDown.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

CategoryDropDown.defaultProps = {
  disabled: false,
  placeholder: "Select Category",
  value: null,
  className: "",
  isLoading: false,
};

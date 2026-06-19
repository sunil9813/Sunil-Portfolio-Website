import { getCategoriesByType } from "@/redux/slices/resources/categorySlice";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "./Loader";
import PropTypes from "prop-types";

export const CategoryDropDown = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getCategoriesByType(props.type));
  }, [dispatch, props.type]);

  const { categorys, loading } = useSelector((state) => state?.category);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category) => {
    setIsOpen(false);
    props.onChange(category); // Send the entire selected category object
  };

  const selectedCategory = props.value;

  if (loading || props.isLoading) {
    return (
      <div className="w-full h-11 3xl:h-12 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger/button */}
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${selectedCategory ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          cursor-pointer
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={() => !props.disabled && setIsOpen(!isOpen)}
        disabled={props.disabled}
      >
        <span className="truncate">{selectedCategory ? selectedCategory.title : props.placeholder}</span>
        <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && !props.disabled && (
        <div
          className="
      absolute top-full left-0 right-0 z-50 mt-1
      bg-white dark:bg-gray-900
      border border-gray-100 dark:border-gray-800/50
      rounded-3xl
      shadow-lg dark:shadow-gray-900/50
      overflow-hidden
    "
        >
          <div
            className="
        max-h-60 overflow-y-auto 
        scrollbar scrollbar-thin scrollbar-thumb-gray-300/50 
        scrollbar-track-transparent hover:scrollbar-thumb-gray-400/70
        dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-500/70
      "
          >
            <button
              type="button"
              className={`
                w-full text-left
                px-4 py-3
                text-xs 3xl:text-sm
                capitalize
                ${!selectedCategory ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                transition-colors duration-150
                border-b border-gray-100 dark:border-gray-800/50
                rounded-t-3xl
              `}
              onClick={() => handleSelect(null)}
            >
              Select Category
            </button>

            {categorys?.map((category, index) => (
              <button
                key={category?._id}
                type="button"
                className={`
                  w-full text-left
                  px-4 py-3
                  text-xs 3xl:text-sm
                  capitalize
                  ${
                    selectedCategory?._id === category?._id
                      ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                  transition-colors duration-150
                  border-b border-gray-100 dark:border-gray-800/50 last:border-b-0
                  ${index === categorys.length - 1 ? "rounded-b-3xl" : ""}
                `}
                onClick={() => handleSelect(category)}
              >
                {category?.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
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

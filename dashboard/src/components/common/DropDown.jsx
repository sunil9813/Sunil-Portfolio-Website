import { getCategoriesByType } from "@/redux/slices/resources/categorySlice";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "./Loader";
import PropTypes from "prop-types";

export const CategoryDropDown = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(getCategoriesByType(props.type));
  }, [dispatch, props.type]);

  const { categorys, loading } = useSelector((state) => state?.category);
  const selectedCategory = props.value;

  const updateDropdownPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const gap = 8;
    const padding = 14;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = triggerRect.bottom + gap;
    let left = triggerRect.left;

    if (left + dropdownRect.width > viewportWidth - padding) {
      left = Math.max(padding, triggerRect.right - dropdownRect.width);
    }

    if (left < padding) {
      left = padding;
    }

    if (top + dropdownRect.height > viewportHeight - padding) {
      top = triggerRect.top - dropdownRect.height - gap;
    }

    if (top < padding) {
      top = padding;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedDropdown = dropdownRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      requestAnimationFrame(updateDropdownPosition);

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen]);

  const handleSelect = (category) => {
    setIsOpen(false);
    props.onChange(category);
  };

  if (loading || props.isLoading) {
    return (
      <div className={`flex h-11 w-full items-center justify-center 3xl:h-12 ${props.className}`}>
        <Loader />
      </div>
    );
  }

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && !props.disabled && (
        <motion.div
          ref={dropdownRef}
          className="
            fixed z-[2147483647]
            rounded-xl border border-gray-800/30
            bg-dark-surface2
            p-2
            shadow-dropDownDark
          "
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: triggerRef.current?.offsetWidth || 240,
            minWidth: "200px",
            originX: position.left > window.innerWidth / 2 ? 1 : 0,
          }}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            <button
              type="button"
              className={`
                flex h-10 w-full items-center gap-3 rounded-xl border px-3
                text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
                ${!selectedCategory ? "border-white/[0.05] bg-white/[0.018] text-white/75" : "border-transparent text-white/35 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/65"}
              `}
              onClick={() => handleSelect(null)}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] text-[10px] font-bold text-white/35">S</span>

              <span className="min-w-0 truncate">Select Category</span>
            </button>

            {categorys?.map((category) => (
              <button
                key={category?._id}
                type="button"
                className={`
                  flex h-10 w-full items-center gap-3 rounded-xl border px-3
                  text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
                  ${
                    selectedCategory?._id === category?._id
                      ? "border-white/[0.05] bg-white/[0.018] text-white/75"
                      : "border-transparent text-white/35 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/65"
                  }
                `}
                onClick={() => handleSelect(category)}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] text-[10px] font-bold text-white/35">
                  {category?.title?.charAt(0)?.toUpperCase() || "C"}
                </span>

                <span className="min-w-0 truncate">{category?.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`relative w-full ${props.className}`}>
        <button
          ref={triggerRef}
          type="button"
          className={`
            flex h-11 w-full items-center justify-between gap-3 rounded-xl px-5  
            text-left transition-all duration-300 3xl:h-12
            border-white/[0.06] bg-white/[0.016] text-white/55
            hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white/75
            focus:outline-none
            ${isOpen ? "border-white/[0.14] bg-white/[0.035] text-white/80" : ""}
            ${props.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          `}
          onClick={() => !props.disabled && setIsOpen((prev) => !prev)}
          disabled={props.disabled}
        >
          <span className="min-w-0 truncate text-xs font-semibold 3xl:text-sm">{selectedCategory ? selectedCategory.title : props.placeholder}</span>

          <svg className={`size-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {typeof document !== "undefined" ? createPortal(dropdownContent, document.body) : dropdownContent}
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

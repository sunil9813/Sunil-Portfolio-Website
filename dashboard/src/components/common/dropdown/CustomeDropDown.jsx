import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

export const CustomDropdown = ({ value, onChange, name, options = [], placeholder = "Select an option", disabled = false, className = "", isLoading = false, clearable = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const updateDropdownPosition = () => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    const gap = 8;
    const padding = 12;
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

  const handleSelect = (selectedValue) => {
    setIsOpen(false);

    if (onChange) {
      onChange({ target: { name, value: selectedValue } });
    }
  };

  const handleClear = (event) => {
    event.stopPropagation();
    handleSelect("");
  };

  if (isLoading) {
    return (
      <div
        className={`
          flex h-11 w-full items-center justify-center rounded-xl border px-5 3xl:h-12
          border-white/[0.06] bg-white/[0.018]
          ${className}
        `}
      >
        <div className="flex animate-pulse items-center gap-2">
          <div className="size-4 rounded-full bg-white/[0.08]" />
          <div className="h-3 w-24 rounded bg-white/[0.08]" />
        </div>
      </div>
    );
  }

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && !disabled && (
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
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    flex h-10 w-full items-center gap-3 rounded-xl border px-3
                    text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
                    ${
                      value === option.value
                        ? "border-white/[0.05] bg-white/[0.018] text-white/75"
                        : "border-transparent text-white/35 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/65"
                    }
                  `}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018] text-[10px] font-bold text-white/35">
                    {option?.label?.charAt(0)?.toUpperCase() || "O"}
                  </span>

                  <span className="min-w-0 truncate">{option.label}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-xs italic text-white/35 3xl:text-sm">No options available</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`relative w-full ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          className={`
            flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-5
            text-left transition-all duration-300 3xl:h-12
            border-white/[0.06] bg-white/[0.018]
            ${value ? "text-white/75" : "text-white/35"}
            hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-white/75
            focus:outline-none
            ${isOpen ? "border-white/[0.14] bg-white/[0.035] text-white/80" : ""}
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          `}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...props}
        >
          <span className="min-w-0 flex-1 truncate text-left text-xs font-semibold 3xl:text-sm">{selectedOption ? selectedOption.label : placeholder}</span>

          <span className="ml-2 flex items-center gap-2">
            {clearable && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleClear(event);
                  }
                }}
                className="flex size-5 items-center justify-center text-white/35 transition hover:text-white/70"
                aria-label="Clear selection"
              >
                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}

            <svg className={`size-4 text-white/35 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {typeof document !== "undefined" ? createPortal(dropdownContent, document.body) : dropdownContent}
    </>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  clearable: PropTypes.bool,
};

CustomDropdown.defaultProps = {
  placeholder: "Select an option",
  disabled: false,
  className: "",
  isLoading: false,
  clearable: false,
};

export const VisibilityDropdown = (props) => (
  <CustomDropdown
    {...props}
    placeholder="Select Visibility"
    options={[
      { value: "public", label: "Public" },
      { value: "private", label: "Private" },
    ]}
  />
);

export const TypeVisiDropdown = (props) => (
  <CustomDropdown
    {...props}
    placeholder="Select Visibility"
    options={[
      { value: "Public", label: "Public" },
      { value: "Private", label: "Private" },
    ]}
  />
);

export const AccessTypeDropdown = (props) => (
  <CustomDropdown
    {...props}
    placeholder="Select Visibility"
    options={[
      { value: "unpaid", label: "Free" },
      { value: "paid", label: "Paid" },
    ]}
  />
);

export const TypeDropdown = (props) => (
  <CustomDropdown
    {...props}
    placeholder="Select Type"
    options={[
      { value: "blog", label: "Blog" },
      { value: "project", label: "Project" },
    ]}
  />
);

export const FilterDropdownbyDays = (props) => (
  <CustomDropdown
    {...props}
    placeholder="Last 28 Days"
    options={[
      { value: "28days", label: "Last 28 Days" },
      { value: "14days", label: "Last 14 Days" },
      { value: "7days", label: "Last 7 Days" },
    ]}
  />
);

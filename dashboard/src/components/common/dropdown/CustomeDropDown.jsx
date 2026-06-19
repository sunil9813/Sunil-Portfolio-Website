import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

export const CustomDropdown = ({ value, onChange, name, options = [], placeholder = "Select an option", disabled = false, className = "", isLoading = false, clearable = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSelect = (selectedValue) => {
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { name, value: selectedValue } });
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    handleSelect("");
  };

  const selectedOption = options.find((opt) => opt.value === value);

  if (isLoading) {
    return (
      <div
        className={`
        w-full h-11 3xl:h-12 px-5
        flex items-center justify-center
        bg-white dark:bg-gray-900
        border border-gray-100 dark:border-gray-800/50
        rounded-full
        ${className}
      `}
      >
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown trigger/button */}
      <button
        type="button"
        className={`
          w-full h-11 3xl:h-12 px-5
          text-left
          ${value ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"}
          text-xs 3xl:text-sm
          border border-gray-100 dark:border-gray-800/50
          hover:border-gray-200 dark:hover:border-gray-700
          focus:border-gray-200 dark:focus:border-gray-800
          focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700
          rounded-full
          appearance-none
          transition-all duration-200
          flex items-center justify-between
          ${isOpen ? "border-gray-200 dark:border-gray-700 ring-1 ring-gray-200 dark:ring-gray-700" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
      >
        <span className="truncate flex-1 text-left">{selectedOption ? selectedOption.label : placeholder}</span>

        <div className="flex items-center gap-2 ml-2">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="
                w-5 h-5 flex items-center justify-center
                text-gray-400 hover:text-gray-600
                dark:text-gray-500 dark:hover:text-gray-300
                focus:outline-none
                z-10
              "
              aria-label="Clear selection"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <svg className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown menu - FIXED SCROLLBAR */}
      {isOpen && !disabled && (
        <div
          className="
            absolute top-full left-0 right-0 z-50 mt-2
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
              scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 
              scrollbar-track-gray-100 dark:scrollbar-track-gray-900
            "
            style={{
              maxHeight: "15rem", // 60 * 0.25rem = 15rem
            }}
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-full text-left
                    px-4 py-3
                    text-xs 3xl:text-sm
                    transition-colors duration-150
                    ${index < options.length - 1 ? "border-b border-gray-100 dark:border-gray-800/50" : ""}
                    ${value === option.value ? "bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}
                    ${index === 0 ? "rounded-t-xl" : ""}
                    ${index === options.length - 1 ? "rounded-b-xl" : ""}
                  `}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs 3xl:text-sm text-gray-500 dark:text-gray-400 italic text-center">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
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

// Pre-configured dropdowns for common use cases
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
      // { value: "news", label: "News" },
      // { value: "tutorial", label: "Tutorial" },
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

import Select from "react-select";
import { Tooltip } from "@material-tailwind/react";
import { CiCircleQuestion } from "react-icons/ci";
import { Wrapper, InputTitle, InputLabel } from "@/utils/Router";
import { getIconUrls, iconMapping } from "@/utils";
import { useState } from "react";
import PropTypes from "prop-types";

// Component to handle icon with fallback URLs
export const IconWithFallback = ({ value, alt, className }) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const urls = getIconUrls(value);

  const handleError = (e) => {
    if (urlIndex < urls.length - 1) {
      setUrlIndex(urlIndex + 1);
    } else {
      e.target.style.display = "none";
    }
  };

  return <img src={urls[urlIndex]} alt={alt} className={className} onError={handleError} />;
};

// Custom Option component to show icons in dropdown
export const CustomOption = ({ innerProps, label, data }) => (
  <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer bg-transparent">
    <IconWithFallback value={data.value} alt={`${label} icon`} className="w-5 h-5 mr-2" />
    <span>{label}</span>
  </div>
);

// Custom MultiValue component to show icons in selected values
const CustomMultiValue = ({ data, removeProps }) => (
  <div className="flex items-center bg-transparent rounded px-2 py-1 m-1">
    <IconWithFallback value={data.value} alt={`${data.label} icon`} className="w-5 h-5 mr-1" />
    <span className="text-sm">{data.label}</span>
    <button {...removeProps} className="ml-1 text-red-500 hover:text-red-700" title="Remove tool">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const inputClassName =
  "w-full min-h-11 h-auto 3xl:h-12 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-xl placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50";

// Custom styles for react-select
const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "1px solid transparent",
    borderRadius: "50px",
    boxShadow: "none",
    minHeight: "2.75rem",
    padding: "0.25rem",
    "&:hover": {
      borderColor: "transparent",
    },
    "&:focus": {
      borderColor: "transparent",
      boxShadow: "none",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "inherit",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    padding: "0",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    color: "inherit",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#ef4444",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "0.75rem",
    color: "#9ca3af",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#2a2a2a",
    border: "none",
    boxShadow: "none",
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "rgba(243, 244, 246, 0.1)" : "transparent",
    color: "inherit",
    "&:hover": {
      backgroundColor: "rgba(243, 244, 246, 0.8)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 0.5rem",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      color: "#ef4444",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      color: "inherit",
    },
  }),
};

export const ProjectToolsSection = ({ formats, setProject, formatError }) => {
  const handleFormatChange = (selectedOptions) => {
    const newFormats = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    const hasDuplicate = newFormats.some((format, index) => newFormats.indexOf(format) !== index);
    if (hasDuplicate) {
      setProject((prev) => ({
        ...prev,
        formatError: "Formats cannot be duplicates.",
      }));
      return;
    }
    setProject((prev) => ({
      ...prev,
      formats: newFormats,
      formatError: "",
    }));
  };

  return (
    <Wrapper className="p-5">
      <InputTitle>Project Tools</InputTitle>

      <div className="input py-3">
        <div className="flex items-center gap-1">
          <InputLabel className="my-2">Tools</InputLabel>
          <Tooltip className="bg-black text-white dark:bg-white dark:text-black text-xs" content="Tools or languages used to build the project (e.g., CSS, HTML, JavaScript)" placement="right">
            <button>
              <CiCircleQuestion />
            </button>
          </Tooltip>
        </div>
        <Select
          isMulti
          options={iconMapping}
          value={iconMapping.filter((option) => formats.includes(option.value))}
          onChange={handleFormatChange}
          components={{ Option: CustomOption, MultiValue: CustomMultiValue }}
          placeholder="Select programming languages..."
          styles={selectStyles}
          className={inputClassName}
        />

        {formatError && <p className="text-red-500 text-xs 3xl:text-sm mt-1">{formatError}</p>}
      </div>
    </Wrapper>
  );
};

// IconWithFallback
IconWithFallback.propTypes = {
  value: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};
IconWithFallback.defaultProps = {
  className: "",
};

// CustomOption
CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

// CustomMultiValue
CustomMultiValue.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  removeProps: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }).isRequired,
};

// ProjectToolsSection
ProjectToolsSection.propTypes = {
  formats: PropTypes.arrayOf(PropTypes.string).isRequired,
  setProject: PropTypes.func.isRequired,
  formatError: PropTypes.string,
  iconMapping: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
ProjectToolsSection.defaultProps = {
  formatError: "",
  iconMapping: iconMapping,
};

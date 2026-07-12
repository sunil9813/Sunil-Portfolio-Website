import Select from "react-select";
import { Tooltip } from "@material-tailwind/react";
import { CiCircleQuestion } from "react-icons/ci";
import { Wrapper, InputTitle, InputLabel } from "@/routes";
import { getIconUrls, iconMapping } from "@/utils";
import { useState } from "react";
import PropTypes from "prop-types";

export const IconWithFallback = ({ value, alt, className }) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const urls = getIconUrls(value);

  const handleError = (event) => {
    if (urlIndex < urls.length - 1) {
      setUrlIndex(urlIndex + 1);
    } else {
      event.target.style.display = "none";
    }
  };

  return <img src={urls[urlIndex]} alt={alt} className={className} onError={handleError} />;
};

export const CustomOption = ({ innerProps, label, data, isSelected }) => (
  <div
    {...innerProps}
    className={`
      flex h-10 cursor-pointer items-center gap-3 rounded-xl border px-3
      text-left text-xs font-semibold capitalize transition-all duration-300 3xl:text-sm
      ${isSelected ? "border-white/[0.06] bg-white/[0.035] text-white/85" : "border-transparent text-white/38 hover:border-white/[0.05] hover:bg-white/[0.018] hover:text-white/70"}
    `}
  >
    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.05] bg-white/[0.018]">
      <IconWithFallback value={data.value} alt={`${label} icon`} className="size-4" />
    </span>

    <span className="min-w-0 truncate">{label}</span>
  </div>
);

const CustomMultiValue = ({ data, removeProps }) => (
  <div className="m-1 flex h-8 items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.018] px-2 text-white/75">
    <span className="flex size-5 shrink-0 items-center justify-center">
      <IconWithFallback value={data.value} alt={`${data.label} icon`} className="size-4" />
    </span>

    <span className="text-[10px] font-semibold">{data.label}</span>

    <button {...removeProps} type="button" className="ml-0.5 flex size-5 items-center justify-center rounded-lg text-white/35 transition hover:bg-white/[0.04] hover:text-white/75" title="Remove tool">
      <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

const inputClassName = "w-full";

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "2.75rem",
    height: "auto",
    backgroundColor: state.menuIsOpen ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.018)",
    border: state.menuIsOpen ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "1rem",
    boxShadow: "none",
    padding: "0.35rem 0.45rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.03)",
      borderColor: "rgba(255,255,255,0.1)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    gap: "0.1rem",
    padding: "0 0.25rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.75rem",
    fontWeight: 600,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.75rem",
    fontWeight: 600,
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    margin: 0,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "inherit",
    padding: 0,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    color: "rgba(255,255,255,0.35)",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "rgba(255,255,255,0.35)",
    cursor: "pointer",
    "&:hover": {
      color: "rgba(255,255,255,0.75)",
    },
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.selectProps.menuIsOpen ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
    "&:hover": {
      color: "rgba(255,255,255,0.75)",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 2147483647,
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: "0.5rem",
    overflow: "hidden",
    borderRadius: "1rem",
    border: "1px solid rgba(255,255,255,0.045)",
    backgroundColor: "#191919",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
    padding: "0.625rem",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "19rem",
    padding: 0,
    paddingRight: "0.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.35) transparent",
  }),
  option: (provided) => ({
    ...provided,
    padding: 0,
    backgroundColor: "transparent",
    color: "inherit",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "transparent",
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

          <Tooltip className="bg-black text-xs text-white dark:bg-white dark:text-black" content="Tools or languages used to build the project (e.g., CSS, HTML, JavaScript)" placement="right">
            <button type="button">
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
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
          menuPosition="fixed"
          closeMenuOnSelect={false}
        />

        {formatError && <p className="mt-1 text-xs text-red-500 3xl:text-sm">{formatError}</p>}
      </div>
    </Wrapper>
  );
};

IconWithFallback.propTypes = {
  value: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

IconWithFallback.defaultProps = {
  className: "",
};

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
};

CustomOption.defaultProps = {
  isSelected: false,
};

CustomMultiValue.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  removeProps: PropTypes.object.isRequired,
};

ProjectToolsSection.propTypes = {
  formats: PropTypes.arrayOf(PropTypes.string).isRequired,
  setProject: PropTypes.func.isRequired,
  formatError: PropTypes.string,
  iconMapping: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

ProjectToolsSection.defaultProps = {
  formatError: "",
  iconMapping: iconMapping,
};

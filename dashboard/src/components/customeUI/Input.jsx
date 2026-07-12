import PropTypes from "prop-types";

const inputBaseClass = `
  w-full h-11 3xl:h-12 px-5
  text-xs 3xl:text-sm font-semibold
  rounded-xl border
  text-white/75
  border-white/[0.06]
  bg-white/[0.018]
  shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
  outline-none
  transition-all duration-300
  placeholder:text-xs placeholder:3xl:text-sm
  placeholder:text-white/28
  hover:border-white/[0.1]
  hover:bg-white/[0.03]
  focus:border-white/[0.14]
  focus:bg-white/[0.035]
  focus:text-white/85
  disabled:cursor-not-allowed
  disabled:opacity-50
`;

export const Input = ({ placeholder, type, value, name, handleChange, className }) => {
  return <input className={`${inputBaseClass} ${className || ""}`} placeholder={placeholder} type={type} value={value} name={name} onChange={handleChange} />;
};

export const TextareaInput = ({ placeholder, type, value, name, handleChange, className }) => {
  return (
    <textarea
      className={`
        ${inputBaseClass}
        min-h-[130px] resize-y py-4 leading-relaxed
        ${className || ""}
      `}
      placeholder={placeholder}
      type={type}
      value={value}
      name={name}
      onChange={handleChange}
      rows={5}
    />
  );
};

export const InputForResume = ({ placeholder, type, value, name, handleChange, className }) => {
  return (
    <input
      className={`
        w-full h-10 3xl:h-12 px-5
        text-xs 3xl:text-sm font-semibold
        rounded-xl border
        text-white/75
        border-white/[0.06]
        bg-white/[0.018]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]
        outline-none
        transition-all duration-300
        placeholder:text-white/28
        hover:border-white/[0.1]
        hover:bg-white/[0.03]
        focus:border-white/[0.14]
        focus:bg-white/[0.035]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className || ""}
      `}
      placeholder={placeholder}
      type={type}
      value={value}
      name={name}
      onChange={handleChange}
    />
  );
};

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func,
};

TextareaInput.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func,
};

InputForResume.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func,
};

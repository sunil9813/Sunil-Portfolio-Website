import PropTypes from "prop-types";

export const Input = ({ placeholder, type, value, name, handleChange, className }) => {
  return (
    <>
      <input
        className={`${className} w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 dark:border-gray-800/50 focus:border-gray-200 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
        placeholder={placeholder}
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
      ></input>
    </>
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

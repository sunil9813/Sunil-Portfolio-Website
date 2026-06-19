import PropTypes from "prop-types";

export const Input = ({ placeholder, type, value, name, handleChange, className }) => {
  return (
    <>
      <input
        className={`${className} w-full h-11 3xl:h-12 px-5 textColor textSizeSm border border-gray-100 bg-gray-900/5 dark:bg-gray-50/5 dark:border-gray-800/50 dark:focus:border-gray-800 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
        placeholder={placeholder}
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
      ></input>
    </>
  );
};
export const InputForResume = ({ placeholder, type, value, name, handleChange, className }) => {
  return (
    <>
      <input
        // className={`${className} w-full h-10 3xl:h-12 px-5 textColor textSizeSm border border-gray-500/20 dark:border-gray-50/30 focus:border-gray-500/40 dark:focus:border-gray-50/30 rounded-full placeholder:text-xs placeholder:3xl:text-sm placeholder:text-gray-800/20 dark:placeholder:text-gray-500/50`}
        className={`${className} w-full h-10 3xl:h-12 px-5 textColor textSizeSm bg-gray-900/5 dark:bg-gray-50/5`}
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
InputForResume.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func,
};

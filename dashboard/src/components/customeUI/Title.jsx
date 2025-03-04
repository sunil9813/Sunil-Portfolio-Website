import PropTypes from "prop-types";

export const HeadingTwo = ({ children, className }) => {
  return (
    <>
      <h2 className={`text-3xl font-semibold ${className}`}>{children}</h2>
    </>
  );
};
export const InputLabel = ({ text, className }) => {
  return (
    <>
      <span className={`text-sm block text-textcolor ${className}`}>{text}</span>
    </>
  );
};

HeadingTwo.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
InputLabel.propTypes = {
  text: PropTypes.any,
  className: PropTypes.any,
};

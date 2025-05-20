import PropTypes from "prop-types";

export const HeadingTwo = ({ children, className }) => {
  return (
    <>
      <h2 className={`capitalize text-xl 3xl:text-2xl font-semibold textColor ${className}`}>{children}</h2>
    </>
  );
};
export const HeadingThree = ({ children, className }) => {
  return (
    <>
      <h3 className={`capitalize text-lg 3xl:text-xl font-[500] textColor ${className}`}>{children}</h3>
    </>
  );
};
export const InputTitle = ({ children, className }) => {
  return (
    <>
      <h3 className={`capitalize text-sm 3xl:text-lg font-[500] textColor ${className}`}>{children}</h3>
    </>
  );
};
export const InputLabel = ({ children, className }) => {
  return (
    <>
      <span className={`textSizeSm block text-gray-600 dark:text-gray-300 ${className}`}>{children}</span>
    </>
  );
};

HeadingThree.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
HeadingTwo.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
InputLabel.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};
InputTitle.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};

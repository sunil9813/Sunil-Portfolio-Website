import PropTypes from "prop-types";

export const Wrapper = ({ children, className }) => {
  return (
    <>
      <div className={`bg-sidebarbg my-5 rounded-xl border border-gray-50/20 w-full ${className}`}>{children}</div>
    </>
  );
};
Wrapper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
};

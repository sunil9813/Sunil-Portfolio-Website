import PropTypes from "prop-types";

export const Logo = ({ size = "medium", className }) => {
  const sizeClass = {
    xs: "scale-[0.40]",
    small: "scale-50",
    medium: "scale-75",
    large: "scale-100",
  };
  return (
    <>
      <div className={`main-logo ${sizeClass[size]} ${className}`}>
        <div className="logo-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};
Logo.propTypes = {
  className: PropTypes.any,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

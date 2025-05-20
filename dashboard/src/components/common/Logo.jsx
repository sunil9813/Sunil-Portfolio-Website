import PropTypes from "prop-types";
import LogoImg from "../../assets/logo.svg";

/* export const Logo = ({ size = "medium", className }) => {
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
}; */

export const Logo = () => {
  return (
    <>
      <div className="logo h-11 w-11 3xl:w-14 3xl:h-14">
        <img src={LogoImg} alt="LogoImg" className="p-1.5 3xl:p-3" />
      </div>
    </>
  );
};

Logo.propTypes = {
  className: PropTypes.any,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

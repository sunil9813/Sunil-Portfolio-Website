import PropTypes from "prop-types";

export const Logo = () => {
  return (
    <>
      <div className="logo size-6 rounded-full relative">
        <svg className="css-8cwg0t" focusable="false" viewBox="0 0 39.336 44">
          <g transform="translate(-312.85 -290.661)">
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(327.923 290.661)" fill="#ffffff"></ellipse>
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(327.923 325.472)" fill="#ffffff"></ellipse>
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(312.85 299.364)" fill="#ffffff"></ellipse>
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(342.997 316.769)" fill="#ffffff"></ellipse>
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(342.997 299.364)" fill="#ffffff"></ellipse>
            <ellipse cx="4.594" cy="4.594" rx="4.594" ry="4.594" transform="translate(312.85 316.769)" fill="#ffffff"></ellipse>
          </g>
        </svg>
      </div>
    </>
  );
};

Logo.propTypes = {
  className: PropTypes.any,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

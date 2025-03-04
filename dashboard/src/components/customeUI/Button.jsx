import PropTypes from "prop-types";

export const PrimaryButton = ({ text, onclick }) => {
  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty("--mouse-x", `${x}px`);
    button.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="primary-btn" onMouseMove={handleMouseMove} onClick={onclick}>
      <button className="primary-btn__button">
        <div className="primary-btn__background">
          <div className="primary-btn__background-glow"></div>
        </div>

        <div className="primary-btn__contents uppercase">{text}</div>
      </button>
    </div>
  );
};

export const SecondaryButton = ({ children, onClick, className }) => {
  return (
    <button className={`secondary-button ${className}`} onClick={onClick}>
      {children}
      <span className="button-border"></span>
    </button>
  );
};

export const IconButton = ({ icon, text, className }) => {
  return (
    <button className={`iconbtn flex items-center justify-center gap-2 text-center bg-black py-2 px-3 text-sm shadow-md rounded-md border border-white/20 ${className}`}>
      <span>{icon}</span>
      {text}
    </button>
  );
};

PrimaryButton.propTypes = {
  text: PropTypes.string,
  onclick: PropTypes.any,
};
SecondaryButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  onClick: PropTypes.any,
};
IconButton.propTypes = {
  icon: PropTypes.any,
  text: PropTypes.string,
  className: PropTypes.any,
};

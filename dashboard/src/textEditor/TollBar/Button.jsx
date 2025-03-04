import { useCallback } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const Button = ({ children, active, disabled, onMouseDown, onClick }) => {
  const getActiveStyle = useCallback(() => {
    if (active) return "bg-primarybg  text-white ";
    else return "text-textcolor bg-sidebarbg";
  }, [active]);

  const commonClasses = "p-2 rounded text-lg hover:scale-110 hover:shadow-md transition";

  return (
    <button type="button" onMouseDown={onMouseDown} onClick={onClick} className={classnames(commonClasses, getActiveStyle())} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onClick: PropTypes.func,
};

// Default props
Button.defaultProps = {
  active: false,
  disabled: false,
  onMouseDown: () => {},
  onClick: () => {},
};

export default Button;

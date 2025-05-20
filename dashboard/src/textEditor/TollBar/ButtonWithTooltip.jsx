import { useCallback } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import "./ButtonWithTooltip.scss"; // We'll create this SCSS file

const ButtonWithTooltip = ({ children, active, disabled, onMouseDown, onClick, tooltip, tooltipPosition = "top" }) => {
  const getPositionClass = useCallback(() => {
    return `tooltip--${tooltipPosition}`;
  }, [tooltipPosition]);

  return (
    <div className="tooltip-container">
      <Button active={active} disabled={disabled} onMouseDown={onMouseDown} onClick={onClick}>
        {children}
      </Button>
      {tooltip && (
        <div className={`tooltip ${getPositionClass()}`}>
          {tooltip}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

ButtonWithTooltip.propTypes = {
  ...Button.propTypes,
  tooltip: PropTypes.string,
  tooltipPosition: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

ButtonWithTooltip.defaultProps = {
  ...Button.defaultProps,
  tooltip: null,
  tooltipPosition: "top",
};

export default ButtonWithTooltip;

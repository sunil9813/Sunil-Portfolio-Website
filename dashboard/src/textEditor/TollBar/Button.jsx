import { useCallback, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";

const Button = ({ children, active, disabled, onMouseDown, onClick, tooltip }) => {
  const buttonRef = useRef(null);

  const getActiveStyle = useCallback(() => {
    if (active) return "bg-green-400 text-white";
    return "text-textcolor bg-sidebarbg";
  }, [active]);

  const commonClasses = "w-8 h-8 flex justify-center items-center rounded text-lg hover:bg-green-400 hover:text-white hover:scale-110 hover:shadow-md transition";

  return (
    <div className="relative inline-block" ref={buttonRef}>
      {tooltip ? (
        <Tooltip
          content={tooltip}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 10 },
          }}
          className="bg-black text-white px-3 py-2 text-xs shadow-xl rounded-none"
          placement="top"
        >
          <button type="button" onMouseDown={onMouseDown} onClick={onClick} className={classnames(commonClasses, getActiveStyle())} disabled={disabled}>
            {children}
          </button>
        </Tooltip>
      ) : (
        <button type="button" onMouseDown={onMouseDown} onClick={onClick} className={classnames(commonClasses, getActiveStyle())} disabled={disabled}>
          {children}
        </button>
      )}
    </div>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
};

Button.defaultProps = {
  active: false,
  disabled: false,
  onMouseDown: () => {},
  onClick: () => {},
  tooltip: null,
};

export default Button;

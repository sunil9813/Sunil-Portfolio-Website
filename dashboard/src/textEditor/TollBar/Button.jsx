import { useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";

const tooltipClass =
  "rounded-xl border border-white/[0.08] bg-[#080c12]/95 px-3 py-2 text-[10px] font-semibold tracking-wide text-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl";

const Button = ({ children, active, disabled, onMouseDown, onClick, tooltip }) => {
  const buttonRef = useRef(null);

  const buttonClasses = classnames(
    [
      "group/editor-btn",
      "relative",
      "flex",
      "size-8",
      "items-center",
      "justify-center",
      "overflow-hidden",
      "rounded-xl",
      "border",
      "text-sm",
      "leading-none",
      "outline-none",
      "transition-all",
      "duration-300",
      "3xl:size-9",

      "before:pointer-events-none",
      "before:absolute",
      "before:inset-0",
      "before:rounded-xl",
      "before:bg-gradient-to-br",
      "before:from-white/[0.07]",
      "before:via-transparent",
      "before:to-white/[0.015]",
      "before:opacity-80",

      "after:pointer-events-none",
      "after:absolute",
      "after:left-2",
      "after:right-2",
      "after:top-px",
      "after:h-px",
      "after:rounded-full",
      "after:bg-gradient-to-r",
      "after:from-transparent",
      "after:via-white/35",
      "after:to-transparent",
      "after:opacity-60",

      "hover:-translate-y-0.5",
      "active:translate-y-0",
      "active:scale-95",

      "focus-visible:ring-2",
      "focus-visible:ring-emerald-300/35",
      "focus-visible:ring-offset-2",
      "focus-visible:ring-offset-[#080b10]",
    ].join(" "),

    disabled && "cursor-not-allowed border-white/[0.035] bg-dark-highlight/40 text-white/20 shadow-none hover:translate-y-0 active:scale-100",

    !disabled && active && "border-emerald-300/[0.14] bg-emerald-300/[0.035] text-emerald-100/80 shadow-[0_8px_24px_rgba(16,185,129,0.08)]",

    !disabled && !active && "border-white/[0.055] bg-dark-highlight text-white/55 shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:border-white/[0.1] hover:bg-white/[0.026] hover:text-white/75",
  );

  const button = (
    <button type="button" ref={buttonRef} onMouseDown={onMouseDown} onClick={onClick} className={buttonClasses} disabled={disabled} aria-pressed={active} aria-label={tooltip || "Editor button"}>
      <span className="relative z-10 flex items-center justify-center text-inherit [&_svg]:size-4">{children}</span>
    </button>
  );

  return (
    <div className="relative inline-flex">
      {tooltip ? (
        <Tooltip
          content={tooltip}
          placement="top"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.96, y: 6 },
          }}
          className={tooltipClass}
        >
          {button}
        </Tooltip>
      ) : (
        button
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

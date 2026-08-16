import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { BsCheck2, BsChevronDown } from "react-icons/bs";

export const CustomDropdown = ({
  value,
  onChange,
  options = [],
  className = "",
  buttonClassName = "",
  menuClassName = "",
  optionClassName = "",
  placeholder = "Select option",
  align = "right",
}) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) || null;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className={`relative z-[120] min-w-[150px] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-12 w-full items-center justify-between gap-3 rounded-full px-4 text-left text-[11px] font-semibold textColor shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl transition ${
          open ? "bg-[#335240]/22" : "bg-white/[0.032] hover:bg-[#335240]/12"
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <BsChevronDown size={14} className={`shrink-0 text-emerald-100/45 transition ${open ? "rotate-180 text-emerald-100/75" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute ${align === "left" ? "left-0" : "right-0"} top-[calc(100%+10px)] z-[9999] w-full min-w-[205px] overflow-hidden rounded-[1.15rem] bg-[#080f12]/[0.92] p-1.5 shadow-[0_30px_95px_rgba(0,0,0,0.62),inset_0_1px_0_rgba(255,255,255,.035)] backdrop-blur-[34px] ${menuClassName}`}
          role="listbox"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(51,82,64,.36),transparent_48%),radial-gradient(circle_at_100%_100%,rgba(103,232,249,.06),transparent_42%),linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.012))]"></div>
          {options.map((option) => {
            const active = option.value === value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`relative flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-3 py-2.5 text-left text-[11px] font-semibold transition ${
                  active ? "bg-[#335240]/34 text-emerald-100/90" : "text-white/52 hover:bg-white/[0.055] hover:text-white/82"
                } ${optionClassName}`}
                role="option"
                aria-selected={active}
              >
                <span className="truncate">{option.label}</span>
                {active && <BsCheck2 size={15} className="shrink-0 text-emerald-200/85" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    }),
  ),
  className: PropTypes.string,
  buttonClassName: PropTypes.string,
  menuClassName: PropTypes.string,
  optionClassName: PropTypes.string,
  placeholder: PropTypes.string,
  align: PropTypes.oneOf(["left", "right"]),
};

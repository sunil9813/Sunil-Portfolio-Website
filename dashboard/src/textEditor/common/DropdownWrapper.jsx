import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export const DropdownWrapper = ({ children, isOpen, onClose, className = "" }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`
        absolute left-0 top-10 z-[9999]
        min-w-[220px]
        rounded-2xl border border-white/[0.06]
        bg-[#101215]/95
        p-2
        text-white
        shadow-[0_22px_60px_rgba(0,0,0,0.58)]
        backdrop-blur-2xl
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-emerald-400/[0.045] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 left-4 size-24 rounded-full bg-white/[0.025] blur-2xl" />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

DropdownWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

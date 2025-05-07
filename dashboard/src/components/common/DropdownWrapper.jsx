import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

export const DropdownWrapper = ({ children, isOpen, onClose, className = "" }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !dropdownRef.current.previousElementSibling?.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen && dropdownRef.current) {
      const trigger = dropdownRef.current.previousElementSibling;

      if (trigger) {
        const triggerRect = trigger.getBoundingClientRect();
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate preferred position (below trigger)
        let top = triggerRect.bottom + window.scrollY;
        let left = triggerRect.left + window.scrollX;

        // Adjust for right overflow
        if (left + dropdownRect.width > viewportWidth) {
          left = Math.max(0, triggerRect.right - dropdownRect.width + window.scrollX);
        }

        // Adjust for left overflow
        if (left < 0) {
          left = 0;
        }

        // Check bottom overflow - if doesn't fit below, show above
        if (top + dropdownRect.height > viewportHeight + window.scrollY) {
          top = triggerRect.top - dropdownRect.height + window.scrollY;
          // Ensure we don't go above viewport
          top = Math.max(window.scrollY, top);
        }

        setPosition({ top, left });

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className={`fixed z-50 bg-white dark:bg-dark-surface2 shadow-xl dark:shadow-dropDownDark border border-gray-100 dark:border-gray-800/30 rounded-xl p-5 ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            minWidth: "200px",
            originX: position.left > window.innerWidth / 2 ? 1 : 0, // Set transform origin based on position
          }}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

DropdownWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

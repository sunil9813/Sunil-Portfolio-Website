import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const ModalContainer = ({ visible, children, onClose }) => {
  const handleClose = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    if (!visible) return;

    const closeModal = ({ key }) => {
      if (key === "Escape") handleClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", closeModal);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", closeModal);
    };
  }, [visible, handleClose]);

  if (!visible) return null;

  return createPortal(
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
      className="
        fixed
        inset-0
        z-[9999999]
        flex
        items-center
        justify-center
        bg-black/55
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      {children}
    </div>,
    document.body,
  );
};

ModalContainer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

ModalContainer.defaultProps = {
  visible: false,
  onClose: () => {},
};

export default ModalContainer;

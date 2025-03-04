import { useCallback, useEffect, useId } from "react";
import PropTypes from "prop-types";

const ModalContainer = ({ visible, children, onClose }) => {
  const containerId = useId();
  const handleClose = useCallback(() => onClose && onClose(), [onClose]);

  const handleClick = ({ target }) => {
    if (target.id === containerId) handleClose();
  };

  useEffect(() => {
    const closeModal = ({ key }) => key === "Escape" && handleClose();

    document.addEventListener("keydown", closeModal);
    return () => document.removeEventListener("keydown", closeModal);
  }, [handleClose]);

  if (!visible) return null;
  return (
    <div id={containerId} onClick={handleClick} className="fixed inset-0 bg-primarybg bg-opacity-5 backdrop-blur-[2px] z-50 flex items-center justify-center">
      {children}
    </div>
  );
};
// PropTypes for type checking
ModalContainer.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

// Default props
ModalContainer.defaultProps = {
  visible: false,
  onClose: () => {},
};

export default ModalContainer;

import axios from "axios";
import PropTypes from "prop-types";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FiAlertTriangle, FiCheck, FiInfo, FiX } from "react-icons/fi";

import { router } from "./routes/Router";

import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const ToastCloseButton = ({ closeToast }) => {
  return (
    <button type="button" className="aurora-toast-close" onClick={closeToast} aria-label="Close notification">
      <FiX size={15} strokeWidth={2.2} />
    </button>
  );
};

ToastCloseButton.propTypes = {
  closeToast: PropTypes.func,
};

const ToastIcon = ({ type }) => {
  const iconMap = {
    success: <FiCheck size={16} strokeWidth={2.4} />,
    error: <FiInfo size={16} strokeWidth={2.4} />,
    warning: <FiAlertTriangle size={16} strokeWidth={2.2} />,
    info: <FiInfo size={16} strokeWidth={2.3} />,
    default: <FiInfo size={16} strokeWidth={2.3} />,
  };

  return (
    <span className={`aurora-toast-icon aurora-toast-icon--${type || "default"}`}>
      <span className="aurora-toast-icon__glow" />
      {iconMap[type] || iconMap.default}
    </span>
  );
};

ToastIcon.propTypes = {
  type: PropTypes.string,
};

const App = () => {
  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={4}
        theme="dark"
        className="aurora-toast-container"
        toastClassName={({ type }) => `aurora-toast aurora-toast--${type || "default"}`}
        bodyClassName="aurora-toast-body"
        progressClassName="aurora-toast-progress"
        closeButton={ToastCloseButton}
        icon={({ type }) => <ToastIcon type={type} />}
      />
    </>
  );
};

export default App;

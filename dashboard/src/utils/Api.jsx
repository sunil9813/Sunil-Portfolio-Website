// export const REACT_APP_BACKEND_URL = "http://localhost:5001/api/v1";
 // export const REACT_APP_BACKEND_URL = "https://backend-developer-portfolio.onrender.com/api/v1";
  export const REACT_APP_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || `http://${window.location.hostname}:5001/api/v1`;

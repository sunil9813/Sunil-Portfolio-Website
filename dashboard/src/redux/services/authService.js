import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../utils/Api";

axios.defaults.withCredentials = true;

export const API_URL = `${REACT_APP_BACKEND_URL}/auth/`;

const config = { withCredentials: true };

const getUserFromResponse = (data) => data?.profile || data?.user || data;
const getTokenFromResponse = (data) => data?.token || data?.accessToken || data?.profile?.token || data?.user?.token || "";

const saveLoggedInUser = (data) => {
  const user = getUserFromResponse(data);
  const token = getTokenFromResponse(data);

  localStorage.setItem("isLoggedIn", "true");

  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

const clearLoggedInUser = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
  localStorage.removeItem("admin");
  localStorage.removeItem("token");
};

export const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData, config);
  saveLoggedInUser(response.data);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "admin/login", userData, config);
  saveLoggedInUser(response.data);
  return response.data;
};

const logout = async () => {
  try {
    const response = await axios.get(API_URL + "logout", config);
    return response.data;
  } finally {
    clearLoggedInUser();
  }
};

const loginWithCode = async (code, email) => {
  const response = await axios.post(API_URL + `loginwith-otp/${encodeURIComponent(email)}`, { loginCode: code }, config);
  saveLoggedInUser(response.data);
  return response.data;
};

const loginWithGoogle = async (userToken) => {
  const response = await axios.post(API_URL + "google/callback", userToken, config);
  saveLoggedInUser(response.data);
  return response.data;
};

const getLogInStatus = async () => {
  const response = await axios.get(API_URL + "login-status", config);
  return response.data;
};

const getUserProfile = async () => {
  const response = await axios.get(API_URL + "profile", config);
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(API_URL + "profile/update", userData, config);
  return response.data;
};

const updateUserCover = async (userData) => {
  const response = await axios.put(API_URL + "profile/cover", userData, config);
  return response.data;
};

const sendVerificationEmail = async () => {
  const response = await axios.post(API_URL + "send-verification-email", {}, config);
  return response.data;
};

const verifyUser = async (verificationToken) => {
  const response = await axios.patch(`${API_URL}verify-account/${verificationToken}`, {}, config);
  return response.data;
};

const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "change-password", userData, config);
  return response.data;
};

const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgot-password", userData, config);
  return response.data;
};

const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(`${API_URL}reset-password/${resetToken}`, userData, config);
  return response.data;
};

const toggleFollow = async (userId) => {
  const response = await axios.patch(`${API_URL}toggleFollow/${userId}`, {}, config);
  return response.data;
};

const getAllUserByAdmin = async () => {
  const response = await axios.get(API_URL + "admin/users", config);
  return response.data;
};

const viewUserByAdmin = async (userId) => {
  const response = await axios.get(API_URL + `admin/user/${userId}`, config);
  return response.data;
};

const deleteUserByAdmin = async (id) => {
  const response = await axios.delete(API_URL + `admin/user/delete/${id}`, config);
  return response.data;
};

const updateUserByAdmin = async (userData) => {
  const response = await axios.patch(API_URL + "admin/user", userData, config);
  return response.data;
};

const sendLoginCode = async (email) => {
  const response = await axios.post(API_URL + `send-otp/${encodeURIComponent(email)}`, {}, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getLogInStatus,
  getUserProfile,
  updateUserProfile,
  updateUserCover,
  sendVerificationEmail,
  verifyUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUserByAdmin,
  viewUserByAdmin,
  deleteUserByAdmin,
  updateUserByAdmin,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  toggleFollow,
};

export default authService;

import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../utils/api";

export const API_URL = `${REACT_APP_BACKEND_URL}/auth/`;

// Validate email
export const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

//Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(API_URL + "admin/login", userData);
  return response.data;
};

const logout = async () => {
  const response = await axios.get(API_URL + "logout");
  return response.data.message;
};

const getLogInStatus = async () => {
  const response = await axios.get(API_URL + "login-status");
  return response.data;
};

const getUserProfile = async () => {
  const response = await axios.get(API_URL + "profile");
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(API_URL + "profile/update", userData);
  return response.data;
};
const updateUserCover = async (userData) => {
  const response = await axios.put(API_URL + "profile/cover", userData);
  return response.data;
};

const sendVerificationEmail = async () => {
  const response = await axios.post(API_URL + "send-verification-email");
  return response.data.error;
};

const verifyUser = async (verificationToken) => {
  const response = await axios.patch(`${API_URL}/verify-account/${verificationToken}`);
  return response.data.message;
};

const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "change-password", userData);
  return response.data;
};

const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgot-password", userData);
  return response.data.message;
};

const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(`${API_URL}reset-password/${resetToken}`, userData);
  return response.data.message;
};
const toggleFollow = async (userId) => {
  const response = await axios.patch(`${API_URL}toggleFollow/${userId}`);
  return response.data.message;
};

// by admin
const getAllUserByAdmin = async () => {
  const response = await axios.get(API_URL + "admin/users");
  return response.data;
};
const viewUserByAdmin = async (userId) => {
  const response = await axios.get(API_URL + `admin/user/${userId}`);
  return response.data;
};

const deleteUserByAdmin = async (id) => {
  const response = await axios.delete(API_URL + `admin/user/delete/${id}`);
  return response.data.message;
};
const updateUserByAdmin = async (userData) => {
  const response = await axios.patch(API_URL + "admin/user", userData);
  return response.data.message;
};
const sendLoginCode = async (email) => {
  const response = await axios.post(API_URL + `send-otp/${email}`);
  return response.data.message;
};

const loginWithCode = async (code, email) => {
  const response = await axios.post(API_URL + `loginwith-otp/${email}`, { loginCode: code });
  return response.data;
};
const loginWithGoogle = async (userToken) => {
  const response = await axios.post(API_URL + "google/callback", userToken);
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
  deleteUserByAdmin,
  updateUserByAdmin,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
  viewUserByAdmin,
  toggleFollow,
};

export default authService;

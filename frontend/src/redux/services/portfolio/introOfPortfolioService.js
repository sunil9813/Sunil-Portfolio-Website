import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL_PortIntro = `${REACT_APP_BACKEND_URL}/portfolio/intro/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllIntroByAdmin = async () => {
  const response = await axios.get(API_URL_PortIntro + "all");
  return response.data;
};
const getIntro = async (id) => {
  const response = await axios.get(`${API_URL_PortIntro}${id}`);
  return response.data;
};
const createIntro = async (formdata) => {
  const response = await axios.post(API_URL_PortIntro, formdata, config);
  return response.data;
};
const deleteIntro = async (postId) => {
  const response = await axios.delete(API_URL_PortIntro, { data: { id: postId } });
  return response.data.message;
};
const updateIntro = async ({ id, formData }) => {
  const response = await axios.patch(`${API_URL_PortIntro}${id}`, formData, config);
  return response.data;
};
const downloadCV = async (id) => {
  const response = await axios.get(`${API_URL_PortIntro}${id}/download-cv`, {
    responseType: "blob", // Important for file downloads
  });
  return response;
};
const introService = {
  getAllIntroByAdmin,
  getIntro,
  createIntro,
  deleteIntro,
  updateIntro,
  downloadCV,
};

export default introService;

import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/images/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllImages = async ({ folder, subfolder, groupId }) => {
  const baseUrl = subfolder ? `${API_URL}${folder}/${subfolder}` : `${API_URL}${folder}`;

  const query = new URLSearchParams();

  if (groupId) {
    query.append("groupId", groupId);
  }

  const url = query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl;

  const response = await axios.get(url);
  return response.data;
};

const uploadImageToEditorDes = async (formData) => {
  const response = await axios.post(`${API_URL}upload`, formData, config);
  console.log("====================================");
  console.log("hello i am calling");
  console.log(formData);
  console.log("====================================");
  return response.data;
};

const deleteImage = async (imageId) => {
  const response = await axios.delete(`${API_URL}${imageId}`);
  return response.data.message;
};

const updateImage = async ({ id, formData }) => {
  const response = await axios.put(`${API_URL}${id}`, formData, config);
  return response.data;
};

const imageService = {
  getAllImages,
  uploadImageToEditorDes,
  deleteImage,
  updateImage,
};

export default imageService;

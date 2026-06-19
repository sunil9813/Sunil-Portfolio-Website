import { REACT_APP_BACKEND_URL } from "@/utils/api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/university/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllUniversity = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getUniversity = async (slug) => {
  const response = await axios.get(`${API_URL}details/${slug}`);
  return response.data;
};
const createUniversity = async (formdata) => {
  const response = await axios.post(API_URL, formdata, config);
  return response.data;
};
const deleteUniversity = async (postId) => {
  const response = await axios.delete(API_URL, { data: { id: postId } });
  return response.data.message;
};

const updateUniversity = async ({ slug, formData }) => {
  const response = await axios.patch(`${API_URL}${slug}`, formData, config);
  return response.data;
};

const universityService = {
  getAllUniversity,
  getUniversity,
  createUniversity,
  deleteUniversity,
  updateUniversity,
};

export default universityService;

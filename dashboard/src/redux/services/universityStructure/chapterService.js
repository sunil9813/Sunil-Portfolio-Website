import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/chapter/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
};

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    ...config,
    headers: {
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const getAllChapter = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getChapter = async (slug) => {
  const response = await axios.get(`${API_URL}details/${slug}`);
  return response.data;
};

const createChapter = async (formdata) => {
  const response = await axios.post(API_URL, formdata, getAuthConfig());
  return response.data;
};

const createSubheading = async ({ chapterId, formData }) => {
  const response = await axios.post(`${API_URL}${chapterId}/subheadings`, formData, getAuthConfig());
  return response.data;
};

const deleteChapter = async (postId) => {
  const response = await axios.delete(API_URL, { data: { id: postId } });
  return response.data.message;
};

const updateChapter = async ({ slug, formData }) => {
  const response = await axios.patch(`${API_URL}${slug}`, formData, getAuthConfig());
  return response.data;
};

const chapterService = {
  getAllChapter,
  getChapter,
  createChapter,
  createSubheading,
  deleteChapter,
  updateChapter,
};

export default chapterService;

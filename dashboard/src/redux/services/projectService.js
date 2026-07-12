import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@/utils/Api";
export const API_URL = `${REACT_APP_BACKEND_URL}/project/`;
export const API_URL_CONFIG = `${REACT_APP_BACKEND_URL}/asset-limit`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllProject = async () => {
  const response = await axios.get(API_URL + "all");
  return response.data;
};
const getallProjectCreatedByUser = async () => {
  const response = await axios.get(API_URL + "user/posts");
  return response.data;
};
const getProjectPrivate = async (slug) => {
  const response = await axios.get(`${API_URL}/detail/${slug}`);
  return response.data;
};

const createProject = async (formdata) => {
  const response = await axios.post(API_URL, formdata, config);
  return response.data;
};
const deleteProject = async (postId) => {
  const response = await axios.delete(API_URL + "remove", { data: { id: postId } });
  return response.data.message;
};

const updateFeaturedStatus = async (blogId, featured) => {
  const response = await axios.patch(`${API_URL}featured/${blogId}`, { featured });
  return response.data;
};
const updateVisibility = async (blogId, visibility) => {
  const response = await axios.patch(`${API_URL}visibility/${blogId}`, { visibility });
  return response.data;
};
const updateProject = async ({ slug, formData }) => {
  const response = await axios.put(`${API_URL}${slug}`, formData, config);
  return response.data;
};
// Asset Config
const addAssetsLimit = async (formdata) => {
  const response = await axios.post(API_URL_CONFIG, formdata);
  return response.data;
};
const getAssetsLimit = async () => {
  const response = await axios.get(API_URL_CONFIG);
  return response.data;
};
const projectService = {
  getAllProject,
  getallProjectCreatedByUser,
  deleteProject,
  createProject,
  updateFeaturedStatus,
  updateVisibility,
  addAssetsLimit,
  getAssetsLimit,
  getProjectPrivate,
  updateProject,
};

export default projectService;

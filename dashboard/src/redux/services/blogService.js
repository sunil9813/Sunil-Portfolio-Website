import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/blog/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getallBlog = async () => {
  const response = await axios.get(API_URL + "all");
  return response.data;
};
const getBlogPrivate = async (slug) => {
  const response = await axios.get(`${API_URL}/deatil/${slug}`);
  return response.data;
};
const createBlog = async (formdata) => {
  const response = await axios.post(API_URL, formdata, config);
  return response.data;
};
const deleteBlog = async (postId) => {
  const response = await axios.delete(API_URL + "remove", { data: { id: postId } });
  return response.data.message;
};
const updateBlog = async (updateData) => {
  const response = await axios.put(API_URL + updateData.id, updateData.formData, config);
  return response.data;
};
const updateFeaturedStatus = async (blogId, featured) => {
  const response = await axios.patch(`${API_URL}${blogId}/featured`, { featured });
  return response.data;
};
const updateVisibility = async (blogId, visibility) => {
  const response = await axios.patch(`${API_URL}${blogId}/visibility`, { visibility });
  return response.data;
};

// New function: Get blogs by category and tag
const getBlogsByCategoryAndTag = async (category, tag) => {
  // Build query string dynamically based on provided parameters
  const query = new URLSearchParams();
  if (category) query.append("category", category);
  if (tag) query.append("tag", tag);

  const response = await axios.get(`${API_URL}search?${query.toString()}`);
  return response.data;
};
const blogService = {
  getallBlog,
  deleteBlog,
  createBlog,
  updateBlog,
  updateFeaturedStatus,
  updateVisibility,
  getBlogPrivate,
  getBlogsByCategoryAndTag,
};

export default blogService;

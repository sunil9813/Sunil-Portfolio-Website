import { REACT_APP_BACKEND_URL } from "@/utils/api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/blog/`;

const getallBlog = async () => {
  const response = await axios.get(API_URL + "all");
  return response.data;
};
const getBlog = async (slug) => {
  const response = await axios.get(`${API_URL}/${slug}`);
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
  getBlog,
  getBlogsByCategoryAndTag,
};

export default blogService;

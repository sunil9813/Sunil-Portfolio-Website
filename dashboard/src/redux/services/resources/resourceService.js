import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../../utils/Api";
export const API_URL = `${REACT_APP_BACKEND_URL}/posts/`;
export const API_URL_CONFIG = `${REACT_APP_BACKEND_URL}/asset-limit/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getallResource = async () => {
  const response = await axios.get(API_URL + "all");
  return response.data;
};
const createResource = async (formdata) => {
  const response = await axios.post(API_URL, formdata, config);
  return response.data;
};
const deleteResource = async (postId) => {
  const response = await axios.delete(API_URL + "remove", { data: { id: postId } });
  return response.data.message;
};

// Post Config
const addPostConfig = async (formdata) => {
  const response = await axios.post(API_URL_CONFIG, formdata);
  return response.data;
};
const getPostConfig = async () => {
  const response = await axios.get(API_URL_CONFIG);
  return response.data;
};
const resourceService = {
  getallResource,
  deleteResource,
  createResource,
  addPostConfig,
  getPostConfig,
};

export default resourceService;

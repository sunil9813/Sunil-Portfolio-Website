import axios from "axios";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
export const API_URL = `${REACT_APP_BACKEND_URL}/project/`;
export const API_URL_CONFIG = `${REACT_APP_BACKEND_URL}/asset-limit`;

const getAllProject = async () => {
  const response = await axios.get(API_URL + "all");
  return response.data;
};
const getProject = async (slug) => {
  const response = await axios.get(`${API_URL}${slug}`);
  return response.data;
};

const projectService = {
  getAllProject,
  getProject,
};

export default projectService;

import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/portfolio/service`;

const getAllService = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getService = async (slug) => {
  const response = await axios.get(`${API_URL}/${slug}`);
  return response.data;
};
const createService = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};
const deleteService = async (id) => {
  const response = await axios.delete(API_URL, { data: { id } });
  return response.data.message;
};
const updateService = async (slug, data) => {
  const response = await axios.patch(`${API_URL}/${slug}`, data);
  return response.data.message;
};

const portServiceService = {
  getAllService,
  getService,
  createService,
  deleteService,
  updateService,
};

export default portServiceService;

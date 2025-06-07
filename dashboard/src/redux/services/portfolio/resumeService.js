import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/portfolio/resume`;

const getAllResume = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getResume = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
const createResume = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};
const deleteResume = async (id) => {
  const response = await axios.delete(API_URL, { data: { id } });
  return response.data.message;
};
const updateResume = async (id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data.message;
};

const resumeService = {
  getAllResume,
  getResume,
  createResume,
  deleteResume,
  updateResume,
};

export default resumeService;

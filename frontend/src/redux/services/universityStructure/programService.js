import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/program`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllProgram = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getProgram = async (slug) => {
  const response = await axios.get(`${API_URL}/details/${slug}`);
  return response.data;
};
const createProgram = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};
const deleteProgram = async (id) => {
  const response = await axios.delete(API_URL, { data: { id } });
  return response.data.message;
};
const updateProgram = async ({ slug, formData }) => {
  const response = await axios.patch(`${API_URL}/${slug}`, formData, config);
  return response.data.message;
};

const programService = {
  getAllProgram,
  getProgram,
  createProgram,
  deleteProgram,
  updateProgram,
};

export default programService;

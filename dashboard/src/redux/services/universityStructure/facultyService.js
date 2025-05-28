import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/faculty`;

const getAllFaculty = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getFaculty = async (slug) => {
  const response = await axios.get(`${API_URL}/details/${slug}`);
  return response.data;
};
const createFaculty = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};
const deleteFaculty = async (id) => {
  const response = await axios.delete(API_URL, { data: { id } });
  return response.data.message;
};
const updateFaculty = async (id, data) => {
  const response = await axios.patch(`${API_URL}/${id}`, data);
  return response.data.message;
};

const facultyService = {
  getAllFaculty,
  getFaculty,
  createFaculty,
  deleteFaculty,
  updateFaculty,
};

export default facultyService;

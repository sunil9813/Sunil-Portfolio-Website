import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../../utils/api";

export const API_URL = `${REACT_APP_BACKEND_URL}/category/`;

const createCategory = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};

const getallCategory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getCategory = async (categoryId) => {
  const response = await axios.get(API_URL + `single/${categoryId}`);
  return response.data;
};
const getCategoriesByType = async (type) => {
  const response = await axios.get(`${API_URL}${type}`);
  return response.data;
};

const deleteCategory = async (categoryId) => {
  const response = await axios.delete(API_URL + "delete", { data: { id: categoryId } });
  return response.data.message;
};

const updateCategory = async ({ formData, id }) => {
  const response = await axios.patch(`${API_URL}/update/${id}`, formData);
  return response.data;
};

const categoryService = {
  createCategory,
  getallCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  getCategoriesByType,
};

export default categoryService;

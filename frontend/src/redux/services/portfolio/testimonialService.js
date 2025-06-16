import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/portfolio/testimonial`;

const getAllTestimonial = async () => {
  const response = await axios.get(API_URL + "/admin");
  return response.data;
};
const getTestimonial = async (id) => {
  const response = await axios.get(`${API_URL}/admin/${id}`);
  return response.data;
};
const createTestimonial = async (formdata) => {
  const response = await axios.post(API_URL, formdata);
  return response.data;
};
const deleteTestimonial = async (id) => {
  const response = await axios.delete(API_URL, { data: { id } });
  return response.data.message;
};
const updateTestimonial = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data.message;
};

const testimonialService = {
  getAllTestimonial,
  getTestimonial,
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
};

export default testimonialService;

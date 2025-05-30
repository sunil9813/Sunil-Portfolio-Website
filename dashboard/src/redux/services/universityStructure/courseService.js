import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/subject/`;

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllCourse = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const getUserCourses = async () => {
  const response = await axios.get(`${API_URL}my-subjects`);
  return response.data;
};
const getCourse = async (slug) => {
  const response = await axios.get(`${API_URL}details/${slug}`);
  return response.data;
};
const createCourse = async (formdata) => {
  const response = await axios.post(API_URL, formdata, config);
  return response.data;
};
const deleteCourse = async (subjectId) => {
  const response = await axios.delete(API_URL, { data: { id: subjectId } });
  return response.data.message;
};
const getChaptersBySubjectSlug = async (slug) => {
  const response = await axios.get(`${API_URL}${slug}/chapters`);
  return response.data;
};

const updateCourse = async ({ slug, formData }) => {
  const response = await axios.patch(`${API_URL}${slug}`, formData, config);
  return response.data;
};

const courseService = {
  getAllCourse,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
  getUserCourses,
  getChaptersBySubjectSlug,
};

export default courseService;

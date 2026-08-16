import axios from "axios";

import { REACT_APP_BACKEND_URL } from "@/utils/api";

export const API_URL = `${REACT_APP_BACKEND_URL}/comment/`;

const config = {
  withCredentials: true,
};

const getComments = async (resourceId) => {
  const response = await axios.get(`${API_URL}${resourceId}`, config);
  return response.data;
};

const addComment = async ({ resourceId, resourceType, content, parentCommentId, rating }) => {
  const response = await axios.post(
    API_URL,
    {
      resourceId,
      resourceType,
      content,
      parentCommentId,
      rating,
    },
    config,
  );

  return response.data;
};

const addRating = async ({ resourceId, resourceType, rating }) => {
  const response = await axios.post(
    API_URL,
    {
      resourceId,
      resourceType,
      rating,
    },
    config,
  );

  return response.data;
};

const getCommentsandRatings = async ({ resourceType, resourceId }) => {
  const response = await axios.get(`${API_URL}ratings/${resourceType}/${resourceId}`, config);
  return response.data;
};

const updateComment = async ({ commentId, content }) => {
  const response = await axios.put(`${API_URL}${commentId}`, { content }, config);
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await axios.delete(`${API_URL}${commentId}`, config);
  return response.data;
};

const toggleCommentLike = async (commentId) => {
  const response = await axios.patch(`${API_URL}${commentId}/like`, {}, config);
  return response.data;
};

const commentService = {
  getComments,
  addComment,
  addRating,
  getCommentsandRatings,
  updateComment,
  deleteComment,
  toggleCommentLike,
};

export default commentService;

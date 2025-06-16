import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/like/`;

const toggleLike = async (resourceType, id) => {
  const response = await axios.post(`${API_URL}${resourceType}/${id}`);
  return response.data;
};

const likeService = { toggleLike };

export default likeService;

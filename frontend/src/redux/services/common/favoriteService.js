import { REACT_APP_BACKEND_URL } from "@/utils/api";
import axios from "axios";

export const API_URL = `${REACT_APP_BACKEND_URL}/favorite/`;

const toggleFavorite = async (resourceType, resourceId) => {
  const response = await axios.post(API_URL, { resourceType, resourceId });
  return response.data;
};

const getUserFavorite = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const favoriteService = { toggleFavorite, getUserFavorite };

export default favoriteService;

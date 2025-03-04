import axios from "axios";
import { REACT_APP_BACKEND_URL } from "../../utils/Api";

export const API_URL = `${REACT_APP_BACKEND_URL}/favorite/`;

//  for specific user
const getFavoriteList = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const favoriteService = {
  getFavoriteList,
};

export default favoriteService;

import { REACT_APP_BACKEND_URL } from "@/utils/Api";
import axios from "axios";

const API_URL = `${REACT_APP_BACKEND_URL}/dashboard`;

const getDashboardStats = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;

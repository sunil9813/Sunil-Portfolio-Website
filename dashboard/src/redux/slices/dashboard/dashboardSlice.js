import dashboardService from "@/redux/services/dashboard/dashboardService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  dashboardStats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const getDashboardStats = createAsyncThunk("dashboard/stats", async (_, thunkAPI) => {
  try {
    return await dashboardService.getDashboardStats();
  } catch (error) {
    const message = error?.response?.data?.message || error?.response?.data?.error || error.message || "Unable to load dashboard";
    return thunkAPI.rejectWithValue(message);
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    DASHBOARD_RESET(state) {
      state.dashboardStats = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.dashboardStats = action.payload?.data || null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.dashboardStats = null;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { DASHBOARD_RESET } = dashboardSlice.actions;
export default dashboardSlice.reducer;

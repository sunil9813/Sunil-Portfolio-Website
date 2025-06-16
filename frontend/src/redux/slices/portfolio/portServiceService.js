import portServiceService from "@/redux/services/portfolio/portfolioServiceService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  service: null,
  services: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllService = createAsyncThunk("Services/all", async (_, thunkAPI) => {
  try {
    return await portServiceService.getAllService();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getService = createAsyncThunk("Services/details", async (id, thunkAPI) => {
  try {
    return await portServiceService.getService(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createService = createAsyncThunk("Services/create", async (formdata, thunkAPI) => {
  try {
    return await portServiceService.createService(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteService = createAsyncThunk("Services/delete", async (id, thunkAPI) => {
  try {
    return await portServiceService.deleteService(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateService = createAsyncThunk("Services/update", async ({ id, formData }, thunkAPI) => {
  try {
    return await portServiceService.updateService({ id, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const ServiceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.service = false;
      state.services = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.services = action.payload;
      })
      .addCase(getAllService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.services = null;
        toast.error(action.payload);
      })
      .addCase(getService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.service = action.payload;
      })
      .addCase(getService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.service = null;
        toast.error(action.payload);
      })
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = ServiceSlice.actions;
export const selectBlog = (state) => state.Service.Service;
export default ServiceSlice.reducer;

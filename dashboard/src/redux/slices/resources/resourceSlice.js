import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import resourceService from "../../services/resources/resourceService";

const initialState = {
  resource: null,
  resources: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getallResource = createAsyncThunk("resources/all", async (_, thunkAPI) => {
  try {
    return await resourceService.getallResource();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createResource = createAsyncThunk("resources/create", async (formdata, thunkAPI) => {
  try {
    return await resourceService.createResource(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteResource = createAsyncThunk("resources/delete", async (id, thunkAPI) => {
  try {
    return await resourceService.deleteResource(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    RESOURCES_RESET(state) {
      state.resource = false;
      state.resources = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getallResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getallResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.resources = action.payload;
      })
      .addCase(getallResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.resources = null;
        toast.error(action.payload);
      })
      .addCase(createResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteResource.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = resourceSlice.actions;

export default resourceSlice.reducer;

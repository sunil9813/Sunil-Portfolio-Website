import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import projectService from "../services/projectService";

const initialState = {
  project: null,
  projects: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getAllProject = createAsyncThunk("projects/all", async (_, thunkAPI) => {
  try {
    return await projectService.getAllProject();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getProject = createAsyncThunk("projects/details", async (slug, thunkAPI) => {
  try {
    return await projectService.getProject(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    PROJECT_RESET(state) {
      state.project = false;
      state.projects = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.projects = action.payload;
      })
      .addCase(getAllProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.projects = null;
        toast.error(action.payload);
      })
      .addCase(getProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.project = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.project = null;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = projectSlice.actions;

export default projectSlice.reducer;

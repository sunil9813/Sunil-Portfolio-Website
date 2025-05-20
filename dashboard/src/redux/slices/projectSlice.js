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
export const getallProjectCreatedByUser = createAsyncThunk("projects/user/post", async (_, thunkAPI) => {
  try {
    return await projectService.getallProjectCreatedByUser();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getProjectPrivate = createAsyncThunk("projects/details", async (slug, thunkAPI) => {
  try {
    return await projectService.getProjectPrivate(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createProject = createAsyncThunk("projects/create", async (formdata, thunkAPI) => {
  try {
    return await projectService.createProject(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteProject = createAsyncThunk("projects/delete", async (id, thunkAPI) => {
  try {
    return await projectService.deleteProject(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateFeaturedStatus = createAsyncThunk("projects/updateFeaturedStatus", async ({ projectId, featured }, thunkAPI) => {
  try {
    return await projectService.updateFeaturedStatus(projectId, featured);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateVisibility = createAsyncThunk("projects/updateVisibility", async ({ projectId, visibility }, thunkAPI) => {
  try {
    return await projectService.updateVisibility(projectId, visibility);
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
    updateVisibilitySuccess(state, action) {
      if (state.project) {
        state.project.visibility = action.payload.visibility;
      }
    },
    updateFeaturedSuccess(state, action) {
      if (state.project) {
        state.project.featured = action.payload.featured;
      }
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
      .addCase(getallProjectCreatedByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getallProjectCreatedByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.projects = action.payload;
      })
      .addCase(getallProjectCreatedByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.projects = null;
        toast.error(action.payload);
      })
      .addCase(getProjectPrivate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProjectPrivate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.project = action.payload;
      })
      .addCase(getProjectPrivate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.project = null;
        toast.error(action.payload);
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      }) // Handle update featured status
      .addCase(updateFeaturedStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFeaturedStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (state.project) {
          state.project.featured = action.payload.featured;
        }
        toast.success("Featured status updated successfully");
      })
      .addCase(updateFeaturedStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateVisibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVisibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (state.project) {
          state.project.visibility = action.payload.visibility;
        }
        toast.success("Visibility updated successfully");
      })
      .addCase(updateVisibility.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = projectSlice.actions;

export default projectSlice.reducer;

import resumeService from "@/redux/services/portfolio/resumeService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  resume: null,
  resumes: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllResume = createAsyncThunk("resumes/all", async (_, thunkAPI) => {
  try {
    return await resumeService.getAllResume();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getResume = createAsyncThunk("resumes/details", async (id, thunkAPI) => {
  try {
    return await resumeService.getResume(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createResume = createAsyncThunk("resumes/create", async (formdata, thunkAPI) => {
  try {
    return await resumeService.createResume(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteResume = createAsyncThunk("resumes/delete", async (id, thunkAPI) => {
  try {
    return await resumeService.deleteResume(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateResume = createAsyncThunk("resumes/update", async ({ id, data }, thunkAPI) => {
  try {
    return await resumeService.updateResume(id, data);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.resume = false;
      state.resumes = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.resumes = action.payload;
      })
      .addCase(getAllResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.resumes = null;
        toast.error(action.payload);
      })
      .addCase(getResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.resume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.resume = null;
        toast.error(action.payload);
      })
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = resumeSlice.actions;
export const selectBlog = (state) => state.resume.resume;
export default resumeSlice.reducer;

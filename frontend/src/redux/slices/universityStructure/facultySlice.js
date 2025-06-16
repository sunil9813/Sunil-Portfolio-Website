import facultyService from "@/redux/services/universityStructure/facultyService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  faculty: null,
  facultys: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllFaculty = createAsyncThunk("facultys/all", async (_, thunkAPI) => {
  try {
    return await facultyService.getAllFaculty();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getFaculty = createAsyncThunk("facultys/details", async (slug, thunkAPI) => {
  try {
    return await facultyService.getFaculty(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createFaculty = createAsyncThunk("facultys/create", async (formdata, thunkAPI) => {
  try {
    return await facultyService.createFaculty(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteFaculty = createAsyncThunk("facultys/delete", async (id, thunkAPI) => {
  try {
    return await facultyService.deleteFaculty(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateFaculty = createAsyncThunk("facultys/update", async ({ id, data }, thunkAPI) => {
  try {
    return await facultyService.updateFaculty(id, data);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.faculty = false;
      state.facultys = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFaculty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.facultys = action.payload;
      })
      .addCase(getAllFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.facultys = null;
        toast.error(action.payload);
      })
      .addCase(getFaculty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.faculty = action.payload;
      })
      .addCase(getFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.faculty = null;
        toast.error(action.payload);
      })
      .addCase(createFaculty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteFaculty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateFaculty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFaculty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateFaculty.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = facultySlice.actions;
export const selectBlog = (state) => state.faculty.faculty;
export default facultySlice.reducer;

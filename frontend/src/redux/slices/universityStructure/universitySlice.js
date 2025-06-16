import universityService from "@/redux/services/universityStructure/universityService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  university: null,
  universitys: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllUniversity = createAsyncThunk("universitys/all", async (_, thunkAPI) => {
  try {
    return await universityService.getAllUniversity();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getUniversity = createAsyncThunk("universitys/details", async (slug, thunkAPI) => {
  try {
    return await universityService.getUniversity(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createUniversity = createAsyncThunk("universitys/create", async (formdata, thunkAPI) => {
  try {
    return await universityService.createUniversity(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteUniversity = createAsyncThunk("universitys/delete", async (id, thunkAPI) => {
  try {
    return await universityService.deleteUniversity(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateUniversity = createAsyncThunk("universitys/update", async ({ slug, formData }, thunkAPI) => {
  try {
    return await universityService.updateUniversity({ slug, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.university = false;
      state.universitys = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.universitys = action.payload;
      })
      .addCase(getAllUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.universitys = null;
        toast.error(action.payload);
      })
      .addCase(getUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.university = action.payload;
      })
      .addCase(getUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.university = null;
        toast.error(action.payload);
      })
      .addCase(createUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = universitySlice.actions;
export const selectBlog = (state) => state.university.university;
export default universitySlice.reducer;

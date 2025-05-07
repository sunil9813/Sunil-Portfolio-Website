import projectService from "@/redux/services/projectService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  assetLimit: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const addAssetsLimit = createAsyncThunk("asset/limit", async (formData, thunkAPI) => {
  try {
    return await projectService.addAssetsLimit(formData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getAssetsLimit = createAsyncThunk("asset-get/limit", async (_, thunkAPI) => {
  try {
    return await projectService.getAssetsLimit();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const assetsLimitSlice = createSlice({
  name: "assetlimit",
  initialState,
  reducers: {
    ASSLIMIT_RESET(state) {
      state.assetLimit = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAssetsLimit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAssetsLimit.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(addAssetsLimit.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getAssetsLimit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssetsLimit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.assetLimit = action.payload;
      })
      .addCase(getAssetsLimit.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.assetLimit = null;
        toast.error(action.payload);
      });
  },
});

export const { ASSLIMIT_RESET } = assetsLimitSlice.actions;

export default assetsLimitSlice.reducer;

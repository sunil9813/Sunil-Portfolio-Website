import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import resourceService from "../../services/resources/resourceService";

const initialState = {
  assetLimit: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const addPostConfig = createAsyncThunk("asset/limit", async (formData, thunkAPI) => {
  try {
    return await resourceService.addPostConfig(formData);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getPostConfig = createAsyncThunk("asset-get/limit", async (_, thunkAPI) => {
  try {
    return await resourceService.getPostConfig();
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
      .addCase(addPostConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPostConfig.fulfilled, (state, action) => {
        state.isLoading = true;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload;
        toast.success(action.payload);
      })
      .addCase(addPostConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getPostConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.assetLimit = action.payload;
      })
      .addCase(getPostConfig.rejected, (state, action) => {
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

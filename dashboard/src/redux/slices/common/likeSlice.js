import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import likeService from "@/redux/services/common/likeService";

const initialState = {
  likedPosts: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const toggleLike = createAsyncThunk("like/toggleLike", async ({ resourceType, id }, thunkAPI) => {
  try {
    const response = await likeService.toggleLike(resourceType, id);
    return { resourceType, id, status: response.status };
  } catch (error) {
    const message = error.response?.data?.error || "An error occurred while toggling like";
    return thunkAPI.rejectWithValue(message);
  }
});

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { resourceType, id } = action.payload;
        if (!state.likedPosts[resourceType]) {
          state.likedPosts[resourceType] = {};
        }
        state.likedPosts[resourceType][id] = !state.likedPosts[resourceType][id];
        state.isLoading = false;
      })
      .addCase(toggleLike.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default likeSlice.reducer;

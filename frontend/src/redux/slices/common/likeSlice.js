import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import likeService from "@/redux/services/common/likeService";

const initialState = {
  likedPosts: {}, // Tracks if the user liked a resource
  likeCounts: {}, // Tracks the total like count for each resource
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk to toggle like
export const toggleLike = createAsyncThunk("like/toggleLike", async ({ resourceType, id, newLikes }, thunkAPI) => {
  try {
    const response = await likeService.toggleLike(resourceType, id);
    return { resourceType, id, status: response.status, newLikes };
  } catch (error) {
    const message = error.response?.data?.error || "An error occurred while toggling like";
    return thunkAPI.rejectWithValue({ message, previousLikes: thunkAPI.getState().like.likeCounts[resourceType]?.[id] });
  }
});

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    setInitialLikes: (state, action) => {
      const { resourceType, id, likes } = action.payload;
      if (!state.likeCounts[resourceType]) {
        state.likeCounts[resourceType] = {};
      }
      if (!state.likedPosts[resourceType]) {
        state.likedPosts[resourceType] = {};
      }
      state.likeCounts[resourceType][id] = likes.length; // Initialize like count
    },
    updateLikeLocally: (state, action) => {
      const { resourceType, id, likes, isLiked } = action.payload;
      if (!state.likeCounts[resourceType]) {
        state.likeCounts[resourceType] = {};
      }
      if (!state.likedPosts[resourceType]) {
        state.likedPosts[resourceType] = {};
      }
      state.likeCounts[resourceType][id] = likes.length; // Update like count optimistically
      state.likedPosts[resourceType][id] = !isLiked; // Update like status optimistically
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        const { resourceType, id } = action.meta.arg;
        const { previousLikes, message } = action.payload;
        state.isLoading = false;
        state.isError = true;
        state.message = message;
        // Revert optimistic updates
        state.likeCounts[resourceType][id] = previousLikes; // Revert like count
        state.likedPosts[resourceType][id] = !state.likedPosts[resourceType][id]; // Revert like status
      });
  },
});

export const { setInitialLikes, updateLikeLocally } = likeSlice.actions;
export default likeSlice.reducer;

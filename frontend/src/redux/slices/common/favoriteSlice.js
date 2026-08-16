import favoriteService from "@/redux/services/common/favoriteService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  favoriteResource: {},
  isFavoriteLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk to toggle favorite
export const toggleFavorite = createAsyncThunk("favorite/toggleFavorite", async ({ resourceType, resourceId }, thunkAPI) => {
  try {
    const response = await favoriteService.toggleFavorite(resourceType, resourceId);
    return { resourceType, resourceId, status: response.status };
  } catch (error) {
    const message = error.response?.data?.error || "An error occurred while toggling favorite";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getUserFavorite = createAsyncThunk("favorite/getUserFavorite", async (_, thunkAPI) => {
  try {
    return await favoriteService.getUserFavorite();
  } catch (error) {
    const message = error.response?.data?.error || "An error occurred while toggling favorite";
    return thunkAPI.rejectWithValue(message);
  }
});

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    // Optional: Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserFavorite.pending, (state) => {
        state.isFavoriteLoading = true;
      })
      .addCase(getUserFavorite.fulfilled, (state, action) => {
        state.isFavoriteLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.favoriteResource = action.payload;
      })
      .addCase(getUserFavorite.rejected, (state) => {
        state.isFavoriteLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.favoriteResource = {};
      })
      // Handle pending state
      .addCase(toggleFavorite.pending, (state) => {
        state.isFavoriteLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      // Handle fulfilled state
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { resourceType, resourceId, status } = action.payload;
        if (!state.favoriteResource || Array.isArray(state.favoriteResource)) {
          state.favoriteResource = {};
        }

        // Only update the lightweight boolean map when this resource type is not already a populated array.
        // Components that need full dashboard cards refetch getUserFavorite after toggling.
        if (!state.favoriteResource[resourceType]) {
          state.favoriteResource[resourceType] = {};
        }

        if (!Array.isArray(state.favoriteResource[resourceType])) {
          state.favoriteResource[resourceType][resourceId] = status === "added";
        }

        state.isFavoriteLoading = false;
        state.isSuccess = true;
        state.message = `Favorite ${status} successfully.`;
        toast.success(state.message);
      })
      // Handle rejected state
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isFavoriteLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to toggle favorite.";
      });
  },
});

export default favoriteSlice.reducer;

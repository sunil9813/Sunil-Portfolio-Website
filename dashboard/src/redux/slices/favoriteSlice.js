import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import favoriteService from "../services/favoriteService";

const initialState = {
  favorite: null,
  favorites: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getFavoriteList = createAsyncThunk("favorite/ofuser", async (_, thunkAPI) => {
  try {
    return await favoriteService.getFavoriteList();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const FavoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFavoriteList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavoriteList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.favorites = action.payload;
      })
      .addCase(getFavoriteList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const selectIsLoading = (state) => state.favorite.isLoading;
export const selectFavorite = (state) => state.favorite.favorite;

export default FavoriteSlice.reducer;

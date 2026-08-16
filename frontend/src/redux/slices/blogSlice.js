import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import blogService from "../services/blogService";

const initialState = {
  blog: null,
  blogs: { BlogList: [], total: 0 },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getallBlog = createAsyncThunk("blogs/all", async (_, thunkAPI) => {
  try {
    return await blogService.getallBlog();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getBlog = createAsyncThunk("blogs/details-by-user", async (slug, thunkAPI) => {
  try {
    return await blogService.getBlog(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getBlogsByCategoryAndTag = createAsyncThunk("blogs/byCategoryAndTag", async ({ category, tag }, thunkAPI) => {
  try {
    return await blogService.getBlogsByCategoryAndTag(category, tag);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    BLOG_RESET(state) {
      state.blog = false;
      state.blogs = { BlogList: [], total: 0 };
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    updateVisibilitySuccess(state, action) {
      if (state.blog) {
        state.blog.visibility = action.payload.visibility;
      }
    },
    updateFeaturedSuccess(state, action) {
      if (state.blog) {
        state.blog.featured = action.payload.featured;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getallBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getallBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blogs = action.payload;
      })
      .addCase(getallBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blogs = { BlogList: [], total: 0 };
        toast.error(action.payload);
      })
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blog = action.payload;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blog = null;
        toast.error(action.payload);
      })
      .addCase(getBlogsByCategoryAndTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogsByCategoryAndTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        const blogList = action.payload?.BlogList || [];
        state.blogs = {
          ...action.payload,
          BlogList: blogList,
          total: action.payload?.total ?? blogList.length,
        };
      })
      .addCase(getBlogsByCategoryAndTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blogs = { BlogList: [], total: 0 };
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = blogSlice.actions;
export const selectBlog = (state) => state.blog.blog;
export default blogSlice.reducer;

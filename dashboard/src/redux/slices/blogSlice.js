import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import blogService from "../services/blogService";

const initialState = {
  blog: null,
  blogs: [],
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
export const getBlogPrivate = createAsyncThunk("blogs/details-by-user", async (slug, thunkAPI) => {
  try {
    return await blogService.getBlogPrivate(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createBlog = createAsyncThunk("blogs/create", async (formdata, thunkAPI) => {
  try {
    return await blogService.createBlog(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteBlog = createAsyncThunk("blogs/delete", async (id, thunkAPI) => {
  try {
    return await blogService.deleteBlog(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateBlog = createAsyncThunk("blogs/update", async ({ slug, formData }, thunkAPI) => {
  try {
    return await blogService.updateBlog({ slug, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateFeaturedStatus = createAsyncThunk("blog/updateFeaturedStatus", async ({ blogId, featured }, thunkAPI) => {
  try {
    return await blogService.updateFeaturedStatus(blogId, featured);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateVisibility = createAsyncThunk("blog/updateVisibility", async ({ blogId, visibility }, thunkAPI) => {
  try {
    return await blogService.updateVisibility(blogId, visibility);
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
      state.blogs = null;
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
        state.blogs = null;
        toast.error(action.payload);
      })
      .addCase(getBlogPrivate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogPrivate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blog = action.payload;
      })
      .addCase(getBlogPrivate.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blog = null;
        toast.error(action.payload);
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      }) // Handle update featured status
      .addCase(updateFeaturedStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFeaturedStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (state.blog) {
          state.blog.featured = action.payload.featured;
        }
        toast.success("Featured status updated successfully");
      })
      .addCase(updateFeaturedStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateVisibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVisibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        if (state.blog) {
          state.blog.visibility = action.payload.visibility;
        }
        toast.success("Visibility updated successfully");
      })
      .addCase(updateVisibility.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(getBlogsByCategoryAndTag.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogsByCategoryAndTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blogs = action.payload.BlogList; // Store the BlogList array from the response
      })
      .addCase(getBlogsByCategoryAndTag.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blogs = [];
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = blogSlice.actions;
export const selectBlog = (state) => state.blog.blog;
export default blogSlice.reducer;

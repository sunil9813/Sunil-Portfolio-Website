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
export const updateBlog = createAsyncThunk("blogs/update", async (updateData, thunkAPI) => {
  try {
    return await blogService.updateBlog(updateData);
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
      .addCase(updateBlog.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Image updated successfully!");
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
        state.blog = action.payload; // Assuming you're returning the updated blog
        toast.success("Featured status updated successfully");
      })
      .addCase(updateFeaturedStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blog = null;
        toast.error(action.payload);
      })
      // Handle update visibility
      .addCase(updateVisibility.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateVisibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.blog = action.payload; // Assuming you're returning the updated blog
        toast.success("Visibility updated successfully");
      })
      .addCase(updateVisibility.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.blog = null;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = blogSlice.actions;

export default blogSlice.reducer;

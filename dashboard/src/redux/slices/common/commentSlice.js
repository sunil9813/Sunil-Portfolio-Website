import commentService from "@/redux/services/common/commentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  comments: [],
  ratings: [],
  averageRating: 0,
  commentResponse: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isPosting: false,
  message: "",
};

export const getComments = createAsyncThunk("comments/get", async (resourceId, thunkAPI) => {
  try {
    return await commentService.getComments(resourceId);
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

export const addComment = createAsyncThunk("comments/add", async ({ resourceId, resourceType, content, parentCommentId }, thunkAPI) => {
  try {
    return await commentService.addComment({ resourceId, resourceType, content, parentCommentId });
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

export const addRating = createAsyncThunk("comments/rating/add", async ({ resourceId, resourceType, rating }, thunkAPI) => {
  try {
    return await commentService.addRating({ resourceId, resourceType, rating });
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

export const getCommentsandRatings = createAsyncThunk("comments/ratings/get", async ({ resourceType, resourceId }, thunkAPI) => {
  try {
    return await commentService.getCommentsandRatings({ resourceType, resourceId });
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateComment = createAsyncThunk("comment/update", async (data, thunkAPI) => {
  try {
    return await commentService.updateComment(data);
  } catch (error) {
    const message = error?.response?.data?.error || error?.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteComment = createAsyncThunk("comment/delete", async (commentId, thunkAPI) => {
  try {
    return await commentService.deleteComment(commentId);
  } catch (error) {
    const message = error?.response?.data?.error || error?.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});
export const toggleCommentLike = createAsyncThunk("comment/toggleLike", async (commentId, thunkAPI) => {
  try {
    return await commentService.toggleCommentLike(commentId);
  } catch (error) {
    const message = error?.response?.data?.error || error?.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    COMMENT_RESET(state) {
      state.comments = [];
      state.ratings = [];
      state.averageRating = 0;
      state.commentResponse = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isPosting = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.comments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.comments = [];
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(addComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isPosting = false;
        state.isSuccess = true;
        state.isError = false;
        state.commentResponse = action.payload;
        toast.success(action.payload?.status || "Comment added.");
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isPosting = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(addRating.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.isPosting = false;
        state.isSuccess = true;
        state.isError = false;
        state.commentResponse = action.payload;
        toast.success(action.payload?.status || "Rating added.");
      })
      .addCase(addRating.rejected, (state, action) => {
        state.isPosting = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })

      .addCase(getCommentsandRatings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCommentsandRatings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.ratings = action.payload?.ratings || [];
        state.averageRating = action.payload?.averageRating || 0;
      })
      .addCase(getCommentsandRatings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.ratings = [];
        state.averageRating = 0;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.isPosting = false;
        state.isSuccess = true;
        state.commentResponse = action.payload;
        toast.success(action.payload?.status || "Comment updated.");
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.isPosting = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(deleteComment.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isPosting = false;
        state.isSuccess = true;
        state.commentResponse = action.payload;
        toast.success(action.payload?.status || "Comment deleted.");
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isPosting = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(toggleCommentLike.pending, (state) => {
        state.isPosting = true;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.isPosting = false;
        state.isSuccess = true;
        state.commentResponse = action.payload;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.isPosting = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { COMMENT_RESET } = commentSlice.actions;
export const selectComments = (state) => state.comment.comments;
export const selectCommentLoading = (state) => state.comment.isLoading;
export const selectCommentPosting = (state) => state.comment.isPosting;
export default commentSlice.reducer;

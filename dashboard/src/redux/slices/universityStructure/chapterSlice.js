import chapterService from "@/redux/services/universityStructure/chapterService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  chapter: null,
  chapters: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllChapter = createAsyncThunk("chapters/all", async (_, thunkAPI) => {
  try {
    return await chapterService.getAllChapter();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getChapter = createAsyncThunk("chapters/details", async (slug, thunkAPI) => {
  try {
    return await chapterService.getChapter(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createChapter = createAsyncThunk("chapters/create", async (formdata, thunkAPI) => {
  try {
    return await chapterService.createChapter(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

export const createSubheading = createAsyncThunk("chapters/subheadings/create", async ({ chapterId, formData }, thunkAPI) => {
  try {
    return await chapterService.createSubheading({ chapterId, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteChapter = createAsyncThunk("chapters/delete", async (id, thunkAPI) => {
  try {
    return await chapterService.deleteChapter(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateChapter = createAsyncThunk("chapters/update", async ({ slug, formData }, thunkAPI) => {
  try {
    return await chapterService.updateChapter({ slug, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.chapter = false;
      state.chapters = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.chapters = action.payload;
      })
      .addCase(getAllChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.chapters = null;
        toast.error(action.payload);
      })
      .addCase(getChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.chapter = action.payload;
      })
      .addCase(getChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.chapter = null;
        toast.error(action.payload);
      })
      .addCase(createChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(createSubheading.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubheading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload?.message || "Subheading created successfully.");
      })
      .addCase(createSubheading.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = chapterSlice.actions;
export const selectBlog = (state) => state.chapter.chapter;
export default chapterSlice.reducer;

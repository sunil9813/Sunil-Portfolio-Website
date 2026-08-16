import courseService from "@/redux/services/universityStructure/courseService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const emptyCourses = { data: [], total: 0 };
const emptyChapterByCourse = { subject: null, chapters: [], total: 0 };

const normalizeCourses = (payload) => {
  if (Array.isArray(payload)) {
    return { ...emptyCourses, data: payload, total: payload.length };
  }

  const data = Array.isArray(payload?.data) ? payload.data : [];

  return {
    ...payload,
    data,
    total: payload?.total ?? data.length,
  };
};

const normalizeChapterByCourse = (payload) => {
  const chapters = Array.isArray(payload?.chapters) ? payload.chapters : [];

  return {
    ...payload,
    subject: payload?.subject || null,
    chapters,
    total: payload?.total ?? chapters.length,
  };
};

const initialState = {
  course: null,
  courses: emptyCourses,
  chapterByCourse: emptyChapterByCourse,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllCourse = createAsyncThunk("courses/all", async (_, thunkAPI) => {
  try {
    return await courseService.getAllCourse();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getAllCourseWithChapters = createAsyncThunk("getAllSubjectsWithChapters/all", async (_, thunkAPI) => {
  try {
    return await courseService.getAllCourseWithChapters();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getCoursePageSubjects = createAsyncThunk("subjects/courses/page", async (_, thunkAPI) => {
  try {
    return await courseService.getCoursePageSubjects();
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "Unable to load courses";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getNotePageSubjects = createAsyncThunk("subjects/notes/page", async (_, thunkAPI) => {
  try {
    return await courseService.getNotePageSubjects();
  } catch (error) {
    const message = (error.response && error.response.data && (error.response.data.error || error.response.data.message)) || error.message || "Unable to load notes";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getUserCourses = createAsyncThunk("courses/user/all", async (_, thunkAPI) => {
  try {
    return await courseService.getUserCourses();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getCourse = createAsyncThunk("courses/details", async (slug, thunkAPI) => {
  try {
    return await courseService.getCourse(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getChaptersBySubjectSlug = createAsyncThunk("chapter/by/courses", async (slug, thunkAPI) => {
  try {
    return await courseService.getChaptersBySubjectSlug(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const createCourse = createAsyncThunk("courses/create", async (formdata, thunkAPI) => {
  try {
    return await courseService.createCourse(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteCourse = createAsyncThunk("courses/delete", async (id, thunkAPI) => {
  try {
    return await courseService.deleteCourse(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateCourse = createAsyncThunk("courses/update", async ({ slug, formData }, thunkAPI) => {
  try {
    return await courseService.updateCourse({ slug, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    COURSE_RESET(state) {
      state.course = false;
      state.courses = emptyCourses;
      state.chapterByCourse = emptyChapterByCourse;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = normalizeCourses(action.payload);
      })
      .addCase(getAllCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.courses = emptyCourses;
        toast.error(action.payload);
      })
      .addCase(getAllCourseWithChapters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCourseWithChapters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = normalizeCourses(action.payload);
      })
      .addCase(getAllCourseWithChapters.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.courses = emptyCourses;
        toast.error(action.payload);
      })
      .addCase(getCoursePageSubjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCoursePageSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = normalizeCourses(action.payload);
      })
      .addCase(getCoursePageSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.courses = emptyCourses;
        toast.error(action.payload);
      })
      .addCase(getNotePageSubjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotePageSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = normalizeCourses(action.payload);
      })
      .addCase(getNotePageSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.courses = emptyCourses;
        toast.error(action.payload);
      })
      .addCase(getUserCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.courses = normalizeCourses(action.payload);
      })
      .addCase(getUserCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.courses = emptyCourses;
        toast.error(action.payload);
      })
      .addCase(getCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.course = action.payload;
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.course = null;
        toast.error(action.payload);
      })
      .addCase(getChaptersBySubjectSlug.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChaptersBySubjectSlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.chapterByCourse = normalizeChapterByCourse(action.payload);
      })
      .addCase(getChaptersBySubjectSlug.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.chapterByCourse = emptyChapterByCourse;
        toast.error(action.payload);
      })
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { COURSE_RESET } = courseSlice.actions;
export const selectBlog = (state) => state.course.course;
export default courseSlice.reducer;

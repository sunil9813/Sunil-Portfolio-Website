import testimonialService from "@/redux/services/portfolio/testimonialService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const emptyTestimonials = { testimonialList: [], total: 0 };

const normalizeTestimonials = (payload) => {
  if (Array.isArray(payload)) {
    return { ...emptyTestimonials, testimonialList: payload, total: payload.length };
  }

  const testimonialList = Array.isArray(payload?.testimonialList) ? payload.testimonialList : [];

  return {
    ...payload,
    testimonialList,
    total: payload?.total ?? testimonialList.length,
  };
};

const initialState = {
  testimonial: null,
  testimonials: emptyTestimonials,
  myTestimonials: [],
  isMyTestimonialsLoading: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllTestimonial = createAsyncThunk("testimonials/all", async (_, thunkAPI) => {
  try {
    return await testimonialService.getAllTestimonial();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getMyTestimonials = createAsyncThunk("testimonials/my", async (_, thunkAPI) => {
  try {
    return await testimonialService.getMyTestimonials();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getTestimonial = createAsyncThunk("testimonials/details", async (id, thunkAPI) => {
  try {
    return await testimonialService.getTestimonial(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createTestimonial = createAsyncThunk("testimonials/create", async (formdata, thunkAPI) => {
  try {
    return await testimonialService.createTestimonial(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteTestimonial = createAsyncThunk("testimonials/delete", async (id, thunkAPI) => {
  try {
    return await testimonialService.deleteTestimonial(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateTestimonial = createAsyncThunk("testimonials/update", async ({ id, data }, thunkAPI) => {
  try {
    return await testimonialService.updateTestimonial(id, data);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.testimonial = false;
      state.testimonials = emptyTestimonials;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.testimonials = normalizeTestimonials(action.payload);
      })
      .addCase(getAllTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.testimonials = emptyTestimonials;
        toast.error(action.payload);
      })
      .addCase(getMyTestimonials.pending, (state) => {
        state.isMyTestimonialsLoading = true;
      })
      .addCase(getMyTestimonials.fulfilled, (state, action) => {
        state.isMyTestimonialsLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.myTestimonials = action.payload?.testimonialList || [];
      })
      .addCase(getMyTestimonials.rejected, (state, action) => {
        state.isMyTestimonialsLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.myTestimonials = [];
        toast.error(action.payload);
      })
      .addCase(getTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.testimonial = action.payload;
      })
      .addCase(getTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.testimonial = null;
        toast.error(action.payload);
      })
      .addCase(createTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateTestimonial.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = testimonialSlice.actions;
export const selectBlog = (state) => state.testimonial.testimonial;
export default testimonialSlice.reducer;

import introService from "@/redux/services/portfolio/introOfPortfolioService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  intro: null,
  intros: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllIntroByAdmin = createAsyncThunk("Intros/all", async (_, thunkAPI) => {
  try {
    return await introService.getAllIntroByAdmin();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getIntro = createAsyncThunk("Intros/details", async (id, thunkAPI) => {
  try {
    return await introService.getIntro(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createIntro = createAsyncThunk("Intros/create", async (formdata, thunkAPI) => {
  try {
    return await introService.createIntro(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteIntro = createAsyncThunk("Intros/delete", async (id, thunkAPI) => {
  try {
    return await introService.deleteIntro(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateIntro = createAsyncThunk("Intros/update", async ({ id, formData }, thunkAPI) => {
  try {
    return await introService.updateIntro({ id, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

const IntroSlice = createSlice({
  name: "intro",
  initialState,
  reducers: {
    UNIVERSITY_RESET(state) {
      state.intro = false;
      state.intros = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllIntroByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIntroByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.intros = action.payload;
      })
      .addCase(getAllIntroByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.intros = null;
        toast.error(action.payload);
      })
      .addCase(getIntro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIntro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.intro = action.payload;
      })
      .addCase(getIntro.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.intro = null;
        toast.error(action.payload);
      })
      .addCase(createIntro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIntro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createIntro.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteIntro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteIntro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteIntro.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateIntro.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateIntro.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateIntro.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = IntroSlice.actions;
export const selectBlog = (state) => state.Intro.Intro;
export default IntroSlice.reducer;

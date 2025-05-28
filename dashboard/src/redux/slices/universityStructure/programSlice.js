import programService from "@/redux/services/universityStructure/programService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  program: null,
  programs: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};
export const getAllProgram = createAsyncThunk("programs/all", async (_, thunkAPI) => {
  try {
    return await programService.getAllProgram();
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const getProgram = createAsyncThunk("programs/details", async (slug, thunkAPI) => {
  try {
    return await programService.getProgram(slug);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const createProgram = createAsyncThunk("programs/create", async (formdata, thunkAPI) => {
  try {
    return await programService.createProgram(formdata);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});
export const deleteProgram = createAsyncThunk("programs/delete", async (id, thunkAPI) => {
  try {
    return await programService.deleteProgram(id);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const updateProgram = createAsyncThunk("programs/update", async ({ slug, formData }, thunkAPI) => {
  try {
    return await programService.updateProgram({ slug, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const programSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    PROGRAM_RESET(state) {
      state.program = false;
      state.programs = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProgram.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.programs = action.payload;
      })
      .addCase(getAllProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.programs = null;
        toast.error(action.payload);
      })
      .addCase(getProgram.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.program = action.payload;
      })
      .addCase(getProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.program = null;
        toast.error(action.payload);
      })
      .addCase(createProgram.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(createProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(deleteProgram.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateProgram.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProgram.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(updateProgram.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { RESOURCES_RESET } = programSlice.actions;
export const selectBlog = (state) => state.program.program;
export default programSlice.reducer;

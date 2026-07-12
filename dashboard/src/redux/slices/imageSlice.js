import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import imageService from "../services/imageService";

const initialState = {
  images: [],
  isError: false,
  isSuccess: false,
  isLoadingUpload: false, // For upload operations
  isLoadingDelete: false, // For delete operations
  message: "",
};
// Fetch all images
export const getAllImages = createAsyncThunk("images/getAll", async ({ folder, subfolder, groupId }, thunkAPI) => {
  try {
    return await imageService.getAllImages({ folder, subfolder, groupId });
  } catch (error) {
    const message = error.response?.data?.error || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

// Upload image
export const uploadImageToEditorDes = createAsyncThunk("images/upload", async (formData, thunkAPI) => {
  try {
    console.log("====================================");
    console.log(formData);
    console.log("====================================");
    const result = await imageService.uploadImageToEditorDes(formData);
    return result;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || "An error occurred";
    return thunkAPI.rejectWithValue(message);
  }
});

// Delete image
export const deleteImage = createAsyncThunk("images/delete", async (imageId, thunkAPI) => {
  try {
    return await imageService.deleteImage(imageId);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update image
export const updateImage = createAsyncThunk("images/update", async ({ id, formData }, thunkAPI) => {
  try {
    return await imageService.updateImage({ id, formData });
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    IMAGE_RESET(state) {
      state.images = [];
      state.isError = false;
      state.isSuccess = false;
      state.isLoadingUpload = false;
      state.isLoadingDelete = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllImages.pending, (state) => {
        state.isError = false;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.isLoadingUpload = false;
        state.isSuccess = true;
        state.isError = false;
        state.images = action.payload || { recentImages: [], olderImages: [] };
      })
      .addCase(getAllImages.rejected, (state) => {
        state.isLoadingUpload = false;
        state.isSuccess = false;
        state.isError = true;
        state.images = { recentImages: [], olderImages: [] };
      })
      .addCase(uploadImageToEditorDes.pending, (state) => {
        state.isLoadingUpload = true;
      })
      .addCase(uploadImageToEditorDes.fulfilled, (state, action) => {
        state.isLoadingUpload = false;
        state.isSuccess = true;
        state.isError = false;

        const uploadedImages = Array.isArray(action.payload?.images) ? action.payload.images : action.payload?.image ? [action.payload.image] : action.payload?.filePath ? [action.payload] : [];

        state.images = {
          recentImages: [...uploadedImages, ...(state.images?.recentImages || [])],
          olderImages: state.images?.olderImages || [],
        };

        toast.success("Image uploaded successfully!");
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoadingDelete = true;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.isLoadingDelete = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success(action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoadingDelete = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      })
      .addCase(updateImage.pending, (state) => {
        state.isLoadingUpload = true; // Assuming update is similar to upload
      })
      .addCase(updateImage.fulfilled, (state) => {
        state.isLoadingUpload = false;
        state.isSuccess = true;
        state.isError = false;
        toast.success("Image updated successfully!");
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoadingUpload = false;
        state.isSuccess = false;
        state.isError = true;
        toast.error(action.payload);
      });
  },
});

export const { IMAGE_RESET } = imageSlice.actions;
export default imageSlice.reducer;

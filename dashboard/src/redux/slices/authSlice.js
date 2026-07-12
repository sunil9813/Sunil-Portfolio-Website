import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authService from "../services/authService";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.error) {
    return data.error;
  }

  if (data?.message) {
    return data.message;
  }

  if (Array.isArray(data?.errors)) {
    return data.errors.map((item) => item?.message || item).join(", ");
  }

  if (typeof data?.errors === "object") {
    return Object.values(data.errors).flat().join(", ");
  }

  if (error?.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const getSuccessMessage = (payload, fallbackMessage = "Success") => {
  if (typeof payload === "string") return payload;

  return payload?.message || payload?.success || payload?.error || fallbackMessage;
};

const getUserFromPayload = (payload) => {
  return payload?.profile || payload?.user || payload;
};

const isTwoFactorMessage = (message = "") => {
  return message.includes("A new or unrecognized browser/device has been detected");
};

const initialState = {
  isLoggedIn: Boolean(localStorage.getItem("isLoggedIn") || localStorage.getItem("user") || localStorage.getItem("token")),
  user: getStoredUser(),
  profile: null,
  users: [],
  twoFactor: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  verifiedUsers: 0,
  suspendedUsers: 0,
};

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
  try {
    return await authService.register(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getLogInStatus = createAsyncThunk("auth/getLogInStatus", async (_, thunkAPI) => {
  try {
    return await authService.getLogInStatus();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getUserProfile = createAsyncThunk("auth/get-user", async (_, thunkAPI) => {
  try {
    return await authService.getUserProfile();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserProfile = createAsyncThunk("auth/update-user", async (userData, thunkAPI) => {
  try {
    return await authService.updateUserProfile(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserCover = createAsyncThunk("auth/update-cover", async (userData, thunkAPI) => {
  try {
    return await authService.updateUserCover(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const sendVerificationEmail = createAsyncThunk("auth/user-verification-email", async (_, thunkAPI) => {
  try {
    return await authService.sendVerificationEmail();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const verifyUser = createAsyncThunk("auth/user-verification-email/verificationToken", async (verificationToken, thunkAPI) => {
  try {
    return await authService.verifyUser(verificationToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const changePassword = createAsyncThunk("auth/change-password", async (userData, thunkAPI) => {
  try {
    return await authService.changePassword(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk("auth/forgot-password", async (userData, thunkAPI) => {
  try {
    return await authService.forgotPassword(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk("auth/reset-password", async ({ userData, resetToken }, thunkAPI) => {
  try {
    return await authService.resetPassword(userData, resetToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const getAllUserByAdmin = createAsyncThunk("admin/get-all-user", async (_, thunkAPI) => {
  try {
    return await authService.getAllUserByAdmin();
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const viewUserByAdmin = createAsyncThunk("admin/view-user", async (userId, thunkAPI) => {
  try {
    return await authService.viewUserByAdmin(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const deleteUserByAdmin = createAsyncThunk("admin/delete-user", async (id, thunkAPI) => {
  try {
    return await authService.deleteUserByAdmin(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const updateUserByAdmin = createAsyncThunk("admin/update-user", async (userData, thunkAPI) => {
  try {
    return await authService.updateUserByAdmin(userData);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const sendLoginCode = createAsyncThunk("admin/send-otp", async (email, thunkAPI) => {
  try {
    return await authService.sendLoginCode(email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const loginWithCode = createAsyncThunk("admin/login-with-otp", async ({ code, email }, thunkAPI) => {
  try {
    return await authService.loginWithCode(code, email);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const loginWithGoogle = createAsyncThunk("admin/login-with-google", async (userToken, thunkAPI) => {
  try {
    return await authService.loginWithGoogle(userToken);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const toggleFollow = createAsyncThunk("toggle/follow-user", async (userId, thunkAPI) => {
  try {
    return await authService.toggleFollow(userId);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET(state) {
      state.twoFactor = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    CALC_VERIFIED_USER(state) {
      state.verifiedUsers = state.users.filter((user) => user?.isVerified === true).length;
    },
    CALC_SUSPENDED_USER(state) {
      state.suspendedUsers = state.users.filter((user) => user?.role === "suspended").length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "Register successful");

        toast.success(state.message);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.user = null;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.twoFactor = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.twoFactor = false;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "Login successful");

        toast.success(state.message);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.user = null;
        state.message = action.payload;
        state.twoFactor = isTwoFactorMessage(action.payload);

        toast.error(action.payload);
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.twoFactor = false;
        state.user = null;
        state.profile = null;
        state.message = getSuccessMessage(action.payload, "Logout successful");

        toast.success(state.message);
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(getLogInStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLogInStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = Boolean(action.payload);
      })
      .addCase(getLogInStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.message = action.payload;
      })

      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "User updated successfully");

        toast.success(state.message);
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(updateUserCover.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserCover.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "Cover photo updated successfully");

        toast.success(state.message);
      })
      .addCase(updateUserCover.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(sendVerificationEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendVerificationEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Verification email sent");

        toast.success(state.message);
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Account verified successfully");

        toast.success(state.message);
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Password changed successfully");

        toast.success(state.message);
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Password reset email sent");

        toast.success(state.message);
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Password reset successfully");

        toast.success(state.message);
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(getAllUserByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUserByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getAllUserByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(viewUserByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(viewUserByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = getUserFromPayload(action.payload);
      })
      .addCase(viewUserByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.profile = null;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(deleteUserByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "User deleted successfully");

        toast.success(state.message);
      })
      .addCase(deleteUserByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(updateUserByAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "User updated successfully");

        toast.success(state.message);
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(sendLoginCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendLoginCode.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "OTP sent successfully");

        toast.success(state.message);
      })
      .addCase(sendLoginCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(loginWithCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithCode.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.twoFactor = false;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "Login successful");

        toast.success(state.message);
      })
      .addCase(loginWithCode.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.user = null;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        const user = getUserFromPayload(action.payload);

        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.user = user;
        state.message = getSuccessMessage(action.payload, "Login successful");

        toast.success(state.message);
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isLoggedIn = false;
        state.user = null;
        state.message = action.payload;

        toast.error(action.payload);
      })

      .addCase(toggleFollow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = getSuccessMessage(action.payload, "Action completed successfully");

        toast.success(state.message);
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;

        toast.error(action.payload);
      });
  },
});

export const { RESET, CALC_SUSPENDED_USER, CALC_VERIFIED_USER } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectUsers = (state) => state.auth.users;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthMessage = (state) => state.auth.message;

export default authSlice.reducer;

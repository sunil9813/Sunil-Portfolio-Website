import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  return localStorage.getItem("theme") || "dark"; // Default: 'dark'
};

const initialState = {
  mode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.mode;
export default themeSlice.reducer;

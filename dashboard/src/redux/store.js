import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import emailReducer from "./slices/emailSlice";
import resourceReducer from "./slices/resources/resourceSlice";
import categoryReducer from "./slices/resources/categorySlice";
import blogReducer from "./slices/blogSlice";
import imageReducer from "./slices/imageSlice";
import likeReducer from "./slices/common/likeSlice";
import favoriteReducer from "./slices/common/favoriteSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    resource: resourceReducer,
    category: categoryReducer,
    blog: blogReducer,
    image: imageReducer,
    like: likeReducer,
    favorite: favoriteReducer,
  },
});

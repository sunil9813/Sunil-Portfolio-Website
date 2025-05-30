import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import emailReducer from "./slices/emailSlice";
import resourceReducer from "./slices/resources/resourceSlice";
import categoryReducer from "./slices/resources/categorySlice";
import blogReducer from "./slices/blogSlice";
import imageReducer from "./slices/imageSlice";
import likeReducer from "./slices/common/likeSlice";
import favoriteReducer from "./slices/common/favoriteSlice";
import themeReducer from "./slices/themeSlice";
import projectReducer from "./slices/projectSlice";
import assetLimitReducer from "./slices/settings/AssestLimitSlice";
import universityReducer from "./slices/universityStructure/universitySlice";
import facultyReducer from "./slices/universityStructure/facultySlice";
import programReducer from "./slices/universityStructure/programSlice";
import courseReducer from "./slices/universityStructure/courseSlice";
import chapterReducer from "./slices/universityStructure/chapterSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    email: emailReducer,
    resource: resourceReducer,
    category: categoryReducer,
    blog: blogReducer,
    image: imageReducer,
    like: likeReducer,
    favorite: favoriteReducer,
    project: projectReducer,
    assetlimit: assetLimitReducer,
    university: universityReducer,
    faculty: facultyReducer,
    program: programReducer,
    course: courseReducer,
    chapter: chapterReducer,
  },
});

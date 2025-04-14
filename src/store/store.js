import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import courseReducer from "../slices/courseSlice";

export const createStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      courses: courseReducer,
    },
  });

const store = createStore();
export default store;

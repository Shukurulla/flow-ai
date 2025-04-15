import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import courseReducer from "../slices/courseSlice";
import UiReducer from "../slices/ui.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    ui: UiReducer,
  },
});

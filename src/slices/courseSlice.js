// slices/courseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, {
  fetchCourses,
  fetchTeacherCourses,
  getCourseMaterials,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/courses";

// Async thunks
export const loadCourses = createAsyncThunk(
  "courses/loadCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCourses();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadTeacherCourses = createAsyncThunk(
  "courses/loadTeacherCourses",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await fetchTeacherCourses(teacherId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loadCourseMaterials = createAsyncThunk(
  "courses/loadCourseMaterials",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await getCourseMaterials(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async ({ courseData, token }, { rejectWithValue }) => {
    try {
      const response = await createCourse(courseData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const editCourse = createAsyncThunk(
  "courses/editCourse",
  async ({ courseId, courseData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${courseId}/`, courseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeCourse = createAsyncThunk(
  "courses/removeCourse",
  async ({ courseId, token }, { rejectWithValue }) => {
    try {
      await deleteCourse(courseId, token);
      return courseId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const checkSubscriptions = createAsyncThunk(
  "courses/checkSubscriptions",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { courses } = getState().courses;
      const subscribedCourses = [];

      // Har bir kurs uchun obuna holatini tekshiramiz
      for (const course of courses) {
        const isSubscribed = await checkCourseSubscription(course.id, userId);
        if (isSubscribed) {
          subscribedCourses.push(course);
        }
      }

      return subscribedCourses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const subscribeToCourse = createAsyncThunk(
  "courses/subscribeToCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.post(`${courseId}/subscribe/`);

      return response.data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const initialState = {
  courses: [],
  subscribedCourses: [], // Obuna bo'lgan kurslar
  savedCourses: [], // Saqlangan kurslar
  currentCourse: null,
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    resetCourseError: (state) => {
      state.error = null;
    },
    saveCourse: (state, action) => {
      if (
        !state.savedCourses.some((course) => course.id === action.payload.id)
      ) {
        state.savedCourses.push(action.payload);
      }
    },
    unsaveCourse: (state, action) => {
      state.savedCourses = state.savedCourses.filter(
        (course) => course.id !== action.payload
      );
    },
    addSubscribedCourse: (state, action) => {
      if (!state.subscribedCourses.some((c) => c.id === action.payload.id)) {
        state.subscribedCourses.push(action.payload);
      }
    },
    removeSubscribedCourse: (state, action) => {
      state.subscribedCourses = state.subscribedCourses.filter(
        (course) => course.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Courses
      .addCase(loadCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(loadCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load Teacher Courses
      .addCase(loadTeacherCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTeacherCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(loadTeacherCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load Course Materials
      .addCase(loadCourseMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCourseMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(loadCourseMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Course
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Course
      .addCase(editCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Course
      .addCase(removeCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null;
        }
      })
      .addCase(removeCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(subscribeToCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToCourse.fulfilled, (state, action) => {
        state.loading = false;
        const course = state.courses.find((c) => c.id === action.meta.arg);
        if (
          course &&
          !state.subscribedCourses.some((c) => c.id === course.id)
        ) {
          state.subscribedCourses.push(course);
        }
      })
      .addCase(subscribeToCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkSubscriptions.fulfilled, (state, action) => {
        state.subscribedCourses = action.payload;
      });
  },
});

export const {
  addSubscribedCourse,
  setCourses,
  clearCurrentCourse,
  resetCourseError,
} = courseSlice.actions;
export default courseSlice.reducer;

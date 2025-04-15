import axios from "axios";
import { toast } from "react-hot-toast";
import { store } from "../store/store";

const API_URL = "https://akkanat.pythonanywhere.com/api/courses";

const api = axios.create({
  baseURL: API_URL,
});

// Har bir so'rov oldidan token qo'shamiz
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access") || store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Agar token yo'q bo'lsa, yangi token olish yoki login sahifasiga yo'naltirish
    store.dispatch({ type: "auth/logout" });
    window.location.href = "/login";
  }
  return config;
});
// Token yangilash uchun interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Agar 401 xatosi bo'lsa va token yangilanmagan bo'lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = store.getState().auth;
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        store.dispatch({ type: "auth/updateToken", payload: access });

        // Yangilangan token bilan so'rovni qayta jo'natamiz
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token yangilash ham ishlamasa, logout qilamiz
        store.dispatch({ type: "auth/logout" });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
export const fetchCourses = async () => {
  try {
    const response = await api.get(`${API_URL}/list/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTeacherCourses = async (teacherId) => {
  try {
    const response = await api.get(`${API_URL}/list/`);
    console.log(teacherId);

    return response.data.filter((c) => c.instructor?.id == teacherId);
  } catch (error) {
    throw error;
  }
};

export const getCourseMaterials = async (courseId) => {
  try {
    const response = await api.get(`${API_URL}/${courseId}/lessons`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubscribedCourses = async () => {
  try {
    const response = await api.get("/courses/subscribed/");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchLessons = async (id) => {
  try {
    const response = await api.get(
      `http://akkanat.pythonanywhere.com/api/lessons/lessons/${id}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const subscribeToCourse = async (courseId) => {
  try {
    const response = await api.post(`/courses/${courseId}/subscribe/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createCourse = async (courseData, token) => {
  try {
    const response = await api.post(`${API_URL}/`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Course created successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to create course");
    throw error;
  }
};

export const updateCourse = async (courseId, courseData, token) => {
  try {
    const response = await api.put(`${API_URL}/${courseId}/`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Course updated successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update course");
    throw error;
  }
};

export const deleteCourse = async (courseId, token) => {
  try {
    await api.delete(`${API_URL}/${courseId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Course deleted successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete course");
    throw error;
  }
};
export const checkCourseSubscription = async (courseId, userId) => {
  try {
    const response = await api.get(`/courses/${courseId}/`);
    const isSubscribed = response.data.students.some(
      (student) => student.id === userId
    );
    return isSubscribed;
  } catch (error) {
    console.error("Subscription check failed:", error);
    return false;
  }
};

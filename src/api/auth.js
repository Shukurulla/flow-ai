import axios from "axios";
import { toast } from "react-hot-toast";
import { store } from "../store/store";

const API_URL = "https://akkanat.pythonanywhere.com/api/users";

// Axios instance yaratamiz
const api = axios.create({
  baseURL: API_URL,
});

// Har bir so'rov oldidan token qo'shamiz
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
        const refreshToken = localStorage.getItem("refresh");
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
export const register = async (userData) => {
  try {
    const response = await api.post("/register/", userData);
    toast.success(response.data.message);
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);

    toast.error(error.response?.data?.message || "Registration failed");
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/login/", credentials);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await api.put("/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Profile updated successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile");
    throw error;
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, {
      refresh: refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

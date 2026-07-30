import axios from "axios";
import { clearAuth } from "@/utils/auth";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Automatically attach JWT to every request
API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (token) {
      // We'll add the expiry check in the next step
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



API.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      clearAuth();

      window.dispatchEvent(new Event("session-expired"));
    }

    return Promise.reject(error);
  }
);

export default API;
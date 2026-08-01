import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("access_token") ??
    sessionStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface UpdateProfilePayload {
  name: string;
  email: string;
  department?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const getMyProfile = async () => {
  const response = await API.get("/profile/me");
  return response.data;
};

export const updateMyProfile = async (payload: UpdateProfilePayload) => {
  const response = await API.put("/profile/me", payload);
  return response.data;
};
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

export interface UpdateStudentPayload {
  name: string;
  username: string;
  email: string;
  department?: string;
  newPassword?: string;
}

export const getStudentAccount = async () => {
  const response = await API.get("/admin/student/");
  return response.data;
};

export const updateStudentAccount = async (payload: UpdateStudentPayload) => {
  const response = await API.put("/admin/student/", payload);
  return response.data;
};

export const resetStudentPassword = async () => {
  const response = await API.post("/admin/student/reset-password");
  return response.data;
};
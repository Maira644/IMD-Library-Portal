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

export interface AnnouncementPayload {
  title: string;
  body: string;
  imageUrl?: string;
  pinned?: boolean;
  expiresAt?: string;
}

// ==========================
// GET ALL ANNOUNCEMENTS
// ==========================
export const getAnnouncements = async () => {
  const response = await API.get("/announcement/");
  return response.data.announcements;
};

// ==========================
// GET SINGLE ANNOUNCEMENT
// ==========================
export const getAnnouncement = async (id: string) => {
  const response = await API.get(`/announcement/${id}`);
  return response.data.announcement;
};

// ==========================
// CREATE ANNOUNCEMENT
// ==========================
export const createAnnouncement = async (announcement: AnnouncementPayload) => {
  const response = await API.post("/announcement/", announcement);
  return response.data;
};

// ==========================
// UPDATE ANNOUNCEMENT
// ==========================
export const updateAnnouncement = async (id: string, announcement: AnnouncementPayload) => {
  const response = await API.put(`/announcement/${id}`, announcement);
  return response.data;
};

// ==========================
// TOGGLE PIN
// ==========================
export const togglePinAnnouncement = async (id: string) => {
  const response = await API.patch(`/announcement/${id}/pin`);
  return response.data;
};

// ==========================
// DELETE ANNOUNCEMENT
// ==========================
export const deleteAnnouncement = async (id: string) => {
  const response = await API.delete(`/announcement/${id}`);
  return response.data;
};
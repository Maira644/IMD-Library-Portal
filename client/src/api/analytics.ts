import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// TOP SEARCHED KEYWORDS
// ==========================
export async function getTopKeywords() {
  const response = await API.get("/analytics/top-keywords");
  return response.data.keywords;
}

// ==========================
// RECENT ACTIVITY
// ==========================
export async function getRecentActivity() {
  const response = await API.get("/analytics/recent-activity");
  return response.data.activities;
}
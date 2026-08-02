import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// GET THEME
// ==========================
export async function getTheme() {
  const response = await API.get("/theme/");
  return response.data.theme;
}

// ==========================
// UPDATE THEME
// ==========================
export async function updateTheme(theme: any) {
  console.log("Sending theme:", theme);

  const response = await API.put("/theme/", theme);

  console.log("Response:", response.data);

  return response.data.theme;
}
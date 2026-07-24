import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ======================
// LOGIN
// ======================
export async function loginUser(
  username: string,
  password: string,
  role: string
) {
  const response = await API.post("/auth/login", {
    username,
    password,
    role,
  });

  return response.data;
}

// ======================
// GET ALL THESIS
// ======================
export async function getAllThesis() {
  const response = await API.get("/thesis");
  return response.data.thesis;
}

// ======================
// CREATE THESIS
// ======================
export async function createThesis(formData: FormData) {
  const response = await API.post("/thesis/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export default API;
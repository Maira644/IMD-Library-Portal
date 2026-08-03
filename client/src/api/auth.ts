import API from "./apiClient";

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
// FORGOT PASSWORD
// ======================
export async function forgotPassword(email: string) {
  const response = await API.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

// ======================
// VALIDATE RESET TOKEN
// ======================
export async function validateResetToken(token: string) {
  const response = await API.get("/auth/validate-reset-token", {
    params: { token },
  });

  return response.data;
}

// ======================
// RESET PASSWORD
// ======================
export async function resetPassword(
  token: string,
  password: string
) {
  const response = await API.post("/auth/reset-password", {
    token,
    password,
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
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// GET ALL THESIS
// ==========================
export async function getAllThesis() {
  const response = await API.get("/thesis/");
  return response.data;
}

// ==========================
// CREATE THESIS
// ==========================
export async function createThesis(formData: FormData) {
  const response = await API.post(
    "/thesis/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// ==========================
// UPDATE THESIS
// ==========================
export async function updateThesis(
  thesisId: string,
  formData: FormData
) {
  const response = await API.put(
    `/thesis/${thesisId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// ==========================
// DELETE THESIS
// ==========================
export async function deleteThesis(thesisId: string) {
  const response = await API.delete(
    `/thesis/${thesisId}`
  );

  return response.data;
}

// ==========================
// GET SINGLE THESIS
// ==========================
export async function getThesisById(thesisId: string) {
  const response = await API.get(`/thesis/${thesisId}`);
  return response.data.thesis;
}

// ==========================
// GET MOST VIEWED THESIS
// ==========================
export async function getMostViewedThesis() {
  const response = await API.get("/thesis/most-viewed");
  return response.data.thesis;
}
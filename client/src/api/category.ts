import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// GET ALL CATEGORIES
// ==========================
export const getCategories = async () => {
  const response = await API.get("/category/");
  return response.data.categories;
};

// ==========================
// GET SINGLE CATEGORY
// ==========================
export const getCategory = async (id: string) => {
    const response = await API.get(`/category/${id}`);
    return response.data;
};

// ==========================
// CREATE CATEGORY
// ==========================
export const createCategory = async (category: {
  name: string;
  description: string;
}) => {
  const response = await API.post("/category/", category);
  return response.data;
};

// ==========================
// UPDATE CATEGORY
// ==========================
export const updateCategory = async (
  id: string,
  category: {
    name: string;
    description: string;
  }
) => {
  const response = await API.put(`/category/${id}`, category);
  return response.data;
};


// ==========================
// DELETE CATEGORY
// ==========================
export const deleteCategory = async (id: string) => {
  const response = await API.delete(`/category/${id}`);
  return response.data;
};

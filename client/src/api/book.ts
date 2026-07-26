import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// GET ALL BOOKS
// ==========================
export async function getAllBooks() {
  const response = await API.get("/book/");
  return response.data;
}

// ==========================
// CREATE BOOK
// ==========================
export async function createBook(formData: FormData) {
  const response = await API.post(
    "/book/",
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
// GET SINGLE BOOK
// ==========================
export async function getBookById(bookId: string) {
  const response = await API.get(`/book/${bookId}`);
  return response.data.book;
}

// ==========================
// UPDATE BOOK
// ==========================
export async function updateBook(
  bookId: string,
  formData: FormData
) {
  const response = await API.put(
    `/book/${bookId}`,
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
// DELETE BOOK
// ==========================
export async function deleteBook(bookId: string) {
  const response = await API.delete(`/book/${bookId}`);
  return response.data;
}
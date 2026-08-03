import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ==========================
// SEARCH LIBRARY
// ==========================
export async function searchLibrary(query: string) {
  const response = await API.get("/search/", {
    params: {
      q: query,
    },
  });

  return response.data.results;
}

// ==========================
// RECORD SEARCH KEYWORD
// ==========================
export async function recordSearch(keyword: string) {
  return API.post("/search/record", {
    keyword: keyword.trim(),
  });
}

// ==========================
// GET TOP KEYWORDS
// ==========================
export async function getTopKeywords() {
  const response = await API.get("/search/top-keywords");

  return response.data.keywords;
}
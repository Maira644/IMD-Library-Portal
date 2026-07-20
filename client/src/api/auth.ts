import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

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
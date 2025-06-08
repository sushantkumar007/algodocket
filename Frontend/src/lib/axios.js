import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "https://myback.algodocket.com/api/v1",
  // baseURL: "http://localhost:8080/api/v1",
  // baseURL: "https://myback.algodocket.com/api/v1",
  baseURL: import.meta.env.BASE_URL,
  withCredentials: true,
});
console.log(".env: ", import.meta.env.VITE_BASE_URL)
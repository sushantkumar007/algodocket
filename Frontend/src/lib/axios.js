import axios from "axios";

// baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api/v1" : "/api/v1",


export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "http://myback.algodocket.com/api/v1",
  withCredentials: true,
});
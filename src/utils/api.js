import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL_LOCAL;

const api = axios.create({
  baseURL,
  withCredentials: true, // use if your backend needs cookies/auth
});

export default api;

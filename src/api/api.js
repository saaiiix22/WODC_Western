import axios from "axios";

export const baseURL = import.meta.env.VITE_API_BASE_URL
const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
})

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
Api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


export default Api
// import axios from "axios";
// import { loaderStore } from "../utils/loaderStore";

// export const baseURL = import.meta.env.VITE_API_BASE_URL
// const Api = axios.create({
//   baseURL: baseURL,
//   withCredentials: true,
// })

// Api.interceptors.request.use(
//   (config) => {
//     loaderStore.increment();
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) =>{ 
//     loaderStore.decrement();
//     return Promise.reject(error)
//   }
// );
// Api.interceptors.response.use(
//   (response) => {
//     loaderStore.decrement();
//     return response;
//   },
//   (error) => {
//     loaderStore.decrement();
//     return Promise.reject(error);
//   }
// );


// export default Api


import axios from "axios";
import { loaderStore } from "../utils/loaderStore";

export const baseURL = import.meta.env.VITE_API_BASE_URL;


const Api = axios.create({
  baseURL,
  withCredentials: true, 
});

export const PublicApi = axios.create({
  baseURL,
  withCredentials: false, 
});

Api.interceptors.request.use(
  (config) => {
    loaderStore.increment();

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loaderStore.decrement();
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    loaderStore.decrement();
    return response;
  },
  (error) => {
    loaderStore.decrement();
    return Promise.reject(error);
  }
);

PublicApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default Api;

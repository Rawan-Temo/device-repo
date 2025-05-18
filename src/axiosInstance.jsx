// import axios from "axios";
// import { host } from "./serverConfig.json";
// import axiosRetry from "axios-retry";

// const API_BASE_URL = `${host}/api`;

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // axiosRetry(axiosInstance, {
// //   retries: 3,
// //   retryDelay: axiosRetry.exponentialDelay,
// // });

// axiosInstance.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response, // Return response if successful
//   (error) => {
//     if (!error.response || error.response.status === 401 || isTokenExpired()) {
//       console.warn("Session expired or unreachable server, logging out...");
//       // logout();
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

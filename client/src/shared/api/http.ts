import axios, { AxiosError } from "axios";

export const http = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  function (error: AxiosError) {
    const status = error.response?.status;
    if (!status || status >= 500) {
      console.error("Server error. Try again later.");
    }

    return Promise.reject(error);
  },
);

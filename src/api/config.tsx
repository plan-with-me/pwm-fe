import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const api = axios.create({
  baseURL: "https://pwm.ssc.co.kr/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.headers.Authorization = cookies.get("auth");
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response;
    const statusCode = errorResponse.status;
    console.error("Error response data from server", errorResponse.data);
    if (statusCode === 401) {
      window.location.href = "/";
    }
  }
);

export default api;

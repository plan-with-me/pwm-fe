import axios from "axios";

const api = axios.create({
  baseURL: "https://pwm.ssc.co.kr/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  config => {
    config.headers.Authorization = localStorage.getItem("auth");
    return config;
  },
  error => Promise.reject(error),
)

export default api;
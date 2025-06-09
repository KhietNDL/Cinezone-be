import axios from "axios";

const api = axios.create({
  baseURL: "http://cinezone.info:4458/api/auth/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

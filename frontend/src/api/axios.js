import axios from "axios";

const api = axios.create({
  baseURL: "https://venturecube-ecommerce.onrender.com/api" || "http://localhost:5000",
  withCredentials: true,
});

export default api;

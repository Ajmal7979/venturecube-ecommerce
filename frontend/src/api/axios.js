import axios from "axios";

const api = axios.create({
  baseURL: "https://venturecube-ecommerce.onrender.com/api", // ✅ Render backend URL
  withCredentials: true,
});

export default api;

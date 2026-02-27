import axios from "axios";

const api = axios.create({
  baseURL: "https://habit-tracker-backend-zzba.onrender.com/api"
});

api.interceptors.request.use(req => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

export default api;
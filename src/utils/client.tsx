import axios from "axios";

const apiClient = axios.create({
  // URL para variable de entorno
  baseURL: process.env.NEXT_PUBLIC_DB_HOST
});

export default apiClient;
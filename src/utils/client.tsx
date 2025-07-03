import axios from "axios";

const apiClient = axios.create({
  // URL para variable de entorno
  baseURL: process.env.NEXT_PUBLIC_DB_HOST
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = window.localStorage.getItem('user')
    if (token) {
      const tokenParsed = JSON.parse(token)
      config.headers.Authorization = `Bearer ${tokenParsed.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
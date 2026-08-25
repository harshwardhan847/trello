import axios from "axios";
import { getAccessToken, setAccessToken } from "../auth/token";

export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        "http://localhost:8000/api/v1/auth/refresh",
        {},
        { withCredentials: true },
      )
      .then((response) => {
        const token = response.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;
    try {
      const token = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch {
      setAccessToken(null);
      return Promise.reject(error);
    }
  },
);

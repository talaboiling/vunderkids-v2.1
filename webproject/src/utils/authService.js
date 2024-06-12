import axios from "axios";
import { API_URL } from "./config";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAccessToken = (token) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const setRefreshToken = (token) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const clearTokens = () => {
  localStorage.clear();
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { email, password });
    if (response.status === 200) {
      const data = response.data;
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    }
  } catch (error) {
    throw new Error(error.response.data.detail || "Login failed");
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  setAccessToken(data.access);
  return data.access;
};

export const logout = () => {
  clearTokens();
};

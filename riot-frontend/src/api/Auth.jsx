import axios from "axios";

const API = axios.create({
  baseURL: "https://riot-backend.vercel.app",
  withCredentials: true,
});

export const login = async (email, password) => {
  const { data } = await API.post("/login", { email, password });
  return data;
};

export const register = async (email, password, username) => {
  const { data } = await API.post("/register", { email, password, username });
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get("/profile");
  return data;
};

export const logout = async () => {
  await API.post("/auth/logout");
};
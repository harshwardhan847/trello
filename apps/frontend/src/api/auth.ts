import type { LoginInput, SignupInput } from "schemas";
import { api } from "./client";

export async function signup(data: SignupInput) {
  const response = await api.post("/auth/signup", data);
  return response.data;
}
export async function login(data: LoginInput) {
  const response = await api.post("/auth/login", data);

  return response.data;
}

export async function refresh() {
  const response = await api.post("/auth/refresh");

  return response.data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function getCurrentUser() {
  const response = await api.get("/users/me");

  return response.data.user;
}

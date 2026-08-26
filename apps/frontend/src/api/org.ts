import type { CreateOrganizationInput } from "schemas";
import { api } from "./client";

export async function createOrg(data: CreateOrganizationInput) {
  const response = await api.post("/orgs", data);
  return response.data;
}

export async function getUserOrgs() {
  const response = await api.get("/orgs");
  return response.data;
}

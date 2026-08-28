import type { CreateIssueInput } from "schemas";
import { api } from "./client";

export async function createIssue(data: CreateIssueInput) {
  const response = await api.post(`/issues`, data);
  return response.data;
}

export async function getSectionIssues(sectionId: string) {
  const response = await api.get(`/issues/section/${sectionId}`);
  return response.data;
}

export async function getIssue(issueId: string) {
  const response = await api.get(`/issues/${issueId}`);
  return response.data;
}

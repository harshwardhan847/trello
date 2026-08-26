import type { CreateBoardInput } from "schemas";
import { api } from "./client";

export async function createBoard(data: CreateBoardInput) {
  const response = await api.post("/board", data);
  return response.data;
}

export async function getBoards(orgId: string) {
  const response = await api.get(`/boards/${orgId}`);
  return response.data;
}
export async function getBoard(boardId: string) {
  const response = await api.get(`/board/${boardId}`);
  return response.data;
}

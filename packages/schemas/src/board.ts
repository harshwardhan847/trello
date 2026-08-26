import { z } from "zod";

export const boardSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters").max(50),
  orgId: z.string("Org Id Missing"),
});
export const getBoardsSchema = z.object({
  orgId: z.string("Org Id Missing"),
});
export const getBoardSchema = z.object({
  boardId: z.string("Board Id Missing"),
});

export type CreateBoardInput = z.infer<typeof boardSchema>;

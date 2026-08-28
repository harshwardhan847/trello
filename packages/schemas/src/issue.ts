import { z } from "zod";

export const issueSchema = z.object({
  title: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  order: z.float32(),
  boardId: z.string(),
  sectionId: z.string(),
});

export const getIssuesSchema = z.object({
  sectionId: z.string(),
});
export const getIssueSchema = z.object({
  sectionId: z.string(),
});

export type CreateIssueInput = z.infer<typeof issueSchema>;

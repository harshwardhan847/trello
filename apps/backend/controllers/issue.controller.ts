import { response, type Request, type Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { getIssueSchema, getIssuesSchema, issueSchema } from "schemas";
import { prisma } from "db/client";

export const getIssuesBySection = catchAsync(
  async (req: Request, res: Response) => {
    const result = getIssuesSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.flatten(),
      });
    }
    const issues = await prisma.issue.findMany({
      where: { sectionId: result.data.sectionId },
      select: {
        title: true,
        description: true,
      },
      orderBy: {
        order: "asc",
      },
    });
    return res.status(200).json({
      issues,
    });
  },
);
export const createIssue = catchAsync(async (req: Request, res: Response) => {
  const result = issueSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  const issue = await prisma.issue.create({ data: result.data });

  return res.status(200).json({
    issue,
    message: "Issue Created Successfully!",
  });
});
export const getIssue = catchAsync(async (req: Request, res: Response) => {
  const result = getIssueSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }
  const issue = await prisma.issue.findUnique({
    where: {
      id: result.data.sectionId,
    },
  });
  return res.status(200).json({
    issue,
  });
});

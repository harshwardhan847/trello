import { prisma } from "db/client";
import type { Request, Response } from "express";
import { boardSchema, getBoardSchema, getBoardsSchema } from "schemas";
import { catchAsync } from "../utils/catchAsync";
export const createBoard = catchAsync(async (req: Request, res: Response) => {
  const result = boardSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }
  const { title, orgId } = result.data;

  const board = await prisma.board.create({
    data: {
      title,
      orgId,
    },
  });

  return res.json({
    message: "Board Created Successfully!",
    board,
  });
});
export const getBoards = catchAsync(async (req: Request, res: Response) => {
  const result = getBoardsSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      message: "Org Id Missing",
      errors: result.error.flatten(),
    });
  }
  const { orgId } = result.data;
  const boards = await prisma.board.findMany({ where: { orgId } });
  return res.status(200).json({
    boards,
  });
});
export const getBoard = catchAsync(async (req: Request, res: Response) => {
  const result = getBoardSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({
      message: "Board Id Missing",
      errors: result.error.flatten(),
    });
  }
  const { boardId } = result.data;
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  return res.status(200).json({
    board,
  });
});

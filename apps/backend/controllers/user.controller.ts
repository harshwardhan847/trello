import { prisma } from "db/client";
import type { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.json({
    user,
  });
});

import { prisma } from "db/client";
import type { Request, Response } from "express";
import { orgSchema } from "schemas";
import { catchAsync } from "../utils/catchAsync";

export const createOrg = catchAsync(async (req: Request, res: Response) => {
  const result = orgSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }
  const { name, description } = result.data;

  const org = await prisma.org.create({ data: { name, description } });
  const membership = await prisma.membership.create({
    data: {
      role: "ADMIN",
      userId: req.user.id,
      orgId: org.id,
      accepted: true,
    },
  });
  return res.status(201).json({
    message: "Organization created Successfully",
    org,
  });
});

export const getOrgs = catchAsync(async (req: Request, res: Response) => {
  const orgs = await prisma.membership.findMany({
    where: {
      userId: req.user.id,
    },
    select: {
      org: true,
    },
  });
  return res.status(200).json(orgs);
});

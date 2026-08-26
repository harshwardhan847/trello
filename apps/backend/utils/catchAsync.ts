import type { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    });
  };
};

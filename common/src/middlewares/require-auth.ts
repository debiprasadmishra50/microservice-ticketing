import { Request, Response, NextFunction } from "express";
import { NotAuthorisedError } from "../errors/not-authorised-error";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) throw new NotAuthorisedError("Unauthorised!!!");
  next();
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload } from "../../../auth/src/services/jwt-generate";

declare global {
  namespace Express {
    interface Request {
      currentUser?: JWTPayload;
    }
  }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) return next();

  try {
    const payload: JWTPayload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as JWTPayload;

    req.currentUser = payload;
  } catch (err) {}

  next();
};

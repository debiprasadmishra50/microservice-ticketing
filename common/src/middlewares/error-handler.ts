import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ status: err.status, errors: err.serializeErrors() });
  }

  console.error(err);
  res.status(500).json({ status: 500, errors: [{ message: err.message }] });
};

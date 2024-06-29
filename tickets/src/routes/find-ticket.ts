import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { param } from "express-validator";
import { NotFoundError, validateRequest } from "@debirapid-ticket/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  // requireAuth,
  [
    param("id")
      .notEmpty()
      .isString()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage("Valid Title ID is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let ticket = await Ticket.findById(new Types.ObjectId(req.params.id));

    if (!ticket) throw new NotFoundError("Ticket Not Found");

    res.status(200).json({ status: 200, data: ticket });
  }
);

export { router as showTicketRouter };

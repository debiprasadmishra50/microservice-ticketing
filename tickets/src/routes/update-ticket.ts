import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { body, param } from "express-validator";
import {
  BadRequestError,
  NotAuthorisedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@debirapid-ticket/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    param("id")
      .notEmpty()
      .isString()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage("Valid Title id is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("price").notEmpty().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let ticket = await Ticket.findById(new Types.ObjectId(req.params.id));
    console.log(ticket);

    // Validations for the ticket
    if (!ticket) throw new NotFoundError("Ticket Not Found");
    if (ticket.orderId) throw new BadRequestError("Can not edit a reserved ticket");
    if (ticket.userId !== req.currentUser!.id) throw new NotAuthorisedError("Invalid Owner!");

    let { title, price } = req.body;

    // Update the ticket
    ticket.set({ title, price });
    ticket = await ticket.save();

    // Publish the ticket data
    new TicketUpdatedPublisher(natsWrapper.client!).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).json({ status: 200, data: ticket });
  }
);

export { router as updateTicketRouter };

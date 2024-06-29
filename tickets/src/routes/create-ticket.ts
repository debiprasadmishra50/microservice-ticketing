import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@debirapid-ticket/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").notEmpty().isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // Save the ticket
    let ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    ticket = await ticket.save();

    // Publish the ticket data
    await new TicketCreatedPublisher(natsWrapper.client!).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    // send response
    res.status(201).json({ status: 201, data: ticket });
  }
);

export { router as createTicketRouter };

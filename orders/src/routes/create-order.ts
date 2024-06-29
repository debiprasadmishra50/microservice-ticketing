import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@debirapid-ticket/common";
import { Types } from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { EXPIRATION_WINDOW_SECONDS } from "../shared/constants";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError("Ticket not found");

    // Make sure that this ticket is not already reserved
    // Tun query to look at all orders,
    // Find an order where the ticket is the ticker we just found *and*
    // the orders status is *not* cancelled
    // If we find an order from that means the ticker *is* reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // Calculate an expiration date for this order
    const expiration = new Date();
    // will expire after X secs
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      ticket,
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client!).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: { id: ticket.id, price: ticket.price },
    });

    res.status(201).send(order);
  }
);

export { router as createOrdersRouter };

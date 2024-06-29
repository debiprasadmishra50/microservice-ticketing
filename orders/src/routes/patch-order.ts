import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotAuthorisedError, NotFoundError, requireAuth, validateRequest } from "@debirapid-ticket/common";
import { Types } from "mongoose";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// Mark the order cancelled when patch is called
router.patch(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .not()
      .isEmpty()
      .custom((input: string) => Types.ObjectId.isValid(input))
      .withMessage("valid orderId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError("Order not found");
    if (order.userId !== req.currentUser!.id) throw new NotAuthorisedError("Unauthorised!");
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client!).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order?.ticket.id },
    });

    res.status(200).send(order);
  }
);

export { router as deleteOrdersRouter };

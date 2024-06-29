import express, { Request, Response } from "express";
import { param } from "express-validator";
import { NotAuthorisedError, NotFoundError, requireAuth, validateRequest } from "@debirapid-ticket/common";
import { Order } from "../models/order";
import { Types } from "mongoose";

const router = express.Router();

router.get(
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
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) throw new NotFoundError("order not found");

    if (order.userId !== req.currentUser!.id) throw new NotAuthorisedError("Unauthorised!");

    res.status(200).json({ status: 200, data: order });
  }
);

export { router as findOneOrdersRouter };

import express, { Request, Response } from "express";
import { requireAuth } from "@debirapid-ticket/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.status(200).json({ Status: 200, data: orders });
});

export { router as findAllOrdersRouter };

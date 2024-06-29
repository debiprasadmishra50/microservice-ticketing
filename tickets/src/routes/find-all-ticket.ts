import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

// router.get("/api/tickets", requireAuth, validateRequest, async (req: Request, res: Response) => {
router.get("/api/tickets", async (req: Request, res: Response) => {
  let tickets = await Ticket.find({ orderId: null });

  res.status(200).json({ status: 200, results: tickets.length, data: tickets });
});

export { router as showAllTicketRouter };

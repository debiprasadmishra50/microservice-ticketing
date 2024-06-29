import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorisedError,
  OrderStatus,
} from "@debirapid-ticket/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError("Order not found");

    if (order.userId !== req.currentUser!.id) throw new NotAuthorisedError("Forbidden!!!");
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Cannot pay for an cancelled Order");

    // Call stripe
    const { paymentIntent } = await createAndConfirmPaymentIntent(token, order);

    const payment = Payment.build({
      orderId,
      stripeId: paymentIntent.id,
    });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client!).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: paymentIntent.id,
    });

    res.status(201).send({ paymentId: payment.id });
  }
);

async function createAndConfirmPaymentIntent(token: string, order: any) {
  try {
    // Step 1: Create a PaymentMethod using the token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: token, // Use the token you have, e.g., 'tok_visa'
      },
    });

    console.log("PaymentMethod created:", paymentMethod!.id);

    // Step 2: Create a PaymentIntent with the PaymentMethod
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // Amount in cents
      currency: "usd",
      payment_method: paymentMethod.id,
      confirmation_method: "automatic",
      confirm: true,
      return_url: "https://ticketing.dev/api/payment-confirm",
    });

    console.log("PaymentIntent created and confirmed:", paymentIntent?.id);

    return { paymentIntent };
  } catch (error: any) {
    throw new Error(`Error creating and confirming PaymentIntent: ${error.message}`);
  }
}

export { router as createChargeRouter };

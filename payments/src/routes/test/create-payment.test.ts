import request from "supertest";
import app from "../../app";
import { Types } from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@debirapid-ticket/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asfasf",
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnot belong to the user", async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asfasf",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new Types.ObjectId().toHexString();
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "afnahs" })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userId = new Types.ObjectId().toHexString();
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({ orderId: order.id, token: "tok_visa" })
    .expect(201);

  const pm_options = (stripe.paymentMethods.create as jest.Mock).mock.calls[0][0];
  const pi_options = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0];

  expect(pm_options.card.token).toEqual("tok_visa");
  expect(pi_options.amount).toEqual(order.price * 100);
  expect(pi_options.currency).toEqual("usd");

  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeNull();
});

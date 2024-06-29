import request from "supertest";
import { Types } from "mongoose";
import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const title = "Title 1";
const price = 10;

it("return a 404 if the ticket is not found", async () => {
  await request(app)
    .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(404);
});

it("return a 401 if the user isn't logged in", async () => {
  await request(app)
    .put(`/api/tickets/${new Types.ObjectId().toHexString()}`)
    // .set("Cookie", global.signin())
    .send()
    .expect(401);
});

it("return a 401 if the user doesn't own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", global.signin())
    .send({ title: "new title", price: 1000 })
    .expect(401);
});

it("return a 400 if the user provides an invalid title or price", async () => {
  const token = global.signin();

  const res = await request(app).post("/api/tickets").set("Cookie", token).send({ title, price }).expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", token)
    .send({ title: "new title", price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", token)
    .send({ title: "", price: 10 })
    .expect(400);
});

it("updates the ticket for provided valid inputs", async () => {
  const token = global.signin();

  const res = await request(app).post("/api/tickets").set("Cookie", token).send({ title, price }).expect(201);

  const ticketResponse = await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", token)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(ticketResponse.body.data.title).toEqual("new title");
  expect(ticketResponse.body.data.price).toEqual(100);
});

it("publishes an event", async () => {
  const token = global.signin();

  const res = await request(app).post("/api/tickets").set("Cookie", token).send({ title, price }).expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", token)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(natsWrapper.client?.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const token = global.signin();

  const res = await request(app).post("/api/tickets").set("Cookie", token).send({ title, price }).expect(201);

  const ticket = await Ticket.findById(res.body.data.id);
  ticket?.set({ orderId: new Types.ObjectId().toHexString() });
  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${res.body.data.id}`)
    .set("Cookie", token)
    .send({ title: "new title", price: 100 })
    .expect(400);
});

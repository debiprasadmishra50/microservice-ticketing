import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { Types } from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({ id: new Types.ObjectId().toHexString(), title: "concert", price: 20 });

  await ticket.save();

  return ticket;
};

it("fetches orders for an particular user", async () => {
  // create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // create 2 users
  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order as user #1
  await request(app).post("/api/orders").set("Cookie", userOne).send({ ticketId: ticketOne.id }).expect(201);

  // create two order as user #2
  const { body: orderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const res = await request(app).get("/api/orders").set("Cookie", userTwo).expect(200);

  // Make sure we only got orders for User #2
  expect(res.body.data.length).toEqual(2);
  expect(res.body.data[0].id).toEqual(orderOne.id);
  expect(res.body.data[1].id).toEqual(orderTwo.id);
  expect(res.body.data[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body.data[1].ticket.id).toEqual(ticketThree.id);
});

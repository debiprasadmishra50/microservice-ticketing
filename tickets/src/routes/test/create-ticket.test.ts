import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickers for post requests", async () => {
  const res = await request(app).post("/api/tickets").send({});

  expect(res.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const res = await request(app).post("/api/tickets").send({});

  expect(res.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const res = await request(app).post("/api/tickets").set("Cookie", global.signin()).send({});

  expect(res.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "j34b32j4",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "k234b23bj5",
    })
    .expect(400);
});

it("create a ticket with valid input", async () => {
  // add in a check to make sure a ticket was created
  let tickets = await Ticket.count();
  expect(tickets).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Title 1",
      price: 10,
    })
    .expect(201);

  tickets = await Ticket.count();
  expect(tickets).toEqual(1);
});

it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Title 1",
      price: 10,
    })
    .expect(201);

  expect(natsWrapper.client?.publish).toHaveBeenCalled();
});

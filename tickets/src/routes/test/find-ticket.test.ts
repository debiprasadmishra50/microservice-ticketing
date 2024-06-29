import request from "supertest";
import { Types } from "mongoose";
import app from "../../app";

it("return a 404 if the ticket is not found", async () => {
  await request(app)
    .get(`/api/tickets/${new Types.ObjectId().toHexString()}`)
    // .set("Cookie", global.signin())
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "Title 1";
  const price = 10;

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.data.id}`)
    // .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(ticketResponse.body.data.title).toEqual(title);
  expect(ticketResponse.body.data.price).toEqual(price);
});

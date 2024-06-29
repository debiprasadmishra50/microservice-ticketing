import request from "supertest";
import { randomBytes } from "crypto";
import app from "../../app";

const createTicket = () => {
  const title = randomBytes(4).toString("hex");
  const price = 10;

  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({ title, price });
};

it("returns results 0 if no tickets are found", async () => {
  const res = await request(app)
    .get("/api/tickets")
    // .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(res.body.results).toEqual(0);
});

it("returns results as 3 after 3 tickets are created", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app)
    .get("/api/tickets")
    // .set("Cookie", global.signin())
    .send()
    .expect(200);

  expect(res.body.results).toEqual(3);
});

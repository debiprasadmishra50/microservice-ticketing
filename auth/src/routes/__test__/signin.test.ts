import request from "supertest";
import app from "../../app";

describe("signin", () => {
  it("returns 400 with an invalid email", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ email: "testtest.com", password: "Password@123" })
      .expect(400);
  });

  it("fails when email provided doesn't exist", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(400);
  });

  it("fails when an incorrect password is supplied", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);

    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "Password@1234" })
      .expect(400);
  });

  it("response with a cookie when given valid credentials", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

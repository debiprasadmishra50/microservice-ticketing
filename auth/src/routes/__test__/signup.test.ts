import request from "supertest";
import app from "../../app";

describe("signup", () => {
  it("returns 201 on successful signup", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);
  });

  it("returns 400 with an invalid email", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "testtest.com", password: "Password@123" })
      .expect(400);
  });

  it("returns 400 with invalid password", async () => {
    await request(app).post("/api/users/signup").send({ email: "testtest.com", password: "a" }).expect(400);
  });

  it("returns 400 with missing email and password", async () => {
    await request(app).post("/api/users/signup").send({ email: "test@mail.com" }).expect(400);
    await request(app).post("/api/users/signup").send({ password: "Password@123" }).expect(400);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(400);
  });

  it("sets a cookit after successful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

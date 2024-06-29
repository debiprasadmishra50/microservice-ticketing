import request from "supertest";
import app from "../../app";

describe("signout", () => {
  it("clears the cookie after signing out", async () => {
    const createResponse = await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "Password@123" })
      .expect(201);

    expect(createResponse.get("Set-Cookie")).toBeDefined();

    const response = await request(app).post("/api/users/signout").expect(200);

    expect(response.get("Set-Cookie")[0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});

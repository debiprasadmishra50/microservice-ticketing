import request from "supertest";
import app from "../../app";

describe("Current User", () => {
  it("response with details about the current user", async () => {
    const cookie = await global.signin();

    const response = await request(app).get("/api/users/me").set("Cookie", cookie).send().expect(200);

    expect(response.body.data.email).toEqual("test@test.com");
  });

  it("response with error if not authenticated", async () => {
    const response = await request(app).get("/api/users/me").send().expect(401);

    expect(response.body.errors[0].message).toEqual("Unauthorised!!!");
  });
});

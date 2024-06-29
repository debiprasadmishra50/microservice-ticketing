import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "SECRET";
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT Payload
  const payload = { id: id || new Types.ObjectId().toHexString(), email: "test@mail.com" };

  // Create a JWT = {jwt: "token"}
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};

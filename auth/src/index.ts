import mongoose from "mongoose";

import app from "./app";

const start = async () => {
  console.log("App Starting...");

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[+] Connected to mongoDB");
  } catch (err) {
    console.error(err);
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("[+] Listening on port", port);
  });
};

start().catch(console.error);

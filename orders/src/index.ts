import mongoose from "mongoose";

import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const start = async () => {
  console.log("Orders Starting...");

  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.NATS_CLUSTER_ID) throw new Error("CLUSTER_ID must be defined");

  try {
    // NATS connection
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client!.on("close", () => {
      console.log("[+] NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client!.close());
    process.on("SIGTERM", () => natsWrapper.client!.close());

    // Initialize the Liteners
    new TicketCreatedListener(natsWrapper.client!).listen();
    new TicketUpdatedListener(natsWrapper.client!).listen();
    new ExpirationCompleteListener(natsWrapper.client!).listen();
    new PaymentCreatedListener(natsWrapper.client!).listen();

    // Database Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[+] Connected to mongoDB");
  } catch (err) {
    console.error(err);
  }

  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log("[+] Listening on port", port);
  });
};

start().catch(console.error);

import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName("order-service");

  // // Assigning queue group helps with sending an event to a particular instance of listener in case of horizontal scaling(adding more systems)
  // // Assuming we have 2 listeners, it will use round-robin to send the messages to 2 listeners,
  // const subscription = stan.subscribe("ticket:created", "orders-service-queue-group", options);

  // subscription.on("message", (msg: Message) => {
  //   console.log("Message Subject: Channel: Topic: ", msg.getSubject());

  //   console.log("Message Sequence", msg.getSequence());
  //   // console.log("Message Raw Data", msg.getRawData());
  //   console.log("Message Data", JSON.parse(msg.getData() as string));

  //   console.log("[+]--------------------------------------------------[+]");

  //   msg.ack(); // Manually acknowledge the message being received
  // });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

/* ////////////////////////////////////////////
  To check monitoring go to
  localhost:8222/streaming
  http://localhost:8222/streaming/channelsz?subs=1
*/

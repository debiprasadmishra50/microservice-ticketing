import { Types } from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@debirapid-ticket/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client!);

  // create and save a ticket
  const ticket = Ticket.build({ id: new Types.ObjectId().toHexString(), title: "concert", price: 10 });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: "new concert",
    price: 12,
    userId: new Types.ObjectId().toHexString(),
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write the assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, ticket, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write the assertions to make sure ack was called
  expect(msg.ack).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("doesn't call ack if the event has skipped a version update", async () => {
  const { listener, data, ticket, msg } = await setup();

  data.version = 10;

  // call the onMessage function with the data object + message object
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  // write the assertions to make sure ack was NOT called
  expect(msg.ack).not.toHaveBeenCalled();
});

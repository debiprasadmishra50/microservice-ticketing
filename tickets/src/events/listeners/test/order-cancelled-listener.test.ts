import { Types } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@debirapid-ticket/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client!);

  // Create and save a ticket
  const orderId = new Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: new Types.ObjectId().toHexString(),
  });
  // Assign Order Id
  ticket.set({ orderId });
  await ticket.save();

  // Create the fake data object
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, orderId, data, msg };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  const { listener, ticket, orderId, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(null);
  expect(msg.ack).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalledTimes(1);
  expect(natsWrapper.client?.publish).toHaveBeenCalled();
  expect(natsWrapper.client?.publish).toHaveBeenCalledTimes(1);
});

import { Types } from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@debirapid-ticket/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client!);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: new Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // Create the fake data object
  const data: OrderCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: ticket.userId,
    expiresAt: "afnahkfn",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client?.publish).toHaveBeenCalled();
  expect(natsWrapper.client?.publish).toHaveBeenCalledTimes(1);

  const ticketUpdatedData = JSON.parse((natsWrapper.client?.publish as jest.Mock).mock.calls[0][1]);
  console.log(ticketUpdatedData);

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

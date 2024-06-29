import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@debirapid-ticket/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) throw new Error("Ticket Not Found");

    const { title, price, version } = data;
    ticket.set({ title, price, version });

    await ticket.save();

    msg.ack();
  }
}

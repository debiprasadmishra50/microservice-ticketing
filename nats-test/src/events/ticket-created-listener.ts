import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log(`Event Data: Seq: ${msg.getSequence()}, Data:`, data);
    console.log("-".repeat(30));

    msg.ack();
  }
}

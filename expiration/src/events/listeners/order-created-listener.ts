import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@debirapid-ticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queues";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`[+] Waiting ${delay} miliseconds to process the job for order ${data.id}`);

    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}

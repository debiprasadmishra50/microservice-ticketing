import { Listener, OrderStatus, PaymetnCreatedEvent, Subjects } from "@debirapid-ticket/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymetnCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymetnCreatedEvent["data"], msg: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}

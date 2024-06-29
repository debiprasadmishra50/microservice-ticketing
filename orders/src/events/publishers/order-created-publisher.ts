import { Publisher, OrderCreatedEvent, Subjects } from "@debirapid-ticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

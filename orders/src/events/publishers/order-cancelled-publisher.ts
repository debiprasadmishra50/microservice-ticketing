import { Publisher, Subjects, OrderCancelledEvent } from "@debirapid-ticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

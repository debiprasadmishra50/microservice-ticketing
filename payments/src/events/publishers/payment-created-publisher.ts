import { PaymetnCreatedEvent, Publisher, Subjects } from "@debirapid-ticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymetnCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

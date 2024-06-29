import { Publisher, Subjects, TicketCreatedEvent } from "@debirapid-ticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

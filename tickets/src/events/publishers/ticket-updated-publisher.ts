import { Publisher, Subjects, TicketUpdatedEvent } from "@debirapid-ticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

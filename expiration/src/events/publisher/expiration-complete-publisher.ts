import { ExpirationCompleteEvent, Publisher, Subjects } from "@debirapid-ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

import { Publisher, Subjects, TicketUpdatedEvent } from "@microservices-commons/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

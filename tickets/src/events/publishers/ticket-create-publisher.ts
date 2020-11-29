import { Publisher, Subjects, TicketCreatedEvent } from "@microservices-commons/common";


export class TicketcreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}

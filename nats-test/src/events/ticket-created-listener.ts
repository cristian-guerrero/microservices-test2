import { Message } from "node-nats-streaming"
import { Listener } from "./base-listener"
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';



class TicketCreatedListener extends Listener<TicketCreatedEvent> {

  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'payments-service'

  onMessage(parsedData: TicketCreatedEvent['data'], msg: Message): void {

    console.log('Event data!', parsedData)

    msg.ack()
  }

}


export { TicketCreatedListener } 

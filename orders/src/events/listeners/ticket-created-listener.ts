import { Listener, Subjects, TicketCreatedEvent } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName


  onMessage(parsedData: TicketCreatedEvent["data"], msg: Message): void {


  }



}

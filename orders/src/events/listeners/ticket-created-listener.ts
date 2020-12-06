
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import { Listener, Subjects, TicketCreatedEvent } from '@microservices-commons/common'


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName: string = queueGroupName


  async onMessage(parsedData: TicketCreatedEvent["data"], msg: Message) {

    const { title, price , id} = parsedData

    const ticket = await Ticket.create({
      _id: id,
      title, price
    })

    msg.ack()


  }
}

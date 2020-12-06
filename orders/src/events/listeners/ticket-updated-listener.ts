import { Listener, Subjects, TicketUpdatedEvent } from '@microservices-commons/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated


  async onMessage(parsedData: TicketUpdatedEvent['data'], msg: Message) {

    const ticket = await Ticket.findById(parsedData.id)

    const { title, price } = parsedData
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ title, price })
    msg.ack()

  }
}

import { Listener, Subjects, TicketUpdatedEvent } from '@microservices-commons/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated


  async onMessage(parsedData: TicketUpdatedEvent['data'], msg: Message) {

    const ticket = await Ticket.findOne({
      _id: parsedData.id,
      version: parsedData.version -1
    })

    const { title, price } = parsedData
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    await ticket.set({ title, price }).save()
    msg.ack()

  }
}

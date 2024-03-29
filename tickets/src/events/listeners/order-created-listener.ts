import { Listener, OrderCreatedEvent, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'
import { TicketUpdatedPublisher } from '../publishers/ticket-update-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(parsedData: OrderCreatedEvent ['data'], msg: Message) {


    const ticket = await Ticket.findById(parsedData.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: parsedData.id })

    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      version: ticket.version!,
      id: ticket.id!,
      price: ticket.price,
      title: ticket.title,
      orderId: ticket.orderId,
      userId: ticket.orderId!
    })

    msg.ack()

  }
}

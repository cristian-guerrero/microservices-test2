import { Listener, OrderCancelledEvent, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'
import { TicketUpdatedPublisher } from '../publishers/ticket-update-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled

  async onMessage(parsedData: OrderCancelledEvent['data'], msg: Message) {

    const ticket = await Ticket.findById(parsedData.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    await ticket.set({ orderId: undefined }).save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      orderId: ticket.orderId,
      price: ticket.price,
      version: ticket.version!,
      title: ticket.title
    })

    msg.ack()

  }

}

import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

  async onMessage(parsedData: ExpirationCompleteEvent['data'], msg: Message) {


    const order = await Order.findById(parsedData.orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    await order.set({
      status: OrderStatus.Cancelled,
    }).save()

    await new OrderCancelledPublisher(this.client).publish({

      id: order.id!, version: order.version!, ticket: { id: order.ticket.id! }
    })

    msg.ack()

  }


}

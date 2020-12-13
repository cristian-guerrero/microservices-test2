import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../src/models/order'
import  {queueGroupName } from './queue-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {


  queueGroupName = queueGroupName
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled


  async onMessage(parsedData: OrderCancelledEvent['data'], msg: Message) {

    const order = await Order.findOne({
      _id: parsedData.id,
      version: parsedData.version
    })

    if (!order) {

      throw new Error('Order not found')
    }

    await order.set({ status: OrderStatus.Cancelled }).save()

    msg.ack()
  }
}

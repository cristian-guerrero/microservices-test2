import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@microservices-commons/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated


  async onMessage(parsedData: PaymentCreatedEvent['data'], msg: Message) {

    const order = await  Order.findById(parsedData.orderId)

    if(!order) {
      throw new Error('Order not found')
    }

    await order.set({
      status: OrderStatus.Complete
    }).save()

    msg.ack()
  }


}

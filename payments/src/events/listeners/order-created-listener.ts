import { Listener, OrderCreatedEvent, Subjects } from '@microservices-commons/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.OrderCreated = Subjects.OrderCreated


  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {


    const order = await Order.create({
      _id: parsedData.id,
      price: parsedData.ticket.price,
      status: parsedData.status,
      userId: parsedData.userId,
      version: parsedData.version
    })


    msg.ack()



  }


}

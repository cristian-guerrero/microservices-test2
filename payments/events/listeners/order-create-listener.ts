import { Listener, OrderCreatedEvent, Subjects } from '@microservices-commons/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../src/models/order'


export class OrderCreateListener extends Listener<OrderCreatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.OrderCreated = Subjects.OrderCreated


  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {


    const order = await Order.create({
      id: parsedData.ticket.id,
      price: parsedData.ticket.price,
      status: parsedData.status,
      userId: parsedData.userId,
      version: parsedData.version
    })


    msg.ack()



  }


}

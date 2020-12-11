import { Listener, OrderCreatedEvent, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  queueGroupName = queueGroupName
  subject: Subjects.OrderCreated = Subjects.OrderCreated

  async onMessage(parsedData: OrderCreatedEvent['data'], msg: Message) {

    await expirationQueue.add({
      orderId: parsedData.id
    })

    msg.ack()

  }

}

import { Listener, OrderCreatedEvent, Subjects } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

  subject: Subjects.OrderCreated = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(parsedData: OrderCreatedEvent ['data'], msg: Message) {



  }
}

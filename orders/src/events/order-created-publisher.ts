import { OrderCreatedEvent, Publisher, Subjects } from '@microservices-commons/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated


}

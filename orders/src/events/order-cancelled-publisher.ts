import { OrderCancelledEvent, Publisher, Subjects } from '@microservices-commons/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled

}

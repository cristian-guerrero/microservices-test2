import { PaymentCreatedEvent, Publisher, Subjects } from '@microservices-commons/common'


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated

}

import { ExpirationCompleteEvent, Publisher, Subjects } from '@microservices-commons/common'


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete

}

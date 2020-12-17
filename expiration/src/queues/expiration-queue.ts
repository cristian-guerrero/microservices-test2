import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'


interface Payload {
  orderId: string
}

let expirationQueue: any

const expirationConnect = () => {

  try{

   expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
      host: process.env.REDIS_HOST_EXPIRATION
    }
  })

    expirationQueue.process(async (job: any) => {

      new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
      })

      console.log('publish an expiration:complete event for orderId', job.data.orderId)



    })

  } catch (err) {
    console.log(err)
    process.exit()
  }

}

expirationConnect()





export { expirationQueue }

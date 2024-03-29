import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'


const checkEnvironment = () => {


  if (!process.env.NATS_URL) {
    throw new Error('process.env.NATS_URL is not defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('process.env.NATS_CLUSTER_ID is not defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('process.env.NATS_CLIENT_ID is not defined')
  }
  if (!process.env.REDIS_HOST_EXPIRATION) {
    throw new Error('process.env.REDIS_HOST_EXPIRATION is not defined')
  }

}


const start = async () => {

  checkEnvironment()

  try {
    await natsWrapper.connect(
      //'ticketing',
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    )

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()


    console.log('Expiration service up!!')
  } catch (err) {


    // process.on('SIGINT', () => natsWrapper.client.close())
    // process.on('SIGTERM', () => natsWrapper.client.close())
    console.error(err)
    process.exit()
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
  }

}


start()


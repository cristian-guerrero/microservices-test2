import { connect } from 'mongoose'


import app from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'




const checkEnvironment = () => {

  if (!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }
  if (!process.env.URL_DB_PAYMENTS) {
    throw new Error('process.env.URL_DB_PAYMENTS is not defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('process.env.NATS_URL is not defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('process.env.NATS_CLUSTER_ID is not defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('process.env.NATS_CLIENT_ID is not defined')
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error('process.env.STRIPE_KEY is not defined')
  }

}


const start = async () => {

  checkEnvironment()


  const url = process.env.URL_DB_PAYMENTS!

  try {

    // console.log('Pod id ->' +process.env.NATS_CLIENT_ID )
    // console.log('cluster id ->' +process.env.NATS_CLUSTER_ID )
    // console.log('url id ->' +process.env.NATS_URL )

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


    new OrderCancelledListener(natsWrapper.client).listen()

    new OrderCreatedListener(natsWrapper.client).listen()


    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
    })

    console.log('Connected to database in: ', url)

    app.listen(3000, () => {


      console.log('Payments server listening on localhost:3000')
    })

  } catch (err) {

    console.error(err)
  }

}


start()


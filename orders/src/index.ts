import mongoose from 'mongoose'


import app from './app'
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener'
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener'
import { PaymentCreatedListener } from './events/listeners/payment-created-listener'


const checkEnvironment = () => {

  if (!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }
  if (!process.env.URL_DB_ORDERS) {
    throw new Error('process.env.URL_DB_ORDERS is not defined')
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

}


const start = async () => {

  checkEnvironment()


  const url = process.env.URL_DB_ORDERS!

  try {

    // console.log('Pod id ->' +process.env.NATS_CLIENT_ID )
    // console.log('culster id ->' +process.env.NATS_CLUSTER_ID )
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

    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log('Connected to database in: ', url)

    app.listen(3000, () => {


      console.log('Tickets server listening on localhost:3000')
    })

  } catch (err) {

    console.error(err)
  }

}


start()


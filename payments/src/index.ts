import { connect } from 'mongoose'


import app from './app'
import { natsWrapper } from './nats-wrapper'




const checkEnvironment = () => {

  if (!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }
  if (!process.env.URL_DB_TICKETS) {
    throw new Error('process.env.URL_DB_TICKETS is not defined')
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


  const url = process.env.URL_DB_TICKETS!

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




    await connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true
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


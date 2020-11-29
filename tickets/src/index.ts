import mongoose from 'mongoose'


import app from './app'
import { nastWrapper } from './nats-wrapper';


const checkEnvironmet = () => {

  if (!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }
  if (!process.env.URL_DB_TICKETS) {
    throw new Error('process.env.URL_DB_TICKETS is not defined')
  }
}


const start = async () => {

  checkEnvironmet()


  const url = process.env.URL_DB_TICKETS!

  try {

    await nastWrapper.connect('ticketing',
      'randonvalue', 'http://nats-clusterip-srv:4222')

      nastWrapper.client.on('close', () => {
        console.log('NATS connection closed!')
        process.exit()
      })

      process.on('SIGINT', () => nastWrapper.client.close())
      process.on('SIGTERM', () => nastWrapper.client.close())


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


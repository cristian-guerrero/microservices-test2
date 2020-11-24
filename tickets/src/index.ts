import mongoose from 'mongoose'


import app from './app'


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
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log('connected to database in: ', url)

    app.listen(3000, () => {

      console.log('Tickets server listening on localhost:3000')
    })

  } catch (err) {

    console.error(err)
  }

}


start()


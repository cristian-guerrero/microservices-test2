import mongoose from 'mongoose'


import app from './app'


const start = async () => {
  if(!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }
  if(!process.env.URL_DB_AUTH) {
    throw new Error('process.env.URL_DB_AUTH is not defined')
  }

  console.log('Starting up ...')

  const url = process.env.URL_DB_AUTH

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    console.log('connected to: ', url)

    app.listen(3000, () => {

      console.log('Auth server listening on localhost:3000')
    })

  } catch (err) {

    console.error(err)
  }

}


start()


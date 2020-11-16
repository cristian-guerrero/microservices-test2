import mongoose from 'mongoose'


import app from './app'


const start = async () => {
  const url = 'mongodb://auth-mongo-clusterip-srv:27017/auth'


  if(!process.env.JWT_KEY) {
    throw new Error('process.env.JWT_KEY is not defined')
  }

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


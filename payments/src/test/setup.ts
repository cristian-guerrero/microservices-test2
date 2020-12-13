
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'



/*
declare global  {
  namespace NodeJs {
    interface Global {
      signup(): Promise<string[]>
    }
  }
}
*/
/*
declare module NodeJs {
  interface Global {
    signup(): Promise<string[]>
  }
}

*/
/*
declare global  {
  function signup(): Promise<string[]>
}
*/

let mongo: any

process.env = Object.assign(process.env, {
  JWT_KEY: 'A_KEY',
  NODE_ENV: 'test',
  STRIPE_KEY: 'sk_test_51Hxy6vH5RgEaYNEwtFWW6QDCXNrM7KrgdE26EN9N77jlMKBj5jSHWtw8bAzxkNjsT6GZrnzQbTeZyqw1NkuXDKqU00wKSijf5X'
});

// mockup
jest.mock('../nats-wrapper')

beforeAll(async () => {
  // process.env.JWT_KEY = 'A_KEY'

  mongo = new MongoMemoryServer()

  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

})

beforeEach(async () => {

  jest.clearAllMocks()
  
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {

  await mongo.stop()

  await mongoose.connection.close()

})

/*

*/

import { MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../app'

let mongo: any

process.env = Object.assign(process.env, {
  JWT_KEY : 'A_KEY'
});

beforeAll(async() => {
  // process.env.JWT_KEY = 'A_KEY'

   mongo = new MongoMemoryServer()

  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

})

beforeEach(async () =>{

  const collections = await mongoose.connection.db.collections()

  for(const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {

  await mongo.stop()

  await mongoose.connection.close()


})
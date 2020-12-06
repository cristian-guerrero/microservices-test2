import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { signingTest } from '../../test/signup'


it('returns an error if the ticket does not exist', async () => {

  const ticketId = mongoose.Types.ObjectId()

  const cookie = signingTest()

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send( {
      ticketId
    })
    .expect(404)


})


it('returns an error if the ticket is already reserved', async () => {

})


it('reserves a ticket ', async () => {

})





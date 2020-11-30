import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { signinTest } from '../../test/signup';
import { natsWrapper } from '../../nats-wrapper';




it('return a 404 if the provided id does not exist ' ,  async () => {

  const id = new mongoose.Types.ObjectId().toHexString()
  await request (app)
  .put('/api/tickets' + id )
  .set('Cookie', signinTest())
  .send ({
    title: 'a new title ...',
    price: 40
  })
  .expect(404)

})

it('return a 401 if the user is not authenticated ' ,  async () => {
  
  const id = new mongoose.Types.ObjectId().toHexString()
  await request (app)
  .put('/api/tickets/' + id )
  // .set('Cookie', signinTest())
  .send ({
    title: 'a new title ...',
    price: 40
  })
  .expect(401)
})

it('return a 401 if the user does not own the ticket ' ,  async () => {
  

  const response = await request (app)
  .post('/api/tickets/' )
  .set('Cookie', signinTest())
  .send ({
    title: 'a new title ...',
    price: 40
  })


  await request (app)
  .put('/api/tickets/' +  response.body.id)
  .set('Cookie', signinTest())
  .send ({
    title: 'a new title ...',
    price: 30
  }).expect(401)

})

it('return a 400 if the user provides an invalid title  or price  ' ,  async () => {
  
  const cookie = signinTest();
  const response = await request (app)
  .post('/api/tickets/' )
  .set('Cookie', cookie)
  .send ({
    title: 'a new title ...',
    price: 40
  })

  await request (app)
  .put('/api/tickets/' +  response.body.id)
  .set('Cookie',cookie)
  .send ({
    title: '',
    price: 30
  }).expect(400)

  await request (app)
  .put('/api/tickets/' +  response.body.id)
  .set('Cookie',cookie)
  .send ({
    title: '',
    price: -30
  }).expect(400)

})

it('updates the ticket provided valid inputs' ,  async () => {
  
  const cookie = signinTest();
  const response = await request (app)
  .post('/api/tickets/' )
  .set('Cookie', cookie)
  .send ({
    title: 'a new title ...',
    price: 40
  })

  await request (app)
  .put('/api/tickets/' +  response.body.id)
  .set('Cookie',cookie)
  .send ({
    title: 'other title',
    price: 100
  }).expect(200)


  const ticketResponse = await request(app)
  .get('/api/tickets/' + response.body.id)
  .send()


  expect(ticketResponse.body.title ).toEqual('other title')
  expect(ticketResponse.body.price ).toEqual(100)


})



it('publishes an event ', async () => {

  const cookie = signinTest();
  const response = await request (app)
  .post('/api/tickets/' )
  .set('Cookie', cookie)
  .send ({
    title: 'a new title ...',
    price: 40
  })

  await request (app)
  .put('/api/tickets/' +  response.body.id)
  .set('Cookie',cookie)
  .send ({
    title: 'other title',
    price: 100
  }).expect(200)

    // console.log(natsWrapper)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

})
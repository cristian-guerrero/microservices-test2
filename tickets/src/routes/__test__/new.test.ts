import request from 'supertest'
import  app from '../../app';
import { signinTest } from '../../test/signup';



it('has a route handler listening to /api/tickers for post request', async () => {

  const response = await request(app)
  .post('/api/tickets')
  .send({

  })

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if he user is signed in ', async () => {

  request(app)
  .post('/api/tickets')
  .send({})
  .expect(401)

})

it('returns a status other than 401 if the user is signed in ', async () => {



  const response= await request(app)

  .post('/api/tickets')
  .set('Cookie', signinTest())
  .send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {

  await request(app)
  .post('/api/tickets')
  .set('Cookie', signinTest())
  .send({
    title: '',
    price: 10
  })
  .expect(400)

  // request.post('')
})

it('returns an error if an invalid price is provided', async () => {

  await request(app)
  .post('/api/tickets')
  .set('Cookie', signinTest())
  .send({
    title: 'Title',
    price: -10
  })
  .expect(400)

  await request(app)
  .post('/api/tickets')
  .set('Cookie', signinTest())
  .send({
    title: 'Title',
  })
  .expect(400)

})

it('creates a ticket with valid inputs', async () => {

  // adde in a check to make sure a ticket was saved

  await request (app)
  .post('/api/tickets')
  .send({
    title: 'a title.',
    price:30
  })

  // request.post('')
})
import request from 'supertest'
import  app from '../../app';



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

  const response= await request(app).post('/api/tickets').send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provided', async () => {

  // request.post('')
})

it('returns an error if an invalid price is provided', async () => {

  // request.post('')
})

it('creates a ticket with valid inputs', async () => {

  // request.post('')
})
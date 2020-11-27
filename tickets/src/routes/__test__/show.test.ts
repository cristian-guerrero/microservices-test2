import request from 'supertest';
import app from '../../app';
import { signinTest } from '../../test/signup';




it('return a 404 if the ticket is not found' , async ( ) => {
  await request(app)
  .get('/api/tickets/unidquenoexiste')
  .send()
  .expect(404)

})


it('return the tickert if the ticket is found ' , async ( ) => {
  const cookie = signinTest()
  const title = 'Concert'
  const price = 20
 const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', cookie )
  .send({
    title, price 
  }).expect(201)


  console.log(response.body)
  const ticketResponse = await request(app)
  .get(`/api/tickets/${response.body.id}`)
  .send()
  .expect(200)
  
  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})

















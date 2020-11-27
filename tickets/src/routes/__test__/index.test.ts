import request from 'supertest'
import app from '../../app'
import { signinTest } from '../../test/signup'


const createTicket =  () => {

  return  request(app)
  .post('/api/tickets')
  .set('Cookie', signinTest())
  .send({
    title: 'A title',
    price:  20
  })
}



it('can fech a list of tickets', async () => {


  await createTicket()
  await createTicket()
  await createTicket()


  const response = await request(app)
  .get('/app/tickets')
  .send()
  .expect(200)

  expect(response.body.length).toEqual(3)


})
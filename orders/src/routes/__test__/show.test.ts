import request from 'supertest'
import { Ticket } from '../../models/ticket'
import { signinTest } from '../../../../tickets/src/test/signup'
import app from '../../app'

it('feches the order', async () => {


  const ticket = await Ticket.create({
    title: 'Concert ',
    price: 72
  })

  const user = signinTest()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', user)
    .send()
    .expect(200)


  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if one user tries to fetch another users order', async () => {


  const ticket = await Ticket.create({
    title: 'Concert ',
    price: 72
  })

  const user = signinTest()
  const userTwo = signinTest()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: fetchedOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', userTwo)
    .send()
    .expect(401)


})

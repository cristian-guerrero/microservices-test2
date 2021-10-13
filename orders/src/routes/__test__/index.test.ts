import request from 'supertest'
import { signingTest } from '../../test/signup'
import { Ticket } from '../../models/ticket'
import app from '../../app'


const buildTicket = async () => {
  const ticket = await Ticket.create({
    title: 'Concert',
    price: 18
  })

  return ticket
}

it('fetches orders for an particular user ', async () => {


  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = signingTest()
  const userTwo = signingTest()

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderThree } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // console.log(orderOne)

  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderTwo.id)
  expect(response.body[1].id).toEqual(orderThree.id)
  //





})

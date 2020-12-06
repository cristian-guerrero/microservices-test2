import request from 'supertest'
import app from '../../app'
import mongoose from 'mongoose'
import { signingTest } from '../../test/signup'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@microservices-commons/common'
import { natsWrapper } from '../../nats-wrapper'


it('returns an error if the ticket does not exist', async () => {

  const ticketId = mongoose.Types.ObjectId()

  const cookie = signingTest()

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId
    })
    .expect(404)


})


it('returns an error if the ticket is already reserved', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const cookie = signingTest()

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 30
  })

  const order = await Order.create({
    ticket,
    userId: userId,
    status: OrderStatus.Created,
    expirationAt: new Date()
  })

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400)


})


it('reserves a ticket ', async () => {

  const cookie = signingTest()

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 30
  })

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)
})


it('emit an order created event', async () => {

  const cookie = signingTest()

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 30
  })

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})



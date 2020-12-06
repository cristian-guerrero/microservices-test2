import request from 'supertest'
import { Ticket } from '../../models/ticket'
import { signinTest } from '../../../../tickets/src/test/signup'
import app from '../../app'
import { Order } from '../../models/order'
import { OrderStatus } from '@microservices-commons/common'
import { natsWrapper } from '../../nats-wrapper'


it('marks an order as cancelled', async () => {



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


  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it ('emits a order cancelled event', async () => {

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


  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)


  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

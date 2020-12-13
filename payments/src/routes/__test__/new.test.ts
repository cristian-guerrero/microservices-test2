import request from 'supertest'
import { Types } from 'mongoose'
import app from '../../app'
import { signingTest } from '../../../../orders/src/test/signup'
import { Order } from '../../models/order'
import { OrderStatus } from '@microservices-commons/common'

import {stripe} from '../../stripe'

// jest.mock('../../stripe')

it('returns a 404 when purchasing a that does no exists', async () => {

  await request(app)
    .post('/api/payments')
    .set('Cookie', signingTest())
    .send({
      token: 'un_token_fake',
      orderId: Types.ObjectId().toHexString()
    }).expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {

  const order = await Order.create({
    version: 0,
    userId: Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 20
  })


  await request(app)
    .post('/api/payments')
    .set('Cookie', signingTest())
    .send({
      token: 'un_tkn',
      orderId: order.id
    })
    .expect(401)

})

it('returns a 400 when purchasing a cancelled order', async () => {

  const userId = Types.ObjectId().toHexString()

  const cookie = signingTest(userId)

  const order = await Order.create({
    version: 0,
    userId,
    status: OrderStatus.Created,
    price: 20
  })

  await order.set({ status: OrderStatus.Cancelled }).save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'un_tkn',
      orderId: order.id
    })
    .expect(400)

})

it('returns a 204 with valid inputs', async () => {
  const userId = Types.ObjectId().toHexString()

  const cookie = signingTest(userId)

  const order = await Order.create({
    version: 0,
    userId,
    status: OrderStatus.Created,
    price: 20
  })

  // await order.set({ status: OrderStatus.Cancelled }).save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send( {
      token: 'tok_visa',
      orderId: order.id
    }).expect(201)

  /*
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls [0] [0]
  expect(chargeOptions.source).toEqual('tok_visa')
  expect(chargeOptions.amount).toEqual(20 * 100)
  expect(chargeOptions.currency).toEqual('usd')

   */

})

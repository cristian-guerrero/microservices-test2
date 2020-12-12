import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import { ExpirationCompleteEvent, OrderStatus } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'


const setup = async () => {

  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 20
  })
  const order = await Order.create({
    status: OrderStatus.Created,
    expirationAt: new Date(),
    ticket,
    userId: 'dkefhgy4'
  })

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener, ticket, order, data, msg
  }
}

it('updates the order status to cancelled', async () => {

  const {
    listener, ticket, order, data, msg
  } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)


})

it('emit an orderCancelled event', async () => {
  const {
    listener, ticket, order, data, msg
  } = await setup()

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled()

 const eventData = JSON.parse( (natsWrapper.client.publish as jest.Mock).mock.calls[0][1] )

  expect(eventData.id).toEqual(order.id)
})

it('ack the message ', async () => {
  const {
    listener, ticket, order, data, msg
  } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

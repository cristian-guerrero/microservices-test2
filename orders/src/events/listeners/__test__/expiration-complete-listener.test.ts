import { ExpirationCompleteListener } from '../expiration-completelistener'
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

  const data : ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  // @ts-ignore
  const msg : Message = {
    ack: jest.fn()
  }

  return  {
    listener, ticket, order, data, msg
  }
}

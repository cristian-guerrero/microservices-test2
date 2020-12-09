import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/tickets'
import { OrderCreatedEvent, OrderStatus } from '@microservices-commons/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {


  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 99,
    userId: 'useridakskd'
  })


  const data: OrderCreatedEvent['data'] = {

    expiresAt: 'fakevalue',
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price
    },
    userId: 'fakeuserid',
    version: 0
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn
  }

  return {listener, data, ticket, msg}

}


import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../src/nats-wrapper'
import { OrderCreatedEvent, OrderStatus } from '@microservices-commons/common'
import { Types } from "mongoose"
import { Message } from 'node-nats-streaming'


const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)


  const data:  OrderCreatedEvent['data'] = {
    id: Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'str',
    userId: 'string_us',
    status: OrderStatus.Created,
    ticket: {
      id: 'idasdf',
      price:10
    }
  }

  //  @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {data, listener, msg}
}

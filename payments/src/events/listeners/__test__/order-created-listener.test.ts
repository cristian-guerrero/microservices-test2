import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@microservices-commons/common'
import { Types } from 'mongoose'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'


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

it('replicates the order info ', async ( ) => {

  const {data, listener, msg} = await  setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.price).toEqual(data.ticket.price)


})


it('acks the message', async ( ) => {

  const {data, listener, msg} = await  setup()

  await listener.onMessage(data, msg)


  expect(msg.ack).toHaveBeenCalled()


})




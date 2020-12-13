import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledEvent, OrderStatus } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { Order } from '../../../models/order'


const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = await Order.create({
    status: OrderStatus.Created,
    price: 10,
    userId: 'userfakeid',
    version: 0
  })

  // console.log(order.id)
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'idasdf',
    }
  }

  //  @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { data, listener, msg , order}
}

it('updates the status of the order', async () => {
  const { data, listener, msg , order} = await  setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})


it('updates the status of the order', async () => {
  const { data, listener, msg , order} = await  setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

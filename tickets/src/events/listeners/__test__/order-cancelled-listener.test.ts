import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/tickets'
import mongoose from 'mongoose'
import { OrderCancelledEvent } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'


const setup = async () => {

  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = mongoose.Types.ObjectId().toHexString()

  const ticket = await Ticket.create({
    title: 'Concert ',
    price: 20,
    userId: 'useridfake',
    orderId
  })

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  //  @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {
    listener, ticket, data, msg
  }

}

it('updates the ticket , publishes an  event , and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()

  expect(msg.ack).toHaveBeenCalled()

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})

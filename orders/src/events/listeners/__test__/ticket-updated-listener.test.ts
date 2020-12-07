import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@microservices-commons/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticket-updated-listener'

const setup = async () => {

  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = await Ticket.create({
    title: 'Concert',
    price: 20,
  })


  const data: TicketCreatedEvent['data'] = {
    version: ticket.version! + 1,
    id: ticket.id,
    price: 999,
    userId: mongoose.Types.ObjectId().toHexString(),
    title: 'New title'
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()

  }
  return { msg, listener, data, ticket }

}


it('finds, updates, and saves a ticket ', async () => {
  const { msg, listener, data, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)

  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)

})


it('acks the message', async () => {
  const { msg, listener, data, ticket } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})


it('does not call ack if the event has a future version ', async () => {

  const { msg, listener, data, ticket } = await setup()

  data.version = 10

  try {

    await listener.onMessage(data, msg)

  } catch (e) {

  }

  expect(msg.ack).not.toHaveBeenCalled()

})

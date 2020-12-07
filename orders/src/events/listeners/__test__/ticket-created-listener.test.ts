import mongoose from 'mongoose'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@microservices-commons/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'


const setup = async () => {

  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: mongoose.Types.ObjectId().toHexString(),
    price: 10,
    userId: mongoose.Types.ObjectId().toHexString(),
    title: 'Concert...'
  }
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()

  }
  return { msg, listener, data }

}

it('created and saves a tickets', async () => {
  const { data, listener, msg } = await setup()

  await listener.onMessage(data, msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)


})

/*
it('acks the message', async () => {

})

 */

import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', async () => {

  const publisher = new TicketCreatedPublisher(stan)


  try {

    await publisher.publish({
      id: '5fkdi',
      price: 33,
      title: 'new title'

    })

  } catch (err) {

    console.error(err)
  }
  /*
  console.log('Publisher connected to NATS')

  const data = JSON.stringify ({
    id: 'dkei5edf',
    title: 'Concert',
    price: 20
  })


  stan.publish('ticket:created', data ,(err, guid) => {

    console.log('Event published', guid)


  }) 
  */
})
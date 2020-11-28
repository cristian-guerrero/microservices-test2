import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222'
})

stan.on('connect', () => {

  console.log('Publisher connected to NATS')

  const data = JSON.stringify ({
    id: 'dkei5edf',
    title: 'Concert',
    price: 20
  })


  stan.publish('tickets:created', data ,(err, guid) => {

    console.log('Event published', guid)


  }) 
})
import nats, { Message } from 'node-nats-streaming';

import { randomBytes } from 'crypto'

console.clear()

const id = randomBytes(4).toString('hex')

const stan = nats.connect('ticketing', id, {
  url: 'http://localhost:4222'
})


stan.on('connect', () => {

  console.log('listener connected to NATS')

  stan.on('close', ( ) => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const options = stan.subscriptionOptions()
  // manualmente devolver el acuse de recibo
  .setManualAckMode(true)

  /**
   * el primer argumento de la suscription es el canal al que se quiere suscribir
   * el segundo argumento es el queue group para que no se envien los mensajes a todos los 
   * microserivcios distribuidos del mismo tipo y se valancee la carga
   */
  const subscription = stan.subscribe('tickets:created', 'orders-service-queue-group', options)

  subscription.on('message', (msg: Message) => {

    const data = msg.getData()

    if (typeof data === 'string') {

      console.log(`Recived event # ${msg.getSequence()}, with data ${data}`)
    }
    // console.log(msg.getSubject())

    // mandar el acuse de recibo que indique que el mensaje fue recibido y procesado correctamente
    msg.ack()

  })
})

/**
 * interupted signal 
 */
process.on('SIGINT', () => stan.close())
/**
 * terminated signal
 */
process.on('SIGTERM', () => stan.close())
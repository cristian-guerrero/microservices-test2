import nats, { Message, Stan } from 'node-nats-streaming';

import { randomBytes } from 'crypto'


console.clear()

const id = randomBytes(4).toString('hex')

const stan = nats.connect('ticketing', id, {
  url: 'http://localhost:4222'
})


stan.on('connect', () => {

  console.log('listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  new TicketCreatedListener(stan).listen()
})


/*
stan.on('connect', () => {

  console.log('listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const options = stan.subscriptionOptions()
    // manualmente devolver el acuse de recibo
    .setManualAckMode(true)
    // vuelve y envía todos los mensajes que se hayan enviado ya
    .setDeliverAllAvailable()
    // (durable suscriptions)
    // crea una lista donde se guardaran los mensajes que no tengan acuse de recibo para volverlos a enviar cuando 
    // el servicio listener se vuelva a iniciar o se inice una nueva instancia
    // SetDurableName solo funciona si se tiene un queue group (durable suscriptions)
    .setDurableName('accounting-service')


  //* el primer argumento de la suscription es el canal al que se quiere suscribir
  //* el segundo argumento es el queue group para que no se envien los mensajes a todos los 
  //* microserivcios distribuidos del mismo tipo y se valancee la carga
  const subscription = stan.subscribe('ticket:created', 'orders-service-queue-group', options)

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
*/

/**
 * interupted signal 
 */
process.on('SIGINT', () => stan.close())
/**
 * terminated signal
 */
process.on('SIGTERM', () => stan.close())




abstract class Listener {

  abstract subject: string
  abstract queueGrouName: string

  abstract onMessage(parsedData: string, msg: Message): void

  private client: Stan
  private ackWait = 5 * 1000


  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client.subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGrouName)
  }

  listen() {
    const suscription = this.client.subscribe(
      this.subject,
      this.queueGrouName,
      this.subscriptionOptions()
    )

    suscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGrouName}`)

      const parsedData = this.parseMessage(msg)

      this.onMessage(parsedData, msg)
    })
  }


  parseMessage(msg: Message) {

    const data = msg.getData()

    return typeof data === 'string' ?
      JSON.parse(data.toString()) :
      JSON.parse(data.toString('utf8'))
  }

}


class TicketCreatedListener extends Listener {

  subject = 'ticket:created'
  queueGrouName = 'payments-service'

  onMessage(parsedData: string, msg: Message): void {

    console.log('Event data!', parsedData)

    msg.ack()
  }

}
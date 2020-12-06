import { Message, Stan } from "node-nats-streaming"
import { Subjects } from './subjects';


interface Event {
  subject: Subjects
  data: any
}


abstract class Listener<T extends Event> {

  abstract subject: T['subject']
  abstract queueGroupName: string

  abstract onMessage (parsedData: T['data'], msg: Message): void

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
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const suscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    suscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)

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

export { Listener }

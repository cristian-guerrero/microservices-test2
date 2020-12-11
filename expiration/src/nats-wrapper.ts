import nats,  { Stan } from 'node-nats-streaming'

class NatsWrapper {

  private _client?: Stan

  get client(): Stan {
    if (!this._client) throw new Error('Cannot acces NATS client before connecting')
    return this._client
  }

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    
    this._client = nats.connect(clusterId, clientId, { url })
    return new Promise((resolve, reject) => {

      this.client.on('connect', () => {
        resolve()
        console.log('Connected to NATS in: ' + url)
      })

      this.client.on('error', err => {
        reject(err)
      })

    })
  }
}


export const natsWrapper = new NatsWrapper()


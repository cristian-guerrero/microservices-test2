import Queue from 'bull'


interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST_EXPIRATION
  }
})


expirationQueue.process(async (job) => {

  console.log('publish an expiration:complete event for orderId', job.data.orderId)
})

export { expirationQueue }

import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { NotFoundError, errorHandler, currentUser } from '@microservices-commons/common'
import { indexOrderRouter } from './routes'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { deleteOrderRouter } from './routes/delete'

const app = express()
// because express is behind  proxy 
app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'

}))

app.use(currentUser)


app.use((req, res, next) => {
  next()
  console.log('request to: ', req.url)

})

// add routes
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandler)

export default app

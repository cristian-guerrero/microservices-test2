import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'



import { NotFoundError, errorHandler, currentUser } from '@microservices-commons/common'
import { createTicketsRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'



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
app.use(createTicketsRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)


app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandler)

export default app
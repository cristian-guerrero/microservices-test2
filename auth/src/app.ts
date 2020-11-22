import express from 'express'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter, signInRoute, signOutRoute, signUpRoute } from './routes'
import { NotFoundError, errorHandler } from '@microservices-commons/common'


const app = express()
// because express is behind  proxy 
app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'

}))

app.use((req, res, next) => {
  next()
  console.log('request to: ', req.url)

})

// add routes
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signOutRoute)
app.use(signUpRoute)

app.all('*', async (req, res, next) => {
  next(new NotFoundError())
})

app.use(errorHandler)

export default app
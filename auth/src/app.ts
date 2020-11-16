import express from 'express'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter, signInRoute, signOutRoute, signUpRoute } from './routes'
import { NotFoundError } from './errors/not-found.error';
import { errorHandler } from './middlewares/error-handler'


const app = express()
// because express is behind  proxy 
app.set('trust proxy', true)

app.use(json())

app.use(cookieSession({
  signed: false,
  secure: true,

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
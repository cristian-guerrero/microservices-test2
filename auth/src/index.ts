import express from 'express'
import { json } from 'body-parser'

import { currentUserRouter, signInRoute, signOutRoute, signUpRoute } from './routes'

const app = express()

app.use(json())

// add routes
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signOutRoute)
app.use(signUpRoute)


app.listen(3000, () => {

    console.log('Auth server listening on localhost:3000')
})
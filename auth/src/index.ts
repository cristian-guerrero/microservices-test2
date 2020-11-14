import express from 'express'
import { json } from 'body-parser'

import { currentUserRouter, signInRoute, signOutRoute, signUpRoute } from './routes'
import{ errorHandler} from './middlewares/error-handler'


const app = express()

app.use(json())

app.use((req, res, next) => {
    next()
    console.log('request to: ',req.url)
    
})

// add routes
app.use(currentUserRouter)
app.use(signInRoute)
app.use(signOutRoute)
app.use(signUpRoute)


app.use(errorHandler)
app.listen(3000, () => {

    console.log('Auth server listening on localhost:3000') 
})
import request from 'supertest';
import app from '../app'

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';


const signinTest =  () => {


  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = {jwt: token}

  const sessionJSON = JSON.stringify(session)
  
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`]

}


export { signinTest }
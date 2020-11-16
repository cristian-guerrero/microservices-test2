import { Router } from 'express';

import jwt from 'jsonwebtoken'

const router = Router()

const JWT_KEY = process.env.JWT_KEY!

router.get('/api/users/currentuser', (req, res) => {


  if (!req.session?.jwt) {
    return res.send({ currentUser: null })
  }

  try{
    
    const payload = jwt.verify(req.session.jwt, JWT_KEY)


    res.send({currentUser: payload})

    
  }catch(err) {
    return res.send({ currentUser: null })
  }

})

export { router as currentUserRouter } 
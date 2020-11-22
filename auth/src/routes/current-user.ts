import { Router } from 'express';


import { currentUser } from '@microservices-commons/common';


const router = Router()

const JWT_KEY = process.env.JWT_KEY!

/**
 * 
 */
router.get('/api/users/currentuser',
  currentUser, (req, res) => {

    return res.send({ currentUser: req.currentUser || null })


  })

export { router as currentUserRouter }


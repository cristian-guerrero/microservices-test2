import { Router } from 'express';

import jwt from 'jsonwebtoken'
import { currentUser } from '../middlewares/current-user.middleware';
import { requireAuth } from '../middlewares/require-auth.middleware';

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


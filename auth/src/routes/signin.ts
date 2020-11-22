import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { BAdRequestError, validateRequest } from '@microservices-commons/common';
import { User } from '../models/user.mode';
import { PasswordService } from '../services/password.service';
import jwt from 'jsonwebtoken'

const router = Router()

const JWT_KEY = process.env.JWT_KEY!

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email mus be valid.'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body


    const user = await User.findOne({ email })

    if (!user) {

     return  next (new BAdRequestError('Invalid credentials.'))
    }

    const passwordMatch = await PasswordService.compare(user!.password, password)
    
    if (!passwordMatch) {
      return next (new BAdRequestError('Invalid credentials'))
    }

        // generate JWT
        const userJwt = jwt.sign({
          id: user!.id,
          email: user!.email
      }, JWT_KEY)
      // store it on session object
      req.session = {
          jwt: userJwt
      }
  
      res.status(200).send(user)

  })



export { router as signInRoute }
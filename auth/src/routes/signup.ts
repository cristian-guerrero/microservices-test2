import { Router, Request, Response, NextFunction, json } from 'express';
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest, BAdRequestError } from '@microservices-commons/common'

import { User } from '../models/user.mode'

const router = Router()

const JWT_KEY = process.env.JWT_KEY!

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], validateRequest,
async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return next(new BAdRequestError('Email in use'))
    }

    const user = await User.create({ email, password })



    // generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, JWT_KEY)
    // store it on session object
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)

})

export { router as signUpRoute }

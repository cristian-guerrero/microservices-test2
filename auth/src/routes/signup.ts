import { Router, Request, Response, NextFunction, json } from 'express';
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

import { RequestValidationError, BAdRequestError } from '../errors'
import { User } from '../models/user.mode'

const router = Router()


router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid..'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password mus be between 4 and 20 characters')
], async (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)

    const { email, password } = req.body

    if (!errors.isEmpty()) {
        return next(new RequestValidationError(errors.array()))
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return next(new BAdRequestError('Email in use'))
    }

    const user = User.build({ email, password })

    await user.save()

    // generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, '---private key--')
    // store it on session object
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)

})

export { router as signUpRoute }
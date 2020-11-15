import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator'

import { DatabaseConnectionError, RequestValidationError } from '../errors'

const router = Router()


router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid..'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password mus be between 4 and 20 characters')
], async (req: Request, res: Response, next : NextFunction) => {

    const errors = validationResult(req)

    const { email, password } = req.body


    if (!errors.isEmpty()) {
        next (new RequestValidationError(errors.array()))
    }
    
    next( new DatabaseConnectionError())
    //res.send('User created')

})

export { router as signUpRoute }
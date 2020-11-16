import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors';
import { validateRequest } from '../middlewares/validate-request.middleware';


const router = Router()


router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email mus be valid.'),
    body('password').trim().notEmpty().withMessage('You must supply a password')
], validateRequest,
   async (req: Request, res: Response, next: NextFunction) => {

        
        res.send('Response')
    })

export { router as signInRoute }

import { body, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express'
import { RequestValidationError } from '../errors/request-validaton.error';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req)
    // create new code


    if (!errors.isEmpty()) {
        return next(new RequestValidationError(errors.array()))
    }

    next()

}


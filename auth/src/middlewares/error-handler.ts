import { Request, Response, NextFunction } from 'express'
import { DatabaseConnectionError, RequestValidationError } from '../errors'


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {



    if (err instanceof RequestValidationError) {
        console.log('Handling RequestValidationError')

        return res.status(err.statusCode).send({ errors: err.serializeErrors() })

    } else if (err instanceof DatabaseConnectionError) {
        console.log('Handling DatabaseConnectionError ')

        return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    }


    res.status(400).send({ message: 'Somenthing went wrong' })
}
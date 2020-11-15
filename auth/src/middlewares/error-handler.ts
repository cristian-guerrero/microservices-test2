import { Request, Response, NextFunction } from 'express'
import { DatabaseConnectionError, RequestValidationError } from '../errors'


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {



    if(err instanceof RequestValidationError) {
        console.log('Handling RequestValidationError')
    } else if (err instanceof DatabaseConnectionError) {
        console.log('Handling DatabaseConnectionError ')
    }

    res.status(400).send({message: err.message || 'Somenthing went wrong'})
}
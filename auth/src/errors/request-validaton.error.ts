import { ValidationError } from 'express-validator'
import { CustomError } from './custom.error';



export class RequestValidationError extends CustomError  {

    errors: ValidationError[]
    statusCode = 400

    constructor(errors: ValidationError[]) {
        super('Invalid request parameters')

        this.errors = errors

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(x => {
            return { message: x.msg  , field: x.param }
        })
    }

}
import { ValidationError } from 'express-validator'


export class RequestValidationError extends Error {

    errors: ValidationError[]
    statusCode = 400

    constructor( errors: ValidationError[]) {
        super()

        this.errors = errors

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return  this.errors.map( x => {
            return { nessage: x.msg, field: x.param}
        })
    }

}
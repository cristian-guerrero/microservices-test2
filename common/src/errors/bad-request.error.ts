import {CustomError} from './custom.error'


export class BAdRequestError extends CustomError  {


    statusCode = 400
    message = ''

    constructor(message: string) {
        super('Invalid request ')

        this.message = message

        // because we are exteded from build in javascript class
        Object.setPrototypeOf(this, BAdRequestError.prototype)
    }

    serializeErrors() {
        return [{message: this.message}]
    }

}
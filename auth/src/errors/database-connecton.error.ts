

export class DatabaseConnectionError extends Error {

    reason = 'Error connectiong to database'
    statusCode = 500


    constructor() {

        super()
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            {
                message: this.reason
            }
        ]
    }
}
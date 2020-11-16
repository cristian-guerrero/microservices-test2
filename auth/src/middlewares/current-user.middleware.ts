

import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

const JWT_KEY = process.env.JWT_KEY!


interface UserPayload {
	id: string
	email: string
}

/**
 * add aditional property glabally
 */
declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload
		}
	}
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {

	if (!req.session?.jwt) {
		return next()
	}

	try {

		const payload = jwt.verify(req.session.jwt, JWT_KEY) as UserPayload
		//res.send({currentUser: payload})

		req.currentUser = payload


	} catch (err) { }
	finally {
		next()
	}


}
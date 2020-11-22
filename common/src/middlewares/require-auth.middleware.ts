import { NextFunction, Request, Response } from 'express';
import { NotAuthorizeError } from '../errors/not-authorized.error';



export const requireAuth = (req: Request, res: Response, next: NextFunction) => {


  if(!req.currentUser) {

    return next(new NotAuthorizeError())

  }

  next()
}
import { NextFunction, Request, Response, Router } from 'express'
import { NotFoundError, requireAuth, validateRequest } from '@microservices-commons/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'


const router = Router()


router.post('/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty()
      .custom(input => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {


    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)

    if(!ticket) {
      return next(new NotFoundError())
    }

    res.send({})
  })


export { router as newOrderRouter }
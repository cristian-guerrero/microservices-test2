import { NextFunction, Request, Response, Router } from 'express'
import {
  BAdRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@microservices-commons/common'

import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { isReserve } from '../service'


const router = Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

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
    if (!ticket) {
      return next(new NotFoundError())
    }

    if (await isReserve(ticket)) {
      return next(new BAdRequestError('Ticket is already reserved'))
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)


    const order = Order.create({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expirationAt: expiration,
      ticket
    })

    res.status(201).send(order)
  })


export { router as newOrderRouter }
import { Request, Response, Router } from 'express'
import { requireAuth, validateRequest } from '@microservices-commons/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'


const router = Router()


router.post('/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty()
      .custom(input => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {


    res.send({})
  })


export { router as newOrderRouter }
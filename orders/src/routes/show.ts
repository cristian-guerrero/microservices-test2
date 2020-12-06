import { NextFunction, Request, Response, Router } from 'express'
import { NotAuthorizeError, NotFoundError, requireAuth } from '@microservices-commons/common'
import { Order } from '../models/order'

const router = Router()

router.get('/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {

    const order = await Order.findById(req.params.orderId)
      .populate('ticket')


    if (!order) {
      return next(new NotFoundError())
    }

    if(order!.userId !== req.currentUser!.id) {

     return  next(new NotAuthorizeError())
    }

    res.send(order)
  })


export { router as showOrderRouter }
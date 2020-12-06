import { NextFunction, Request, Response, Router } from 'express'
import { Order } from '../models/order'
import { NotAuthorizeError, NotFoundError, OrderStatus } from '@microservices-commons/common'

const router = Router()

router.delete('/api/orders',
  async (req: Request, res: Response, next: NextFunction) => {


    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order) return next(new NotFoundError())

    if (order.userId !== req.currentUser!.id) return next(new NotAuthorizeError())

    order.status = OrderStatus.Cancelled

    await order.save()

    res.status(204).send(order)
  })


export { router as deleteOrderRouter }
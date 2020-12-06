import { NextFunction, Request, Response, Router } from 'express'
import { Order } from '../models/order'
import { NotAuthorizeError, NotFoundError, OrderStatus } from '@microservices-commons/common'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = Router()

router.delete('/api/orders/:orderId',
  async (req: Request, res: Response, next: NextFunction) => {


    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) return next(new NotFoundError())

    if (order.userId !== req.currentUser!.id) return next(new NotAuthorizeError())

    order.status = OrderStatus.Cancelled

    await order.save()


    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    })

    res.status(204).send(order)
  })


export { router as deleteOrderRouter }

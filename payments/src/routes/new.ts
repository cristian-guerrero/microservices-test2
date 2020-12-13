import { NextFunction, Request, Response, Router } from 'express'
import {
  BAdRequestError,
  NotAuthorizeError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@microservices-commons/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { stripe } from '../stripe'


const router = Router()

router.post('/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {

    const { token, orderId } = req.body


    const order = await Order.findById(orderId)

    if (!order) {
      return next(new NotFoundError())
    }

    if (order!.userId !== req.currentUser!.id) {
      return next(new NotAuthorizeError())
    }

    if(order.status === OrderStatus.Cancelled) {
      return next(new BAdRequestError('Canont pay for an cancelled order'))
    }

    console.log(`Stripe key: ${process.env.STRIPE_KEY!}`)

    await stripe.charges.create( {
      currency: 'usd',
      amount: order.price * 100,
      source: token
    })


    res.status(201).send({ success: true })

  })


export { router as createChargeRouter }

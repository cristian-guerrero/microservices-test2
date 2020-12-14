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
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'


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

    if (order.status === OrderStatus.Cancelled) {
      return next(new BAdRequestError('Cannot pay for an cancelled order'))
    }

    console.log(`Stripe key: ${ process.env.STRIPE_KEY! }`)

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token
    })

    const payment = await Payment.create({
      orderId,
      stripeId: charge.id
    })


    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id!,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })


    res.status(201).send({ id: payment.id })

  })


export { router as createChargeRouter }

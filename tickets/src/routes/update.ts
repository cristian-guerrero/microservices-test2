import { Router, Request, Response, NextFunction } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizeError,
  validateRequest,
  BAdRequestError
} from '@microservices-commons/common'
import { Ticket } from '../models/tickets';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-update-publisher';

const router = Router()

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be provided and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {

    const ticket = await Ticket.findOne({
      _id:req.params.id
    })

    if (!ticket) {
     return  next(new NotFoundError())
    }

    // return error if the ticket is in some state
    // when the order  is cancelled, orderId is equal to undefined
    if(ticket.orderId) {
      return next(new BAdRequestError('Cannot  edit a reserved ticket '))
    }

    // @ts-ignore
    if(ticket?.userId !== req.currentUser!.id) {

      return next(new NotAuthorizeError())

    }


    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    await ticket.save()


  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id!,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version!
  })

    res.send(ticket)
  })


export { router as updateTicketRouter }

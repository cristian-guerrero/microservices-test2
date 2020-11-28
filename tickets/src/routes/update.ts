import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, NotFoundError, NotAuthorizeError } from '@microservices-commons/common';
import { Ticket } from '../models/tickets';
import { validateRequest } from '@microservices-commons/common/build';
import { body } from 'express-validator';

const router = Router()

router.put('/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be provided and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
     return  next(new NotFoundError())
    }

    if(ticket?.userId !== req.currentUser!.id) {

      return next(new NotAuthorizeError())

    }


    ticket.set({
      title: req.body.title,
      price: req.body.price
    })

    await ticket.save()


    res.send(ticket)
  })


export { router as updateTicketRouter }
import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth, NotFoundError } from '@microservices-commons/common';
import { Ticket } from '../models/tickets';

const router = Router()

router.put('/api/tickets/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      next(new NotFoundError())
    }

    res.send(ticket)
  })


export { router as updateTicketRouter }
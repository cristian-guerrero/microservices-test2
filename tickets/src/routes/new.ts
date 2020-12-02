import { requireAuth, validateRequest } from '@microservices-commons/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';
import { TicketcreatedPublisher } from '../events/publishers/ticket-create-publisher';
import { natsWrapper } from '../nats-wrapper';



const router = Router()


router.post('/api/tickets', 
requireAuth,
[
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').not().isEmpty().withMessage('Price is required'),
  body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),

],
validateRequest,
async (req:Request, res: Response) => {

  const {title, price} = req.body 

  // @ts-ignore
  const newTicket = await  Ticket.create({
    title, 
    price,
    userId: req.currentUser!.id

  })

   // await newTicket.save()

   
  new TicketcreatedPublisher(natsWrapper.client).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    userId: newTicket.userId
  })


  res.status(201).send(newTicket)
})

export {router as createTicketsRouter}
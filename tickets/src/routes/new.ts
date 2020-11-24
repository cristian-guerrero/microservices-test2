import { requireAuth, validateRequest } from '@microservices-commons/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/tickets';



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

  const newTicket = Ticket.build({
    title, 
    price,
    userId: req.currentUser!.id

  })

  const response = await newTicket.save()


  res.status(201).send(response)
})

export {router as createTicketsRouter}
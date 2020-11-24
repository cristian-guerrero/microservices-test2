import { requireAuth } from '@microservices-commons/common';
import { Request, Response, Router, response } from 'express';


const router = Router()


router.post('/api/tickets', 
requireAuth,
(req:Request, res: Response) => {


  res.sendStatus(200)
})

export {router as createTicketsRouter}
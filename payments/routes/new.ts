import { NextFunction, Request, Response, Router } from 'express'
import { requireAuth } from '@microservices-commons/common'
import { body } from 'express-validator'


const router = Router()

router.post('/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
  ],
  async (req: Request, res: Response, next: NextFunction) => {


    res.send({ success: true })

  })

export {router as createChargeRouter}

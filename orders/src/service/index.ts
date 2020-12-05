import { Order } from '../models/order'
import { OrderStatus } from '@microservices-commons/common'
import { TicketDoc } from '../models/ticket'


export async function  isReserve(ticket: TicketDoc): Promise<boolean> {
 const order = await Order.findOne({
    ticket,
    status: {
      $in: [ OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete ]
    }
  })
  
  return !!order 
  
}
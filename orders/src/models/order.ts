import  { model, Schema, Document } from 'mongoose'
import  {OrderStatus } from '@microservices-commons/common'
import { TicketDoc } from './ticket'



interface OrderDoc extends Document {

  userId: string
  status: OrderStatus
  expirationAt: Date
  ticket: TicketDoc
}

const orderSchema = new Schema({
    userId: {
      type: String,
      // require: true
    },
    status: {
      type: String,
      // require: true
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  })


const Order = model<OrderDoc>('Order', orderSchema)

export { Order }

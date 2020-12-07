import { model, Schema, Document } from 'mongoose'
import { OrderStatus } from '@microservices-commons/common'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


interface OrderDoc extends Document {

  userId: string
  status: OrderStatus
  expirationAt: Date
  ticket: TicketDoc
  version?: number
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)


const Order = model<OrderDoc>('Order', orderSchema)

export { Order }

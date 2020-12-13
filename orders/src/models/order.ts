import { model, Schema, Document, Model } from 'mongoose'
import { OrderStatus } from '@microservices-commons/common'
import { Ticket, TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


interface EventAttr {
  id: string
  version : number
}

interface OrderModel extends Model<OrderDoc> {
  findByEvent(event: EventAttr): Promise<OrderDoc | null >
}



interface OrderDoc extends Document {

  userId: string
  status: OrderStatus
  expirationAt: Date
  ticket: TicketDoc
  version?: number
}

interface OrderModel extends Model<OrderDoc> {
  findByEvent(event: EventAttr): Promise<OrderDoc | null >
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



orderSchema.statics.findByEvent = async (event: EventAttr) => {
  return Order.findOne({
    _id: event.id,
    version: event.version -1
  })
}


const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }

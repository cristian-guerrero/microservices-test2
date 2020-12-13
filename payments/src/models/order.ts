import { model, Schema, Document, Model } from 'mongoose'
import { OrderStatus } from '@microservices-commons/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface EventAttr {
  id: string
  version : number
}

interface OrderModel extends Model<OrderDoc> {
  findByEvent(event: EventAttr): Promise<OrderDoc | null >
}

interface OrderDoc extends Document {

  id: string
  userId: string
  version: number
  price: number
  status: OrderStatus

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
    price: {
      type: Number,
    },
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

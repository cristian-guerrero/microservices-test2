import { model, Schema, Document } from 'mongoose'
import { OrderStatus } from '@microservices-commons/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


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


const Order = model<OrderDoc>('Order', orderSchema)

export { Order }

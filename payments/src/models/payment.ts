import { Document, model, Model, Schema } from 'mongoose'


interface PaymentDoc extends Document {
  orderId: string
  stripeId: string
}

interface PaymentModel extends Model<PaymentDoc> {
}


const paymentSchema = new Schema({
    orderId: {
      type: String
    },
    stripeId: {
      type: String
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


const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }

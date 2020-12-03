import { Document, model, Schema } from 'mongoose'

interface TicketDoc extends Document {

  title: string
  price: number
}

const schema = new Schema({
  title: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id

    }
  }
})

const Ticket = model<TicketDoc>('Ticket', schema)



export { TicketDoc, Ticket }
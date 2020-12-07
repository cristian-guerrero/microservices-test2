import { Document, model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketDoc extends Document {
  title: string
  price: number
  version?: number
}

const ticketSchema = new Schema({
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


ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

const Ticket = model<TicketDoc>('Ticket', ticketSchema)



export { TicketDoc, Ticket }

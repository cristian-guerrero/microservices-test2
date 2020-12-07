import { Document, Model, model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketDoc extends Document {
  title: string
  price: number
  version?: number
}

interface EventAttr {
  id: string
  version : number
}

interface TicketModel extends Model<TicketDoc> {
  findByEvent(event: EventAttr): Promise<TicketDoc | null >
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



ticketSchema.statics.findByEvent = async (event: EventAttr) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version -1
  })
}


const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)



export { TicketDoc, Ticket }

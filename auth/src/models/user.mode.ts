import {Schema, Model, Document, model} from 'mongoose'

import {PasswordService} from '../services/password.service'

/**
 * describe the properties that are required to create new user
 */
interface UserAttrsInterface {
  email: string
  password: string
}

/**
 * An interface that describes the properties that User Model has
 */
/*
interface UserModelInterface extends Model<UserDocInterface> {

  build(attrs: UserAttrsInterface): UserDocInterface

}

 */

/**
 * An interface that describes the properties that a User Docuement has
 */
interface UserDocInterface extends Document {
  email: string
  password: string
  updatedAt?: string
  createdAt?: string

}


/**
 *
 */
const userSchema = new Schema({
    email: {
      type: String,
      // require: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {

      transform: function (doc, ret) {
        delete ret.password
        delete ret.__v
        ret.id = ret._id
        delete ret._id

      }
    }
  })

/**
 *
 */
userSchema.pre('save', async function (done) {


  if (this.isModified('password')) {
    const hashed = await PasswordService.toHash(this.get('password'))
    this.set('password', hashed)
    // this.password = hashed
  }
  done(undefined)
})


/**
 *
 * @param attrs add new function at the schema
 */
/*
userSchema.statics.build = (attrs: UserAttrsInterface) => {

return new User(attrs)
}
*/
/**
 * let typescript to know what we added to statics
 */
const User = model<UserDocInterface>('User', userSchema)


export {User}
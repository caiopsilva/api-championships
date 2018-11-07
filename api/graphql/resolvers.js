import User from '../../db/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

const UserSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export default {
  async createUser ({ input }, req) {
    console.log(req)
    const validate = Joi.validate(input, UserSchema)
    if (validate.error) {
      const error = new Error('Invalid Input')
      error.status = 400
      error.data = validate.error
      throw error
    }

    const hashPassword = await bcrypt.hash(input.password, 10)

    const user = await new User({
      name: input.name,
      email: input.email,
      password: hashPassword,
      rating: input.rating
    }).save()

    return user.toJSON()
  },

  async login ({ input }, req, a) {
    const user = await new User({ email: input.email }).fetch()
    if (!user) {
      const error = new Error('User not found')
      error.status = 401
      throw error
    }
    const valid = await bcrypt.compare(input.password, user.attributes.password)
    if (!valid) {
      const error = new Error('Password is invalid')
      error.status = 401
      throw error
    }

    const token = jwt.sign({ id: user.id }, 'RJ*ijSFAFJSjs%iadHISFSHI&jcashdIFJAIS$')

    return {
      token,
      user: user.toJSON()
    }
  }
}

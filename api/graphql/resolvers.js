import User from '../../db/models/User'
import bcrypt from 'bcrypt'

export default {
  async createUser ({ input }, req) {
    const hashPassword = bcrypt.hash(input.password, 10)

    const user = await new User({
      name: input.name,
      email: input.email,
      password: hashPassword,
      rating: input.rating
    }).save()

    return user.toJSON()
  }
}

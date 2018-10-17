import User from '../../db/models/User'
import { NotFound, BadRequest } from '../utils/errors'

export default class Controller {
  async get (ctx) {
    const user = await new User({ id: ctx.state.user.sub.id })
      .fetch()
      .catch(err => new BadRequest(err.toString()))

    const res = user || new NotFound()

    ctx.send(res.statusCode || 200, res)
  }
}

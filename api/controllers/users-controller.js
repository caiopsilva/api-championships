import User from '../../db/models/User'
import bcrypt from 'bcrypt'
import hashPassword from '../utils/hash-password'
import {
  BadRequest,
  Deleted,
  NotFound,
  Unauthorized,
  InternalServerError
} from '../utils/errors'
import generateJWT from '../utils/jwt-generate'

export default class Controller {
  async get (ctx) {
    const users = await new User()
      .query(function (qb) {
        if (ctx.query.ranking) {
          qb.orderBy('rating', 'DESC')
        }
      })
      .fetchAll()
      .catch(err => new InternalServerError(err.toString()))

    ctx.send(users.statusCode || 200, users)
  }

  async create (ctx) {
    const { body } = ctx.request
    body.password = await hashPassword(body.password)

    let user = await new User({
      name: body.name,
      email: body.email,
      password: body.password,
      rating: body.rating || 1500
    })
      .save()
      .catch(err => new BadRequest(err.toString()))

    if (user.attributes) {
      user = await User.forge({ id: user.attributes.id })
        .fetch()
        .catch(err => new BadRequest(err.toString()))
    }

    ctx.send(user.statusCode || 200, user)
  }

  async getOne (ctx) {
    const user = await User.forge({ id: ctx.params.id })
      .fetch()
      .catch(err => new BadRequest(err.toString()))

    const res = user || new NotFound()

    ctx.send(res.statusCode || 200, res)
  }

  async delete (ctx) {
    const user = await User.forge({ id: ctx.params.id })
      .destroy()
      .catch(err => new BadRequest(err.toString()))

    ctx.send(user.statusCode || 200, user.attributes ? new Deleted() : user)
  }

  async update (ctx) {
    const { body } = ctx.request

    if (body.password) {
      body.password = await hashPassword(body.password)
    }

    let user = await new User({ id: ctx.params.id })
      .fetch()
      .catch(err => new BadRequest(err.toString()))

    if (user) {
      await user
        .save({
          name: body.name,
          email: body.email,
          password: body.password,
          rating: body.rating
        })
        .catch(err => new BadRequest(err.toString()))
    }

    const res = user || new NotFound()

    ctx.send(res.statusCode || 200, res)
  }

  async login (ctx) {
    let { body } = ctx.request
    try {
      let user = await new User()
        .where('email', body.email)
        .fetch()
        .catch(() => new Unauthorized())
      if (user) {
        const isValid = await bcrypt.compare(
          body.password,
          user.attributes.password
        )

        if (isValid) {
          user.attributes = generateJWT(user.attributes)
          ctx.body = user
        } else {
          ctx.send(401, new Unauthorized('Unauthorized, password is invalid'))
        }
      } else {
        ctx.send(401, new Unauthorized('Unauthorized, User not found'))
      }
    } catch (err) {
      ctx.throw(400, err.message)
    }
  }

  async getByUser (ctx) {
    let entity
    if (ctx.params.entity === 'championships') {
      entity = 'Championship'
    }
    if (ctx.params.entity === 'matches') {
      entity = 'Match'
    }

    const Module = require(`../../db/models/${entity}`).default
    const module = await new Module({ user_id: ctx.params.id })
      .fetchAll()
      .catch(err => new BadRequest(err.toString()))
    ctx.send(module.statusCode || 200, module)
  }
}

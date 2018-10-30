import Championship from '../../db/models/Championship'
import {
  BadRequest,
  Deleted,
  InternalServerError,
  NotFound
} from '../utils/errors'
import Match from '../../db/models/Match'

export default class Controller {
  async get (ctx) {
    const championship = await new Championship()
      .fetchAll({ withRelated: ['users'] })
      .catch(err => new InternalServerError(err.toString()))

    ctx.send(championship.statusCode || 200, championship)
  }

  async getMatches (ctx) {
    const matches = await new Match()
      .where('championship_id', ctx.params.id)
      .fetchPage({
        page: Number(ctx.query.page || 1),
        pageSize: Number(ctx.query.page || 9),
        withRelated: ['users']
      })
      .catch(err => new InternalServerError(err.toString()))

    const res = {
      data: matches.toJSON({ omitPivot: true }),
      ...matches.pagination
    }

    ctx.send(matches.statusCode || 200, res)
  }

  async create (ctx) {
    const { body } = ctx.request

    let championship = await new Championship({
      name: body.name
    })
      .save()
      .catch(err => new BadRequest(err.toString()))

    if (championship.attributes) {
      championship = await Championship.forge({
        id: championship.attributes.id
      })
        .fetch({ withRelated: ['users'] })
        .catch(err => new InternalServerError(err.toString()))
    }

    ctx.send(championship.statusCode || 200, championship)
  }

  async update (ctx) {
    const { body } = ctx.request

    let championship = await new Championship({ id: ctx.params.id })
      .fetch({ withRelated: ['users'] })
      .catch(err => new BadRequest(err.toString()))

    if (body.users) {
      await championship.related('users').detach()
      await championship.related('users').attach(body.users)
      let matches = await new Match()
        .where({
          championship_id: championship.attributes.id
        })
        .fetchAll()
        .catch(err => new InternalServerError(err.toString()))

      await Promise.all(
        matches.map(async match => {
          await match.related('users').detach()
          await match.destroy().catch(err => new BadRequest(err.toString()))
        })
      )

      for (let i = 0; i < body.users.length; i++) {
        for (let j = i + 1; j < body.users.length; j++) {
          let match = await new Match({
            championship_id: ctx.params.id
          })
            .save()
            .catch(err => new BadRequest(err.toString()))
          await match.related('users').attach([body.users[i], body.users[j]])
        }
      }
    }

    await championship
      .save({ name: body.name })
      .catch(err => new BadRequest(err.toString()))

    ctx.send(championship.statusCode || 200, championship)
  }

  async delete (ctx) {
    const championship = await new Championship({ id: ctx.params.id })
      .fetch()
      .catch(err => new BadRequest(err.toString()))

    await championship.related('users').detach()

    await championship
      .destroy()
      .catch(err => new InternalServerError(err.toString()))

    ctx.send(
      championship.statusCode || 200,
      championship.attributes ? new Deleted() : championship
    )
  }

  async patch (ctx) {
    const { body } = ctx.request

    const championship = await new Championship({ id: ctx.params.id })
      .fetch({ withRelated: ['users'] })
      .catch(err => new BadRequest(err.toString()))

    if (championship) {
      const users = championship.toJSON().users
      if (!users.some(user => user.id === body.user)) {
        await Promise.all(
          users.map(async user => {
            let match = await new Match({
              championship_id: ctx.params.id
            })
              .save()
              .catch(err => new BadRequest(err.toString()))
            await match.related('users').attach([user.id, body.user])
          })
        )

        await championship.related('users').attach(body.user)

        ctx.send(championship.statusCode || 200, championship)
      } else {
        const res = {
          msg: 'Usuario já cadastrado no campeonato',
          data: championship
        }
        ctx.send(championship.statusCode || 200, res)
      }
    } else {
      const res = new NotFound()
      ctx.send(res.statusCode, res)
    }
  }
}

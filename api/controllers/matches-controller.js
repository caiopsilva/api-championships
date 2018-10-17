import Match from '../../db/models/Match'
import User from '../../db/models/User'
import { BadRequest, Deleted, InternalServerError } from '../utils/errors'

export default class Controller {
  async get (ctx) {
    const matches = await new Match()
      .fetchAll({ withRelated: ['users'] })
      .catch(err => new InternalServerError(err.toString()))

    ctx.send(matches.statusCode || 200, matches)
  }

  async create (ctx) {
    const { body } = ctx.request
    let match = await new Match({
      championship_id: body.championship_id
    })
      .save()
      .catch(err => new BadRequest(err.toString()))

    if (body.users) {
      await match.related('users').attach(body.users)
      match = await Match.forge({ id: match.attributes.id })
        .fetch({
          withRelated: ['users']
        })
        .catch(err => new InternalServerError(err.toString()))
    }

    ctx.send(match.statusCode || 200, match)
  }
  async update (ctx) {
    const { body } = ctx.request

    let matchCollection = await new Match({ id: ctx.params.id })
      .fetch({ withRelated: ['users'] })
      .catch(err => new BadRequest(err.toString()))

    let match = matchCollection.toJSON()

    if (match.finished) {
      const res = {
        msg: 'Partida já Finalizada',
        data: match
      }
      ctx.send(match.statusCode || 200, res)
    } else {
      let data = {}
      if (match.score_1 !== '0 x 0') {
        data = {
          score_2: body.score,
          finished: match.score_1 === body.score,
          winner_id: body.winner_id || ''
        }
      } else {
        data = {
          score_1: body.score,
          winner_id: body.winner_id || ''
        }
      }
      await matchCollection
        .save(data)
        .catch(err => new BadRequest(err.toString()))

      if (body.users) {
        await matchCollection.related('users').attach(body.users)
      }

      if (
        matchCollection.attributes.winner_id &&
        matchCollection.attributes.finished
      ) {
        let expectedPoints =
          1 /
          (1 +
            Math.pow(
              10,
              (Number(match.users[0].rating) - Number(match.users[1].rating)) /
                400
            ))

        let ratingVariation = 30 * (1 - expectedPoints)

        let userWinner = await new User({ id: match.users[0].id })
          .fetch()
          .catch(err => new InternalServerError(err.toString()))
        await userWinner.save({
          rating: Number(userWinner.attributes.rating) + ratingVariation
        })
        let userLoser = await new User({ id: match.users[1].id })
          .fetch()
          .catch(err => new InternalServerError(err.toString()))
        await userLoser.save({
          rating: userLoser.attributes.rating - ratingVariation
        })
      }

      matchCollection = await new Match({ id: matchCollection.attributes.id })
        .fetch({ withRelated: ['users'] })
        .catch(err => new BadRequest(err.toString()))

      ctx.send(matchCollection.statusCode || 200, matchCollection)
    }
  }

  async delete (ctx) {
    const match = await new Match({ id: ctx.params.id })
      .fetch()
      .catch(err => new BadRequest(err.toString()))

    await match.related('users').detach()

    match.destroy().catch(err => new BadRequest(err.toString()))

    ctx.send(match.statusCode || 200, match.attributes ? new Deleted() : match)
  }
}

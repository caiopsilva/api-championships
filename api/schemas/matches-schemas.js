import Joi from 'joi'
import validate from 'koa-joi-validate'

export default class Validate {
  create () {
    return validate({
      body: {
        championship_id: Joi.string().guid().required(),
        users: Joi.array().optional()
      }
    })
  }

  update () {
    return validate({
      body: {
        users: Joi.array().optional(),
        score: Joi.string().required(),
        winner_id: Joi.string().optional()
      }
    })
  }
}

import Joi from 'joi'
import validate from 'koa-joi-validate'

export default class Validate {
  create () {
    return validate({
      body: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        rating: Joi.string().optional()
      }
    })
  }

  update () {
    return validate({
      body: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().optional(),
        rating: Joi.string().optional()
      }
    })
  }
}

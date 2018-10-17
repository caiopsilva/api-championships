import Joi from 'joi'
import validate from 'koa-joi-validate'

export default class Validate {
  create () {
    return validate({
      body: {
        name: Joi.string().required()
      }
    })
  }

  update () {
    return validate({
      body: {
        name: Joi.string().required(),
        users: Joi.array().optional()
      }
    })
  }

  patch () {
    return validate({
      body: {
        user: Joi.string().required()
      }
    })
  }
}

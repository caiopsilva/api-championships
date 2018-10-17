import jwtSecret from './jwt-secret'
const jwt = require('jsonwebtoken')
const _ = require('lodash')

export default function generateJWTforUser (user = {}) {
  return Object.assign({}, user, {
    token: jwt.sign({
      sub: _.pick(user, ['id', 'email'])
    }, jwtSecret)
  })
}

import Rollbar from 'rollbar'
const rollbar = new Rollbar('b20251ca52a543d69cf9b0f341e7b3c0')

export const NotFound = function (err) {
  Error.captureStackTrace(this, this.constructor)
  const message = err || 'The requested resource couldn\'t be foundd'

  this.name = this.constructor.name
  this.message = message
  this.statusCode = 404
  this.errorCode = 404
}

export const BadRequest = function (err) {
  Error.captureStackTrace(this, this.constructor)

  const message = err || 'The json data is malformed'

  this.name = this.constructor.name
  this.message = message
  this.statusCode = 400
  this.errorCode = 400

  rollbar.log(message)
}

export const InternalServerError = function (err) {
  Error.captureStackTrace(this, this.constructor)
  const message = err || 'The API did something wrong'

  this.name = this.constructor.name
  this.message = message
  this.statusCode = 500
  this.errorCode = 500

  rollbar.log(message)
}

export const Unauthorized = function (err) {
  Error.captureStackTrace(this, this.constructor)
  const message = err || 'Incorrect email or password'

  this.name = this.constructor.name
  this.message = message
  this.statusCode = 401
  this.errorCode = 401
}

export const Deleted = function (err) {
  Error.captureStackTrace(this, this.constructor)
  const message = err || 'Successfully deleted'

  this.name = this.constructor.name
  this.message = message
  this.deleted = true
  this.statusCode = 200
  this.errorCode = 200
}

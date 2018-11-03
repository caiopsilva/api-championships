import serve from 'koa-static'
import Koa from 'koa'
import Logger from 'koa-logger'
import Cors from '@koa/cors'
import BodyParser from 'koa-bodyparser'
import respond from 'koa-respond'
import mount from 'koa-mount'
import routes from '../routes'
import getToken from '../middleware/jwt-middleware'
import jwt from 'koa-jwt'
import jwtSecret from '../utils/jwt-secret'
import graphqlHttp from 'koa-graphql'
import graphqlSchema from '../graphql/schema'
import graphqlResolver from '../graphql/resolvers'

const app = new Koa()

app.use(mount('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true
})))

app.use(mount('/public', serve('./public')))

app.use(Logger())

app.use(
  Cors({
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    exposeHeaders: ['X-Request-Id']
  })
)
app.use(BodyParser({
  enableTypes: ['json']
}))

app.use(jwt({
  secret: jwtSecret,
  getToken
}).unless({
  path: [
    '/v1/users/login',
    '/v1/users/signup',
    '/public'
  ]
}))

app.use(respond())

app.use(routes.routes())
app.use(routes.allowedMethods())

export default app

import Router from 'koa-router'
import users from './users-router'
import matches from './matches-router'
import me from './me-router'
import championships from './championships-router'

const router = new Router()
const api = new Router()

api.use(users)
api.use(championships)
api.use(matches)
api.use(me)

router.use('/v1', api.routes())

export default router

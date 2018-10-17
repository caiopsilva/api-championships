import Router from 'koa-router'
import MatchesController from '../controllers/matches-controller'
import MatchesValidate from '../schemas/matches-schemas'

const router = new Router()
const ctrl = new MatchesController()
const valid = new MatchesValidate()

router.get('/matches', ctrl.get)

router.post('/matches', valid.create(), ctrl.create)
router.put('/matches/:id', valid.update(), ctrl.update)

router.delete('/matches/:id', ctrl.delete)

export default router.routes()

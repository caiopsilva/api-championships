import Router from 'koa-router'
import ChampionshipsController from '../controllers/championships-controller'
import ChampionshipsValidate from '../schemas/championships-schemas'

const router = new Router()
const ctrl = new ChampionshipsController()
const valid = new ChampionshipsValidate()

router.get('/championships', ctrl.get)

router.post('/championships', valid.create(), ctrl.create)
router.put('/championships/:id', valid.update(), ctrl.update)

router.delete('/championships/:id', ctrl.delete)

router.patch('/championships/:id', valid.patch(), ctrl.patch)

export default router.routes()

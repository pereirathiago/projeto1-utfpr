import { CreateComodoController } from '@modules/comum/use-cases/comodos/create-comodos/create-comodo-controller'
import { ListComodosController } from '@modules/comum/use-cases/comodos/list-comodos/list-comodos-controller'
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { Router } from 'express'
import { CountComodosController } from '@modules/comum/use-cases/comodos/count-comodos/count-comodos-controller'
import { GetComodosController } from '@modules/comum/use-cases/comodos/get-comodos/get-comodo-controller'
import { SelectComodosController } from '@modules/comum/use-cases/comodos/select-comodos/select-comodos-controller'
import { UpdateComodosController } from '@modules/comum/use-cases/comodos/update-comodos/update-comodo-controller'

const comodosRoutes = Router()

const createComodoController = new CreateComodoController()
const listComodosController = new ListComodosController()
const countComodosController = new CountComodosController()
const getComodosController = new GetComodosController()
const selectComodosController = new SelectComodosController()
const updateComodosController = new UpdateComodosController()

comodosRoutes.post('/', ensureAuthenticated, createComodoController.handle.bind(createComodoController))
comodosRoutes.post('/list', ensureAuthenticated, listComodosController.handle.bind(listComodosController))
comodosRoutes.get('/count', ensureAuthenticated, countComodosController.handle.bind(countComodosController))
comodosRoutes.get('/select', ensureAuthenticated, selectComodosController.handle.bind(selectComodosController))
comodosRoutes.get('/:id', ensureAuthenticated, getComodosController.handle.bind(getComodosController))
comodosRoutes.put('/:id', ensureAuthenticated, updateComodosController.handle.bind(updateComodosController))

export { comodosRoutes }

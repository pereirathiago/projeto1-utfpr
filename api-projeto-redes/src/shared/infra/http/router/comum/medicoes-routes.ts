import { CreateMedicaoController } from '@modules/comum/use-cases/medicoes/create-medicoes/create-medicoes-controller'
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { Router } from 'express'
import { CountMedicoesController } from '@modules/comum/use-cases/medicoes/count-medicoes/count-medicoes-controller'
import { ListMedicoesController } from '@modules/comum/use-cases/medicoes/list-medicoes/list-medicoes-controller'
import { GetMedicoesController } from '@modules/comum/use-cases/medicoes/get-medicoes/get-medicoes-controller'
import { UpdateMedicoesController } from '@modules/comum/use-cases/medicoes/update-medicoes/update-medicoes-controller'
import { GetMedicoesCsvModelController } from '@modules/comum/use-cases/medicoes/get-csv-modelo-medicoes/get-csv-modelo-medicoes-controller'

const medicoesRoutes = Router()

const createMedicaoController = new CreateMedicaoController()
const countMedicoesCOntroller = new CountMedicoesController()
const listMedicoesController = new ListMedicoesController()
const getMedicoesController = new GetMedicoesController()
const updateMedicoesController = new UpdateMedicoesController()
const getCsvModeloMedicoesController = new GetMedicoesCsvModelController()

medicoesRoutes.post('/', ensureAuthenticated, createMedicaoController.handle.bind(createMedicaoController))
medicoesRoutes.post('/list', ensureAuthenticated, listMedicoesController.handle.bind(listMedicoesController))
medicoesRoutes.get('/count', ensureAuthenticated, countMedicoesCOntroller.handle.bind(countMedicoesCOntroller))
medicoesRoutes.get('/csv/modelo', ensureAuthenticated, getCsvModeloMedicoesController.handle.bind(getCsvModeloMedicoesController))
medicoesRoutes.get('/:id', ensureAuthenticated, getMedicoesController.handle.bind(getMedicoesController))
medicoesRoutes.put('/:id', ensureAuthenticated, updateMedicoesController.handle.bind(updateMedicoesController))

export { medicoesRoutes }

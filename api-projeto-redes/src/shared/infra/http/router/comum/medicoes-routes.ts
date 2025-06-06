import { CreateMedicaoController } from '@modules/comum/use-cases/medicoes/create-medicoes/create-medicoes-controller'
import { ensureAuthenticated } from '../../middlewares/ensure-authenticated'
import { Router } from 'express'
import { CountMedicoesController } from '@modules/comum/use-cases/medicoes/count-medicoes/count-medicoes-controller'
import { ListMedicoesController } from '@modules/comum/use-cases/medicoes/list-medicoes/list-medicoes-controller'
import { GetMedicoesController } from '@modules/comum/use-cases/medicoes/get-medicoes/get-medicoes-controller'
import { UpdateMedicoesController } from '@modules/comum/use-cases/medicoes/update-medicoes/update-medicoes-controller'
import { GetMedicoesModelController } from '@modules/comum/use-cases/medicoes/get-xlsx-modelo-medicoes/get-xlsx-modelo-medicoes-controller'
import { ImportMedicoesController } from '@modules/comum/use-cases/medicoes/import-medicoes/import-medicoes-controller'
import multer from 'multer'
import { DeleteMedicoesController } from '@modules/comum/use-cases/medicoes/delete-medicoes/delete-medicoes-controller'
import { ListMediasComodoMedicoesController } from '@modules/comum/use-cases/medicoes/list-medias-comodo-medicoes/list-medias-comodo-medicoes-controller'
import { MultiDeleteMedicoesController } from '@modules/comum/use-cases/medicoes/multi-delete-medicoes/multi-delete-medicoes-controller'

const medicoesRoutes = Router()
const upload = multer({ storage: multer.memoryStorage() })

const createMedicaoController = new CreateMedicaoController()
const importMedicoesController = new ImportMedicoesController()
const countMedicoesCOntroller = new CountMedicoesController()
const listMedicoesController = new ListMedicoesController()
const listMediasComodosMedicoesController = new ListMediasComodoMedicoesController()
const getMedicoesController = new GetMedicoesController()
const updateMedicoesController = new UpdateMedicoesController()
const getModeloMedicoesController = new GetMedicoesModelController()
const deleteMedicoesController = new DeleteMedicoesController()
const multiDeleteMedicoesController = new MultiDeleteMedicoesController()

medicoesRoutes.post('/', ensureAuthenticated, createMedicaoController.handle.bind(createMedicaoController))
medicoesRoutes.post('/import', ensureAuthenticated, upload.single('file'), importMedicoesController.handle.bind(importMedicoesController))
medicoesRoutes.post('/list', ensureAuthenticated, listMedicoesController.handle.bind(listMedicoesController))
medicoesRoutes.get('/medias', ensureAuthenticated, listMediasComodosMedicoesController.handle.bind(listMediasComodosMedicoesController))
medicoesRoutes.get('/count', ensureAuthenticated, countMedicoesCOntroller.handle.bind(countMedicoesCOntroller))
medicoesRoutes.get('/modelo', ensureAuthenticated, getModeloMedicoesController.handle.bind(getModeloMedicoesController))
medicoesRoutes.get('/:id', ensureAuthenticated, getMedicoesController.handle.bind(getMedicoesController))
medicoesRoutes.put('/:id', ensureAuthenticated, updateMedicoesController.handle.bind(updateMedicoesController))
medicoesRoutes.delete('/multi-delete', ensureAuthenticated, multiDeleteMedicoesController.handle.bind(multiDeleteMedicoesController))
medicoesRoutes.delete('/:id', ensureAuthenticated, deleteMedicoesController.handle.bind(deleteMedicoesController))

export { medicoesRoutes }

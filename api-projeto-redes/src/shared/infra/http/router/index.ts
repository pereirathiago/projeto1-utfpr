import { Router } from "express";
import { helloWorldRoutes } from "./comum/hello-world-routes";
import { authenticateRoutes } from "./authentication/authentication-routes";
import { usersRoutes } from "./authentication/user-routes";
import { comodosRoutes } from "./comum/comodos-routes";
import { medicoesRoutes } from "./comum/medicoes-routes";

const router = Router()

router.use(helloWorldRoutes)
router.use(authenticateRoutes)
router.use('/users', usersRoutes)
router.use('/comodos', comodosRoutes)
router.use('/medicoes', medicoesRoutes)

export { router }
import { Router } from "express";
import { helloWorldRoutes } from "./comum/hello-world-routes";
import { authenticateRoutes } from "./authentication/authentication-routes";
import { usersRoutes } from "./authentication/user-routes";

const router = Router()

router.use(helloWorldRoutes)
router.use(authenticateRoutes)
router.use('/users', usersRoutes)

export { router }
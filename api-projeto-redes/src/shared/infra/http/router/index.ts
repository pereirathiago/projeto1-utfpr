import { Router } from "express";
import { helloWorldRoutes } from "./comum/hello-world-routes";

const router = Router()

router.use(helloWorldRoutes)

export { router }
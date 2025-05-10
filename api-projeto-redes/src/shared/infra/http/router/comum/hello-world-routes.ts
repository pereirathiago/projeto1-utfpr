import { Router } from "express";
import { HelloWorldController } from "@modules/comum/use-cases/hello-world/hello-world-controller";

const helloWorldRoutes = Router()
const helloWorldController = new HelloWorldController()

helloWorldRoutes.get('/hello-world', helloWorldController.handle.bind(helloWorldController))

export { helloWorldRoutes }
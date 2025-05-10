import { Request, Response } from "express"

class HelloWorldController {
  async handle(req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      message: "Hello World",
    })
  }
}

export { HelloWorldController }
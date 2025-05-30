import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateUserUseCase } from './update-user-use-case';

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password } = request.body;

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const result = await updateUserUseCase.execute({
      id,
      name,
      email,
      password,
    });

    return response.status(200).json(result);
  }
}

export { UpdateUserController };

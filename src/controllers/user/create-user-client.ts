import { Request, Response } from 'express';
import { CreateClientService } from '../../services/user/create-client';

export class CreateClientController {
    async handle(request: Request, response: Response) {
        const user = request.body;
        console.log(request.body);

        const service = new CreateClientService();
        const result = await service.execute(user);

        return response.json(result);
    }
}
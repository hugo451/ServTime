import { Request, Response } from 'express';
import { GetClientService } from '../../services/user/get-client';

export class GetClientController {
    async handle(_: Request, response: Response) {

        const service = new GetClientService();
        const result = await service.execute();

        return response.json(result);
    }
}
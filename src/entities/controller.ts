import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CRUDErrorCode, CRUDException } from './exceptions/crud-exception';
import { ServerErrorCode } from './exceptions/server-exception';
import { Log } from './log/log';
import { randomUUID } from 'crypto';
import { HtmlLogService } from './log/templates/htmlLog';
import { MementoService } from './memento/memento.service';

/**
 * Classe abstrata `Controller` que define a estrutura básica para controladores genéricos.
 * Utiliza dois parâmetros de tipo: `T` para o model e `U` para o DTO, que deve ser um objeto.
 *
 * @template T - Representa o tipo do model (entidade usada na lógica de negócio ou persistência).
 * @template U - Representa o tipo do DTO (objeto de transferência de dados usado para validação e transporte).
 */
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export abstract class Controller<T, U extends Object> {
    protected abstract get dto(): new () => U;
    protected abstract get entity(): string;
    private htmlLogService = HtmlLogService.instance;
    protected memento = new MementoService<T>();

    async getRelatory(request: Request, response: Response): Promise<Response> {
        try {
            // const { method } = request.body;
            const result = await this.htmlLogService.generateRelatory(
                this.entity,
            );
            console.log(result);
            //return response.status(200).json(result);
            return response.status(200).send(result);
        } catch (error) {
            return this.catchError(response, error as Error);
        }
    }
    async create(request: Request, response: Response): Promise<Response> {
        try {
            // Validate user creation data
            const validationError = await this.validateCreation(request.body);
            if (validationError) {
                return response.status(400).json({
                    code: validationError.code,
                    message: validationError.message,
                });
            }

            // Create user
            const entityBody: T = request.body;
            const result = await this.handleCreate(entityBody);
            return response.status(201).json(result);
        } catch (error) {
            return this.catchError(response, error as Error);
        } finally {
            const log: Log = {
                id: randomUUID(),
                event: 'create',
                oldValue: '',
                newValue: JSON.stringify(request.body),
                timestamp: new Date(),
                entity: this.entity,
            };
            this.htmlLogService.log(log);
        }
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        try {
            const users = await this.handleGetAll();
            return response.status(200).json(users);
        } catch (error) {
            return this.catchError(response, error as Error);
        } finally {
            const log: Log = {
                id: randomUUID(),
                event: 'getAll',
                oldValue: '',
                newValue: JSON.stringify(request.body),
                timestamp: new Date(),
                entity: this.entity,
            };
            this.htmlLogService.log(log);
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const entityBody: T = request.body;
        try {
            const updatedEntity = await this.handleUpdate(entityBody);
            this.memento.updateState(updatedEntity);
            console.log(this.memento.currentState);
            return response.status(200).json(updatedEntity);
        } catch (error) {
            return this.catchError(response, error as Error);
        } finally {
            const log: Log = {
                id: randomUUID(),
                event: 'update',
                oldValue: '',
                newValue: JSON.stringify(request.body),
                timestamp: new Date(),
                entity: this.entity,
            };
            this.htmlLogService.log(log);
        }
    }

    async undo (request: Request, response: Response): Promise<Response> {
        request.body = this.memento.undo();
        if(request.body === null){
            return response.status(204).json({'message': 'No previous State. '})
        }
        return await this.update(request, response);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const userId = request.params.id;
        try {
            const result = await this.handleDelete(userId);
            return response.status(200).json({ success: result });
        } catch (error) {
            return this.catchError(response, error as Error);
        } finally {
            const log: Log = {
                id: randomUUID(),
                event: 'delete',
                oldValue: '',
                newValue: JSON.stringify(request.body),
                timestamp: new Date(),
                entity: this.entity,
            };
            this.htmlLogService.log(log);
        }
    }

    private async validateCreation(
        body: unknown,
    ): Promise<CRUDException | null> {
        const obj = plainToInstance(this.dto, body);
        const errors = await validate(obj);

        if (errors.length > 0) {
            const errorMessages = errors
                .map((error) => Object.values(error.constraints || {}))
                .flat();
            return new CRUDException(
                `Validation failed: ${errorMessages.join(', ')}`,
                CRUDErrorCode.VALIDATION_FAILED,
            );
        }

        return null;
    }

    private catchError(response: Response, error: Error) {
        if (error instanceof CRUDException) {
            return response.status(400).json({
                message: error.message,
                code: error.code,
            });
        }
        return response.status(500).json({
            message: 'An internal server error occurred.',
            code: ServerErrorCode.INTERNAL_SERVER_ERROR,
        });
    }

    protected abstract handleCreate(user: T): Promise<T>;
    protected abstract handleGetAll(): Promise<T[]>;
    protected abstract handleUpdate(user: T): Promise<T>;
    protected abstract handleDelete(id: string): Promise<T>;
}

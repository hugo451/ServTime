import { Request, Response } from 'express';
import { ServiceCreateErrorCode, ServiceCreateException } from './exceptions/service-create.exception';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './service';

export abstract class ServiceController {
    constructor() {}

    async create(request: Request, response: Response): Promise<Response> {
        try {
            // Validate service creation data
            const validationError = await this.validateCreation(request.body);
            if (validationError) {
                return response.status(400).json({
                    code: validationError.code,
                    message: validationError.message,
                });
            }

            // Create service
            const serviceBody: Service = request.body;
            const result = await this.handleCreate(serviceBody);
            return response.status(201).json(result);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: ServiceCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        try {
            const services = await this.handleGetAll();
            return response.status(200).json(services);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: ServiceCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const serviceBody: Service = request.body;
        try {
            const updatedService = await this.handleUpdate(serviceBody);
            return response.status(200).json(updatedService);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: ServiceCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const serviceId = request.params.id;
        try {
            const result = await this.handleDelete(serviceId);
            return response.status(200).json({ success: result });
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: ServiceCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    private async validateCreation(body: unknown): Promise<ServiceCreateException | null> {
        const service = plainToInstance(CreateServiceDto, body);
        const errors = await validate(service);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
            return new ServiceCreateException(`Validation failed: ${errorMessages.join(', ')}`, ServiceCreateErrorCode.VALIDATION_FAILED);
        }

        return null;
    }

    protected abstract handleCreate(service: Service): Promise<Service>;
    protected abstract handleGetAll(): Promise<Service[]>;
    protected abstract handleUpdate(service: Service): Promise<Service>;
    protected abstract handleDelete(id: string): Promise<Service>;
}

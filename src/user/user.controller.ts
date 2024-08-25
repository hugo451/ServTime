import { Request, Response } from 'express';
import { UserCreateErrorCode, UserCreateException } from './exceptions/user-create.exception';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user';

export abstract class UserController {
    constructor() {}

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
            const userBody: User = request.body;
            const result = await this.handleCreate(userBody);
            return response.status(201).json(result);
        } catch (error) {
            if (error instanceof UserCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: UserCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        try {
            const users = await this.handleGetAll();
            return response.status(200).json(users);
        } catch (error) {
            if (error instanceof UserCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: UserCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        const userBody: User = request.body;
        try {
            const updatedUser = await this.handleUpdate(userBody);
            return response.status(200).json(updatedUser);
        } catch (error) {
            if (error instanceof UserCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: UserCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const userId = request.params.id;
        try {
            const result = await this.handleDelete(userId);
            return response.status(200).json({ success: result });
        } catch (error) {
            if (error instanceof UserCreateException) {
                return response.status(400).json({
                    message: error.message,
                    code: error.code
                });
            }
            return response.status(500).json({
                message: 'An internal server error occurred.',
                code: UserCreateErrorCode.INTERNAL_SERVER_ERROR
            });
        }
    }

    private async validateCreation(body: unknown): Promise<UserCreateException | null> {
        const user = plainToInstance(CreateUserDto, body);
        const errors = await validate(user);

        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
            return new UserCreateException(`Validation failed: ${errorMessages.join(', ')}`, UserCreateErrorCode.VALIDATION_FAILED);
        }

        return null;
    }

    protected abstract handleCreate(user: User): Promise<User>;
    protected abstract handleGetAll(): Promise<User[]>;
    protected abstract handleUpdate(user: User): Promise<User>;
    protected abstract handleDelete(id: string): Promise<User>;
}

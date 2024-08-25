import { Request, Response } from 'express';
import { UserController } from "../user.controller";
import { FileUserClientRepository } from "./repositories/file-user-client.repository";
import { UserClientList } from './repositories/in-memory-user-client.repository';
import { UserCreateException, UserCreateErrorCode } from '../exceptions/user-create.exception';
import { UserClient } from './user-client';


export class UserClientController extends UserController {
    private userClientList: UserClientList;
    private userClientFileList: FileUserClientRepository;
    
    constructor(){
        super();
        this.userClientList = UserClientList.instance;
        this.userClientFileList = FileUserClientRepository.instance;
    }

    async handleGetAll(): Promise<UserClient[]> {
        try {
            let list = this.userClientList.findAll();
            if (list.length === 0) {
                list = this.userClientFileList.findAll();
                this.userClientList.setList(list);
            }
            return list;
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to get all users.', UserCreateErrorCode.USER_FETCH_FAILED);
        }
    }

    async handleUpdate(user: UserClient): Promise<UserClient> {
        try {
            return this.userClientFileList.update(user.id, user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to update user.', UserCreateErrorCode.USER_UPDATE_FAILED);
        }
    }

    async handleDelete(id: string): Promise<UserClient> {
        try {
            return this.userClientFileList.delete(id);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to delete user.', UserCreateErrorCode.USER_DELETE_FAILED);
        }
    }

    async handleCreate(user: UserClient): Promise<UserClient> {
        try {
            this.userClientList.create(user);
            return this.userClientFileList.create(user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to create user.', UserCreateErrorCode.USER_CREATE_FAILED);
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const userBody: UserClient = request.body;
            console.log(userBody);
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

    async getAll(_: Request, response: Response): Promise<Response> {
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
        const userBody: UserClient = request.body;
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
}

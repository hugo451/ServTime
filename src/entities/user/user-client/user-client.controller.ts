import { UserClientFactory } from '../factories/user-client.factory';
import { UserClientList } from './repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from './repositories/file-user-client.repository';
import {
    UserCreateException,
    UserCreateErrorCode,
} from '../exceptions/user-create.exception';
import { UserClient } from './user-client';
import { Controller } from '../../controller';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserClientController extends Controller<
    UserClient,
    CreateUserDto
> {
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;

    constructor() {
        super();
        const repositories = UserClientFactory.createRepositories();
        this.memoryRepository = repositories.memory;
        this.fileRepository = repositories.file;
    }

    protected get dto(): new () => CreateUserDto {
        return CreateUserDto;
    }

    protected get entity(): string {
        return 'userClient';
    }

    async handleGetAll(): Promise<UserClient[]> {
        try {
            let list = this.memoryRepository.findAll();
            if (list.length === 0) {
                list = this.fileRepository.findAll();
                this.memoryRepository.setList(list);
            }
            return list;
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error;
            }
            throw new UserCreateException(
                'Failed to get all users.',
                UserCreateErrorCode.FETCH_FAILED,
            );
        }
    }

    async handleUpdate(user: UserClient): Promise<UserClient> {
        try {
            return this.fileRepository.update(user.id, user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error;
            }
            throw new UserCreateException(
                'Failed to update user.',
                UserCreateErrorCode.UPDATE_FAILED,
            );
        }
    }

    async handleDelete(id: string): Promise<UserClient> {
        try {
            return this.fileRepository.delete(id);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error;
            }
            throw new UserCreateException(
                'Failed to delete user.',
                UserCreateErrorCode.DELETE_FAILED,
            );
        }
    }

    async handleCreate(user: UserClient): Promise<UserClient> {
        try {
            this.memoryRepository.create(user);
            return this.fileRepository.create(user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error;
            }
            throw new UserCreateException(
                'Failed to create user.',
                UserCreateErrorCode.CREATE_FAILED,
            );
        }
    }
}

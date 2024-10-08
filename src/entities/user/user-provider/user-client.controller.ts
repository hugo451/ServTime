import { FileUserClientRepository } from './repositories/file-user-client.repository';
import { UserClientList } from './repositories/in-memory-user-client.repository';
import {
    UserCreateException,
    UserCreateErrorCode,
} from '../exceptions/user-create.exception';
import { UserProvider } from './user-provider';
import { Controller } from '../../controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserProviderFactory } from '../factories/user-provider.factory';

export class UserClientController extends Controller<
    UserProvider,
    CreateUserDto
> {
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;

    constructor() {
        super();
        const repositories = UserProviderFactory.createRepositories();
        this.memoryRepository = repositories.memory;
        this.fileRepository = repositories.file;
    }

    protected get dto(): new () => CreateUserDto {
        return CreateUserDto;
    }

    async handleGetAll(): Promise<UserProvider[]> {
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

    async handleUpdate(user: UserProvider): Promise<UserProvider> {
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

    async handleDelete(id: string): Promise<UserProvider> {
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

    async handleCreate(user: UserProvider): Promise<UserProvider> {
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

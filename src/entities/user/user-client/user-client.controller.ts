import { UserClientFactory } from './repositories/factory/user-client-repository.factory';
import { UserClientList } from './repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from './repositories/file-user-client.repository';
import {
    UserCreateException,
    UserCreateErrorCode,
} from '../exceptions/user-create.exception';
import { UserClient } from './user-client';
import { Controller } from '../../controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { UndoableStore } from '../../../memento/Memento'; // Import the UndoableStore

export class UserClientController extends Controller<UserClient, CreateUserDto> {
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;
    private userStore: UndoableStore<UserClient[]>; // Store for managing user states

    constructor() {
        super();
        const repositories = UserClientFactory.createRepositories();
        this.memoryRepository = repositories.memory;
        this.fileRepository = repositories.file;
        
        // Initialize the store with the current list of users
        this.userStore = new UndoableStore<UserClient[]>(this.memoryRepository.findAll());
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
                this.memoryRepository.init(list);
                this.userStore.setCurrentState(list); // Set the current state in the store
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
        this.userStore.save(); // Save the current state before updating
        try {
            const updatedUser = this.fileRepository.update(user.id, user);
            this.memoryRepository.update(user.id, user); // Also update in memory
            this.userStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return updatedUser;
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
        this.userStore.save(); // Save the current state before deleting
        try {
            const deletedUser = this.fileRepository.delete(id);
            this.memoryRepository.delete(id); // Also delete from memory
            this.userStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return deletedUser;
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
        this.userStore.save(); // Save the current state before creating
        try {
            this.memoryRepository.create(user);
            const createdUser = this.fileRepository.create(user);
            this.userStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return createdUser;
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

    async undo(): Promise<UserClient[]> {
        const previousState = this.userStore.undo(); // Restore the previous state
        if (previousState) {
            this.memoryRepository.init(previousState); // Restore memory repository state
        } else {
            throw new UserCreateException(
                'No state to undo.',
                UserCreateErrorCode.CREATE_FAILED,
            );
        }
        return previousState;
    }
}

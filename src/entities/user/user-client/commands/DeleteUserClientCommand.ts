import { Command } from '../../../../command';
import { UserClient } from '../user-client';
import { UserClientList } from '../repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from '../repositories/file-user-client.repository';
import { UserCreateException, UserCreateErrorCode } from '../../exceptions/user-create.exception';

export class DeleteUserClientCommand implements Command<string, UserClient> {
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;

    constructor(memoryRepository: UserClientList, fileRepository: FileUserClientRepository) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(id: string): Promise<UserClient> {
        try {
            const deletedUser = this.fileRepository.delete(id);
            this.memoryRepository.delete(id);
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
}
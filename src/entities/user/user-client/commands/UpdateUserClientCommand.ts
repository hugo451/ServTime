import { Command } from '../../../../command';
import { UserClient } from '../user-client';
import { UserClientList } from '../repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from '../repositories/file-user-client.repository';
import {
    UserCreateException,
    UserCreateErrorCode,
} from '../../exceptions/user-create.exception';

export class UpdateUserClientCommand
    implements Command<UserClient, UserClient>
{
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;

    constructor(
        memoryRepository: UserClientList,
        fileRepository: FileUserClientRepository,
    ) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(user: UserClient): Promise<UserClient> {
        try {
            this.memoryRepository.update(user.id, user);
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
}

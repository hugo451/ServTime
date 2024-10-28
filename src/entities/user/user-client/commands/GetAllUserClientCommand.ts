import { Command } from '../../../../command';
import { UserClient } from '../user-client';
import { UserClientList } from '../repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from '../repositories/file-user-client.repository';
import { UserCreateException, UserCreateErrorCode } from '../../exceptions/user-create.exception';

export class GetAllUserClientsCommand implements Command<void, UserClient[]> {
    private memoryRepository: UserClientList;
    private fileRepository: FileUserClientRepository;

    constructor(memoryRepository: UserClientList, fileRepository: FileUserClientRepository) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(): Promise<UserClient[]> {
        try {
            let list = this.memoryRepository.findAll();
            if (list.length === 0) {
                list = this.fileRepository.findAll();
                this.memoryRepository.init(list);
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
}

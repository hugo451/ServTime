import { UserClientList } from '../user-client/repositories/in-memory-user-client.repository';
import { FileUserClientRepository } from '../user-client/repositories/file-user-client.repository';

export class UserClientFactory {
    static createRepositories() {
        return {
            memory: UserClientList.instance,
            file: FileUserClientRepository.instance,
        };
    }

    // Modelo de Factory para escolher qual repositório usar
    // static createRepository(type: 'memory' | 'file') {
    //     if (type === 'memory') {
    //         return UserClientList.instance;
    //     } else if (type === 'file') {
    //         return FileUserClientRepository.instance;
    //     } else {
    //         throw new Error('Invalid repository type');
    //     }
    // }
}

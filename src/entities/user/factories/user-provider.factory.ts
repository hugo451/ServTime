import { FileUserClientRepository } from '../user-provider/repositories/file-user-client.repository';
import { UserClientList } from '../user-provider/repositories/in-memory-user-client.repository';

export class UserProviderFactory {
  static createRepositories() {
    return {
      memory: UserClientList.instance,
      file: FileUserClientRepository.instance,
    }
  }
}

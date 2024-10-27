import { Controller } from '../../controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserClient } from './user-client';
import { UserClientFactory } from './repositories/factory/user-client-repository.factory';
import { GetAllUserClientsCommand } from './commands/GetAllUserClientCommand';
import { CreateUserClientCommand } from './commands/CreateUserClientCommand';
import { UpdateUserClientCommand } from './commands/UpdateUserClientCommand';
import { DeleteUserClientCommand } from './commands/DeleteUserClientCommand';

export class UserClientController extends Controller<UserClient, CreateUserDto> {
    private getAllUserClientsCommand: GetAllUserClientsCommand;
    private createUserClientCommand: CreateUserClientCommand;
    private updateUserClientCommand: UpdateUserClientCommand;
    private deleteUserClientCommand: DeleteUserClientCommand;

    constructor() {
        super();
        const { memory, file } = UserClientFactory.createRepositories();
        this.getAllUserClientsCommand = new GetAllUserClientsCommand(memory, file);
        this.createUserClientCommand = new CreateUserClientCommand(memory, file);
        this.updateUserClientCommand = new UpdateUserClientCommand(memory, file);
        this.deleteUserClientCommand = new DeleteUserClientCommand(memory, file);
    }

    protected get dto(): new () => CreateUserDto {
        return CreateUserDto;
    }

    protected get entity(): string {
        return 'userClient';
    }

    async handleGetAll(): Promise<UserClient[]> {
        return this.getAllUserClientsCommand.execute();
    }

    async handleCreate(user: UserClient): Promise<UserClient> {
        return this.createUserClientCommand.execute(user);
    }

    async handleUpdate(user: UserClient): Promise<UserClient> {
        return this.updateUserClientCommand.execute(user);
    }

    async handleDelete(id: string): Promise<UserClient> {
        return this.deleteUserClientCommand.execute(id);
    }
}
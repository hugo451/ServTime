import { Controller } from '../controller';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './service';
import { ServiceFactory } from './repositories/factory/service.factory';
import { GetAllServicesCommand } from './commands/get-all-service.command';
import { CreateServiceCommand } from './commands/create-service.command';
import { UpdateServiceCommand } from './commands/update-service.command';
import { DeleteServiceCommand } from './commands/delete-service.command';

export class ServiceController extends Controller<Service, CreateServiceDto> {
    private getAllServicesCommand: GetAllServicesCommand;
    private createServiceCommand: CreateServiceCommand;
    private updateServiceCommand: UpdateServiceCommand;
    private deleteServiceCommand: DeleteServiceCommand;

    constructor() {
        super();
        const { memory, file } = ServiceFactory.createRepositories();
        this.getAllServicesCommand = new GetAllServicesCommand(memory, file);
        this.createServiceCommand = new CreateServiceCommand(memory, file);
        this.updateServiceCommand = new UpdateServiceCommand(memory, file);
        this.deleteServiceCommand = new DeleteServiceCommand(memory, file);
    }

    protected get dto(): new () => CreateServiceDto {
        return CreateServiceDto;
    }

    protected get entity(): string {
        return 'service';
    }

    async handleGetAll(): Promise<Service[]> {
        return this.getAllServicesCommand.execute();
    }

    async handleCreate(service: Service): Promise<Service> {
        return this.createServiceCommand.execute(service);
    }

    async handleUpdate(service: Service): Promise<Service> {
        return this.updateServiceCommand.execute(service);
    }

    async handleDelete(id: string): Promise<Service> {
        return this.deleteServiceCommand.execute(id);
    }
}

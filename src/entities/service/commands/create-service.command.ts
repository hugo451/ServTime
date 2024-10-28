import { Command } from '../../../command';
import { Service } from '../service';
import { ServiceList } from '../repositories/in-memory-service.repository';
import { FileServiceRepository } from '../repositories/file-service.repository';
import {
    ServiceCreateException,
    ServiceCreateErrorCode,
} from '../exceptions/service-create.exception';

export class CreateServiceCommand implements Command<Service, Service> {
    private memoryRepository: ServiceList;
    private fileRepository: FileServiceRepository;

    constructor(
        memoryRepository: ServiceList,
        fileRepository: FileServiceRepository,
    ) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(service: Service): Promise<Service> {
        try {
            this.memoryRepository.create(service);
            return this.fileRepository.create(service);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to create service.',
                ServiceCreateErrorCode.CREATE_FAILED,
            );
        }
    }
}

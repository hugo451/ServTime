import { Command } from '../../../command';
import { Service } from '../service';
import { ServiceList } from '../repositories/in-memory-service.repository';
import { FileServiceRepository } from '../repositories/file-service.repository';
import {
    ServiceCreateException,
    ServiceCreateErrorCode,
} from '../exceptions/service-create.exception';

export class DeleteServiceCommand implements Command<string, Service> {
    private memoryRepository: ServiceList;
    private fileRepository: FileServiceRepository;

    constructor(
        memoryRepository: ServiceList,
        fileRepository: FileServiceRepository,
    ) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(id: string): Promise<Service> {
        try {
            return this.fileRepository.delete(id);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to delete service.',
                ServiceCreateErrorCode.DELETE_FAILED,
            );
        }
    }
}

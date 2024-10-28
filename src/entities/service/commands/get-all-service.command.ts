import { Command } from '../../../command';
import { Service } from '../service';
import { ServiceList } from '../repositories/in-memory-service.repository';
import { FileServiceRepository } from '../repositories/file-service.repository';
import {
    ServiceCreateException,
    ServiceCreateErrorCode,
} from '../exceptions/service-create.exception';
import { CategoryController } from '../../category/category.controller';

export class GetAllServicesCommand implements Command<void, Service[]> {
    private memoryRepository: ServiceList;
    private fileRepository: FileServiceRepository;
    private categoryController: CategoryController;

    constructor(
        memoryRepository: ServiceList,
        fileRepository: FileServiceRepository,
    ) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
        this.categoryController = new CategoryController();
    }

    async execute(): Promise<Service[]> {
        try {
            const list = this.memoryRepository.findAll();
            const servicesWithCategory = Promise.all(
                list.map(async (service) => {
                    const category = await this.categoryController.findById(
                        service.categoryId,
                    );
                    service.category = category;
                    return service;
                }),
            );

            return servicesWithCategory;
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to get all services.',
                ServiceCreateErrorCode.FETCH_FAILED,
            );
        }
    }
}

import { Controller } from '../controller';
import { FileServiceRepository } from './repositories/file-service.repository';
import { ServiceList } from './repositories/in-memory-service.repository';
import {
    ServiceCreateException,
    ServiceCreateErrorCode,
} from './exceptions/service-create.exception';
import { Service } from './service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CategoryController } from '../category/category.controller';
import { ServiceFactory } from './repositories/factory/service.factory';

export class ServiceController extends Controller<Service, CreateServiceDto> {
    private memoryRepository: ServiceList;
    private fileRepository: FileServiceRepository;
    private categoryController: CategoryController;

    constructor() {
        super();
        const repositories = ServiceFactory.createService();
        this.memoryRepository = repositories.memory;
        this.fileRepository = repositories.file;
        this.categoryController = repositories.category;

        const list = this.fileRepository.findAll();
        this.memoryRepository.init(list);
    }

    protected get entity(): string {
        return 'service';
    }

    protected get dto(): new () => CreateServiceDto {
        return CreateServiceDto;
    }

    async handleGetAll(): Promise<Service[]> {
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
                ServiceCreateErrorCode.SERVICE_FETCH_FAILED,
            );
        }
    }

    async handleUpdate(service: Service): Promise<Service> {
        try {
            return this.fileRepository.update(service.id, service);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to update service.',
                ServiceCreateErrorCode.SERVICE_UPDATE_FAILED,
            );
        }
    }

    async handleDelete(id: string): Promise<Service> {
        try {
            return this.fileRepository.delete(id);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to delete service.',
                ServiceCreateErrorCode.SERVICE_DELETE_FAILED,
            );
        }
    }

    async handleCreate(service: Service): Promise<Service> {
        try {
            this.memoryRepository.create(service);
            return this.fileRepository.create(service);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error;
            }
            throw new ServiceCreateException(
                'Failed to create service.',
                ServiceCreateErrorCode.SERVICE_CREATE_FAILED,
            );
        }
    }
}

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
import { UndoableStore } from '../../memento/Memento'; // Import the UndoableStore

export class ServiceController extends Controller<Service, CreateServiceDto> {
    private memoryRepository: ServiceList;
    private fileRepository: FileServiceRepository;
    private categoryController: CategoryController;
    private serviceStore: UndoableStore<Service[]>; // Store for managing service states

    constructor() {
        super();
        const repositories = ServiceFactory.createService();
        this.memoryRepository = repositories.memory;
        this.fileRepository = repositories.file;
        this.categoryController = repositories.category;

        const list = this.fileRepository.findAll();
        this.memoryRepository.init(list);
        this.serviceStore = new UndoableStore<Service[]>(list); // Initialize the store with the current list of services
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
            const servicesWithCategory = await Promise.all(
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
        this.serviceStore.save(); // Save the current state before updating
        try {
            const updatedService = this.fileRepository.update(service.id, service);
            this.memoryRepository.update(service.id, service); // Also update in memory
            this.serviceStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return updatedService;
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
        this.serviceStore.save(); // Save the current state before deleting
        try {
            const deletedService = this.fileRepository.delete(id);
            this.memoryRepository.delete(id); // Also delete from memory
            this.serviceStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return deletedService;
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
        this.serviceStore.save(); // Save the current state before creating
        try {
            this.memoryRepository.create(service);
            const createdService = this.fileRepository.create(service);
            this.serviceStore.setCurrentState(this.memoryRepository.findAll()); // Update store state
            return createdService;
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

    async undo(): Promise<Service[]> {
        const previousState = this.serviceStore.undo(); // Restore the previous state
        if (previousState) {
            this.memoryRepository.init(previousState); // Restore memory repository state
        } else {
            throw new ServiceCreateException(
                'No state to undo.',
                ServiceCreateErrorCode.SERVICE_CREATE_FAILED,
            );
        }
        return previousState;
    }
}

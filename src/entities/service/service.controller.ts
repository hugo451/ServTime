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

export class ServiceController extends Controller<Service, CreateServiceDto> {
    private serviceList: ServiceList;
    private serviceFileList: FileServiceRepository;
    private categoryController: CategoryController;

    constructor() {
        super();
        this.serviceList = ServiceList.instance;
        this.serviceFileList = FileServiceRepository.instance;
        this.categoryController = new CategoryController();

        const list = this.serviceFileList.findAll();
        this.serviceList.setList(list);
    }

    protected get entity(): string {
        return 'service';
    }

    protected get dto(): new () => CreateServiceDto {
        return CreateServiceDto;
    }

    async handleGetAll(): Promise<Service[]> {
        try {
            const list = this.serviceList.findAll();
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
            return this.serviceFileList.update(service.id, service);
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
            return this.serviceFileList.delete(id);
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
            this.serviceList.create(service);
            return this.serviceFileList.create(service);
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

import { CategoryController } from '../../../category/category.controller';
import { FileServiceRepository } from '../file-service.repository';
import { ServiceList } from '../in-memory-service.repository';

export class ServiceFactory {
    static createService() {
        return {
            memory: ServiceList.instance,
            file: FileServiceRepository.instance,
            category: new CategoryController(),
        };
    }
}

import { ServiceController } from "../service.controller";
import { FileServiceClientRepository } from "./repositories/file-service-client.repository";
import { ServiceClientList } from './repositories/in-memory-service-client.repository';
import { ServiceCreateException, ServiceCreateErrorCode } from '../exceptions/service-create.exception';
import { ServiceClient } from './service-client';


export class ServiceClientController extends ServiceController {
    private serviceClientList: ServiceClientList;
    private serviceClientFileList: FileServiceClientRepository;
    
    constructor(){
        super();
        this.serviceClientList = ServiceClientList.instance;
        this.serviceClientFileList = FileServiceClientRepository.instance;
    }

    async handleGetAll(): Promise<ServiceClient[]> {
        try {
            let list = this.serviceClientList.findAll();
            if (list.length === 0) {
                list = this.serviceClientFileList.findAll();
                this.serviceClientList.setList(list);
            }
            return list;
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error; 
            }
            throw new ServiceCreateException('Failed to get all services.', ServiceCreateErrorCode.SERVICE_FETCH_FAILED);
        }
    }

    async handleUpdate(service: ServiceClient): Promise<ServiceClient> {
        try {
            return this.serviceClientFileList.update(service.serviceid, service);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error; 
            }
            throw new ServiceCreateException('Failed to update service.', ServiceCreateErrorCode.SERVICE_UPDATE_FAILED);
        }
    }

    async handleDelete(id: string): Promise<ServiceClient> {
        try {
            return this.serviceClientFileList.delete(id);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error; 
            }
            throw new ServiceCreateException('Failed to delete service.', ServiceCreateErrorCode.SERVICE_DELETE_FAILED);
        }
    }

    async handleCreate(service: ServiceClient): Promise<ServiceClient> {
        try {
            this.serviceClientList.create(service);
            return this.serviceClientFileList.create(service);
        } catch (error) {
            if (error instanceof ServiceCreateException) {
                throw error; 
            }
            throw new ServiceCreateException('Failed to create service.', ServiceCreateErrorCode.SERVICE_CREATE_FAILED);
        }
    }
}

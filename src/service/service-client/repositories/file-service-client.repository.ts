import * as path from 'path';
import * as fs from 'fs';
import { ServiceRepository } from '../../service.repository';
import { ServiceCreateException, ServiceCreateErrorCode } from '../../exceptions/service-create.exception';
import { ServiceClient } from '../service-client';

export class FileServiceClientRepository extends ServiceRepository {
    private static _path = path.join(__dirname, '../../../files/services.json');
    private static _instance: FileServiceClientRepository;

    private constructor(){
        super();
    }

    public static get instance(): FileServiceClientRepository {
        if (!FileServiceClientRepository._instance) {
            FileServiceClientRepository._instance = new FileServiceClientRepository();
        }
        return FileServiceClientRepository._instance;
    }

    private static _readFile(): ServiceClient[] {
        try {
            if (!fs.existsSync(FileServiceClientRepository._path)) {
                return [];
            }
            const data = fs.readFileSync(FileServiceClientRepository._path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new ServiceCreateException('Failed to read file.', ServiceCreateErrorCode.FILE_READ_ERROR);
        }
    }

    private static _writeFile(services: ServiceClient[]): void {
        try {
            fs.writeFileSync(FileServiceClientRepository._path, JSON.stringify(services, null, 2));
        } catch (error) {
            throw new ServiceCreateException('Failed to write file.', ServiceCreateErrorCode.FILE_WRITE_ERROR);
        }
    }

    create(body: ServiceClient): ServiceClient {
        try {
            const services = FileServiceClientRepository._readFile();
            services.push(body);
            FileServiceClientRepository._writeFile(services);
            return body;
        } catch (error) {
            throw new ServiceCreateException('Failed to create service.', ServiceCreateErrorCode.SERVICE_CREATE_FAILED);
        }
    }

    delete(id: string): ServiceClient {
        try {
            const services = FileServiceClientRepository._readFile();
            const index = services.findIndex(service => service.serviceid === id);
            if (index === -1) {
                throw new ServiceCreateException('Service not found.', ServiceCreateErrorCode.SERVICE_NOT_FOUND);
            }
            const [deletedService] = services.splice(index, 1);
            FileServiceClientRepository._writeFile(services);
            return deletedService;
        } catch (error) {
            throw new ServiceCreateException('Failed to delete service.', ServiceCreateErrorCode.SERVICE_DELETE_FAILED);
        }
    }

    findAll(): ServiceClient[] {
        try {
            return FileServiceClientRepository._readFile();
        } catch (error) {
            throw new ServiceCreateException('Failed to find services.', ServiceCreateErrorCode.SERVICE_FETCH_FAILED);
        }
    }

    update(id: string, body: ServiceClient): ServiceClient {
        try {
            const services = FileServiceClientRepository._readFile();
            const index = services.findIndex(service => service.serviceid === id);
            if (index === -1) {
                throw new ServiceCreateException('Service not found.', ServiceCreateErrorCode.SERVICE_NOT_FOUND);
            }
            services[index] = { ...services[index], ...body };
            FileServiceClientRepository._writeFile(services);
            return services[index];
        } catch (error) {
            throw new ServiceCreateException('Failed to update service.', ServiceCreateErrorCode.SERVICE_UPDATE_FAILED);
        }
    }
}

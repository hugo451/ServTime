import * as path from 'path';
import * as fs from 'fs';
import {
    ServiceCreateException,
    ServiceCreateErrorCode,
} from '../exceptions/service-create.exception';
import { Service } from '../service';
import { Repository } from '../../repository';

export class FileServiceRepository extends Repository<Service> {
    private static _path = path.join(__dirname, '../../../files/services.json');
    private static _instance: FileServiceRepository;

    private constructor() {
        super();
    }

    public static get instance(): FileServiceRepository {
        if (!FileServiceRepository._instance) {
            FileServiceRepository._instance = new FileServiceRepository();
        }
        return FileServiceRepository._instance;
    }

    private static _readFile(): Service[] {
        try {
            if (!fs.existsSync(FileServiceRepository._path)) {
                return [];
            }
            const data = fs.readFileSync(FileServiceRepository._path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to read file.',
                ServiceCreateErrorCode.FILE_READ_ERROR,
            );
        }
    }

    private static _writeFile(services: Service[]): void {
        try {
            fs.writeFileSync(
                FileServiceRepository._path,
                JSON.stringify(services, null, 2),
            );
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to write file.',
                ServiceCreateErrorCode.FILE_WRITE_ERROR,
            );
        }
    }

    init(data: Service[]): Service[] {
        if (this.findAll().length === 0) {
            FileServiceRepository._writeFile(data);
        }
        return data;
    }

    create(body: Service): Service {
        try {
            const services = FileServiceRepository._readFile();
            services.push(body);
            FileServiceRepository._writeFile(services);
            return body;
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to create service.',
                ServiceCreateErrorCode.SERVICE_CREATE_FAILED,
            );
        }
    }

    delete(id: string): Service {
        try {
            const services = FileServiceRepository._readFile();
            const index = services.findIndex((service) => service.id === id);
            if (index === -1) {
                throw new ServiceCreateException(
                    'Service not found.',
                    ServiceCreateErrorCode.SERVICE_NOT_FOUND,
                );
            }
            const [deletedService] = services.splice(index, 1);
            FileServiceRepository._writeFile(services);
            return deletedService;
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to delete service.',
                ServiceCreateErrorCode.SERVICE_DELETE_FAILED,
            );
        }
    }

    findAll(): Service[] {
        try {
            return FileServiceRepository._readFile();
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to find services.',
                ServiceCreateErrorCode.SERVICE_FETCH_FAILED,
            );
        }
    }

    update(id: string, body: Service): Service {
        try {
            const services = FileServiceRepository._readFile();
            const index = services.findIndex((service) => service.id === id);
            if (index === -1) {
                throw new ServiceCreateException(
                    'Service not found.',
                    ServiceCreateErrorCode.SERVICE_NOT_FOUND,
                );
            }
            services[index] = { ...services[index], ...body };
            FileServiceRepository._writeFile(services);
            return services[index];
        } catch (error) {
            throw new ServiceCreateException(
                'Failed to update service.',
                ServiceCreateErrorCode.SERVICE_UPDATE_FAILED,
            );
        }
    }
}

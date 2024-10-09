import { Repository } from '../../repository';
import { Service } from '../service';

export class ServiceList extends Repository<Service> {
    private static _instance: ServiceList;
    private list: Service[];

    private constructor(list?: Service[]) {
        super();
        this.list = list || [];
    }

    public static get instance(): ServiceList {
        if (!ServiceList._instance) {
            ServiceList._instance = new ServiceList();
        }
        return ServiceList._instance;
    }

    init(data: Service[]): Service[] {
        if (this.list.length === 0) {
            this.list = data;
        }
        return Array.from(this.list) as Service[];
    }

    create(body: Service): Service {
        this.list.push(body);
        return body;
    }

    find(id: string): Service | undefined {
        return this.list.find((service) => service.id === id);
    }

    delete(id: string): Service {
        const service = this.find(id);
        if (!service) {
            throw new Error('Service not found.');
        }
        const index = this.list.findIndex((service) => service.id === id);
        this.list.splice(index, 1);
        return service;
    }

    findAll(): Service[] {
        return Array.from(this.list) as Service[];
    }

    update(id: string, body: Service): Service {
        const service = this.find(id);
        if (!service) {
            throw new Error('Service not found.');
        }
        const index = this.list.findIndex((service) => service.id === id);
        this.list[index] = body;
        return body;
    }
}

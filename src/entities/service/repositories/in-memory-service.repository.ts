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

    public setList(list: Service[]): void {
        if (this.list.length === 0) {
            this.list = list;
        }
    }

    create(body: Service): Service {
        this.list.push(body);
        return body;
    }

    delete(id: string): Service {
        throw new Error('Method not implemented.');
    }

    findAll(): Service[] {
        return Array.from(this.list) as Service[];
    }

    update(id: string, body: Service): Service {
        throw new Error('Method not implemented.');
    }
}

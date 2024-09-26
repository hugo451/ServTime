import { ServiceRepository } from "../../service.repository";
import { ServiceClient } from "../service-client";

export class ServiceClientList extends ServiceRepository {
    private static _instance: ServiceClientList;
    private list: ServiceClient[];
    
    private constructor(list?: ServiceClient[]) {
        super();
        this.list = list || [];
    }
    
    public static get instance(): ServiceClientList{
        if(!ServiceClientList._instance){
            ServiceClientList._instance = new ServiceClientList();
        }
        return ServiceClientList._instance;
    }

    public setList(list: ServiceClient[]): void{
        if(this.list.length === 0){
            this.list = list;
        }
    }
    
    create(body: ServiceClient): ServiceClient {
        this.list.push(body);
        return body;
    }

    delete(id: string): ServiceClient {
        throw new Error("Method not implemented.");
    }

    findAll(): ServiceClient[] {
        return Array.from(this.list) as ServiceClient[];
    }

    update(id: string, body: ServiceClient): ServiceClient {
        throw new Error("Method not implemented.");
    }
}
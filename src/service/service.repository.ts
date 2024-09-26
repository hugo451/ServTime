import { Service } from "./service";

export abstract class ServiceRepository{
    abstract create(body: Service): Service;
    abstract delete(id: string): Service;
    abstract findAll(): Service[];
    abstract update(id: string, body: Service): Service;
}
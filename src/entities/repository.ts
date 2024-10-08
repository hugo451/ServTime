/**
 * Classe abstrata que define a interface para um repositório genérico.
 * @template T - O tipo de objeto que o repositório irá manipular.
 */
export abstract class Repository<T> {
    abstract init(data: T[]): T[];
    abstract create(body: T): T;
    abstract delete(id: string): T;
    abstract findAll(): T[];
    abstract update(id: string, body: T): T;
}

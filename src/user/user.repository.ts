import { User } from "./user";

export abstract class UserRepository{
    abstract create(body: User): User;
    abstract delete(id: string): User;
    abstract findAll(): User[];
    abstract update(id: string, body: User): User;
}
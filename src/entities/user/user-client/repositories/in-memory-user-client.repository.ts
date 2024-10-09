import { Repository } from '../../../repository';
import { UserClient } from '../user-client';

export class UserClientList extends Repository<UserClient> {
    private static _instance: UserClientList;
    private list: UserClient[];

    private constructor(list?: UserClient[]) {
        super();
        this.list = list || [];
    }

    public static get instance(): UserClientList {
        if (!UserClientList._instance) {
            UserClientList._instance = new UserClientList();
        }
        return UserClientList._instance;
    }

    init(data: UserClient[]): UserClient[] {
        if (this.list.length === 0) {
            this.list = data;
        }
        return Array.from(this.list) as UserClient[];
    }

    create(body: UserClient): UserClient {
        this.list.push(body);
        return body;
    }

    delete(id: string): UserClient {
        const user = this.find(id);
        if (!user) {
            throw new Error('User not found.');
        }
        const index = this.list.findIndex((user) => user.id === id);
        this.list.splice(index, 1);
        return user;
    }

    find(id: string): UserClient | undefined {
        return this.list.find((user) => user.id === id);
    }

    findAll(): UserClient[] {
        return Array.from(this.list) as UserClient[];
    }

    update(id: string, body: UserClient): UserClient {
        const user = this.find(id);
        if (!user) {
            throw new Error('User not found.');
        }
        const index = this.list.findIndex((user) => user.id === id);
        this.list[index] = body;
        return body;
    }
}

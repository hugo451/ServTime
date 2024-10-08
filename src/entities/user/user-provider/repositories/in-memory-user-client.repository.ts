import { Repository } from '../../../repository';
import { UserProvider } from '../user-provider';

export class UserClientList extends Repository<UserProvider> {
    private static _instance: UserClientList;
    private list: UserProvider[];

    private constructor(list?: UserProvider[]) {
        super();
        this.list = list || [];
    }

    public static get instance(): UserClientList {
        if (!UserClientList._instance) {
            UserClientList._instance = new UserClientList();
        }
        return UserClientList._instance;
    }

    public setList(list: UserProvider[]): void {
        if (this.list.length === 0) {
            this.list = list;
        }
    }

    create(body: UserProvider): UserProvider {
        this.list.push(body);
        return body;
    }

    delete(id: string): UserProvider {
        throw new Error('Method not implemented.');
    }

    findAll(): UserProvider[] {
        return Array.from(this.list) as UserProvider[];
    }

    update(id: string, body: UserProvider): UserProvider {
        throw new Error('Method not implemented.');
    }
}

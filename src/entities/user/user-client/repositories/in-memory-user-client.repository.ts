import { Repository } from "../../../repository";
import { UserClient } from "../user-client";

export class UserClientList extends Repository<UserClient> {
    private static _instance: UserClientList;
    private list: UserClient[];
    
    private constructor(list?: UserClient[]) {
        super();
        this.list = list || [];
    }
    
    public static get instance(): UserClientList{
        if(!UserClientList._instance){
            UserClientList._instance = new UserClientList();
        }
        return UserClientList._instance;
    }

    public setList(list: UserClient[]): void{
        if(this.list.length === 0){
            this.list = list;
        }
    }
    
    create(body: UserClient): UserClient {
        this.list.push(body);
        return body;
    }

    delete(id: string): UserClient {
        throw new Error("Method not implemented.");
    }

    findAll(): UserClient[] {
        return Array.from(this.list) as UserClient[];
    }

    update(id: string, body: UserClient): UserClient {
        throw new Error("Method not implemented.");
    }
}
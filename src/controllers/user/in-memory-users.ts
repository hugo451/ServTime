import { IUser } from "../../models/user";

export class UserList {
    private static _instance: UserList;
    list: IUser[];

    private constructor(){
        this.list = [];
    }

    public static get instance(): UserList{
        if(!UserList._instance){
            UserList._instance = new UserList();
        }
        return UserList._instance;
    }

    public addUser(user: IUser): IUser[]{
        this.list.push(user);
        console.log(this.list);
        return this.list;
    }

    public get users(): IUser[]{
        return this.list;
    }
}
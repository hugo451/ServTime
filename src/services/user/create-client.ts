import { UserList } from "../../controllers/user/in-memory-users";
import { IUserClient } from "../../models/user-client";

export class CreateClientService {
    async execute(user: IUserClient){
        const userList: UserList = UserList.instance;
        return userList.addUser(user);
    }
}
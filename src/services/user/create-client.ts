import { UserList } from "../../controllers/user/in-memory-users";
import { IUserClient } from "../../models/user-client";


// VINCULAR RESPONSE-USER e pegar exceccao que vem de baixo
export class CreateClientService {
    async execute(user: IUserClient){
        const userList: UserList = UserList.instance;
        return userList.addUser(user);
    }
}
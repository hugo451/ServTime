import { UserList } from "../../controllers/user/in-memory-users";

export class GetClientService {
    async execute(){
        const userList: UserList = UserList.instance;
        return userList.list;
    }
}
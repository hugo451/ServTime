import { FileUserClientRepository } from "./repositories/file-user-client.repository";
import { UserClientList } from './repositories/in-memory-user-client.repository';
import { UserCreateException, UserCreateErrorCode } from '../exceptions/user-create.exception';
import { UserClient } from './user-provider';
import { Controller } from "../../controller";
import { CreateUserDto } from "../dto/create-user.dto";


export class UserClientController extends Controller<UserClient, CreateUserDto> {
    private userClientList: UserClientList;
    private userClientFileList: FileUserClientRepository;
    
    constructor(){
        super();
        this.userClientList = UserClientList.instance;
        this.userClientFileList = FileUserClientRepository.instance;
    }

    protected get dto(): new () => CreateUserDto {
        return CreateUserDto;
    }
    

    async handleGetAll(): Promise<UserClient[]> {
        try {
            let list = this.userClientList.findAll();
            if (list.length === 0) {
                list = this.userClientFileList.findAll();
                this.userClientList.setList(list);
            }
            return list;
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to get all users.', UserCreateErrorCode.FETCH_FAILED);
        }
    }

    async handleUpdate(user: UserClient): Promise<UserClient> {
        try {
            return this.userClientFileList.update(user.id, user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to update user.', UserCreateErrorCode.UPDATE_FAILED);
        }
    }

    async handleDelete(id: string): Promise<UserClient> {
        try {
            return this.userClientFileList.delete(id);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to delete user.', UserCreateErrorCode.DELETE_FAILED);
        }
    }

    async handleCreate(user: UserClient): Promise<UserClient> {
        try {
            this.userClientList.create(user);
            return this.userClientFileList.create(user);
        } catch (error) {
            if (error instanceof UserCreateException) {
                throw error; 
            }
            throw new UserCreateException('Failed to create user.', UserCreateErrorCode.CREATE_FAILED);
        }
    }
}

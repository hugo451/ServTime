import * as path from 'path';
import * as fs from 'fs';
import { UserRepository } from '../../user.repository';
import { UserCreateException, UserCreateErrorCode } from '../../exceptions/user-create.exception';
import { UserClient } from '../user-client';

export class FileUserClientRepository extends UserRepository {
    private static _path = path.join(__dirname, '../../../files/users.json');
    private static _instance: FileUserClientRepository;

    private constructor(){
        super();
    }

    public static get instance(): FileUserClientRepository {
        if (!FileUserClientRepository._instance) {
            FileUserClientRepository._instance = new FileUserClientRepository();
        }
        return FileUserClientRepository._instance;
    }

    private static _readFile(): UserClient[] {
        try {
            if (!fs.existsSync(FileUserClientRepository._path)) {
                return [];
            }
            const data = fs.readFileSync(FileUserClientRepository._path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new UserCreateException('Failed to read file.', UserCreateErrorCode.FILE_READ_ERROR);
        }
    }

    private static _writeFile(users: UserClient[]): void {
        try {
            fs.writeFileSync(FileUserClientRepository._path, JSON.stringify(users, null, 2));
        } catch (error) {
            throw new UserCreateException('Failed to write file.', UserCreateErrorCode.FILE_WRITE_ERROR);
        }
    }

    create(body: UserClient): UserClient {
        try {
            const users = FileUserClientRepository._readFile();
            users.push(body);
            FileUserClientRepository._writeFile(users);
            return body;
        } catch (error) {
            throw new UserCreateException('Failed to create user.', UserCreateErrorCode.USER_CREATE_FAILED);
        }
    }

    delete(id: string): UserClient {
        try {
            const users = FileUserClientRepository._readFile();
            const index = users.findIndex(user => user.id === id);
            if (index === -1) {
                throw new UserCreateException('User not found.', UserCreateErrorCode.USER_NOT_FOUND);
            }
            const [deletedUser] = users.splice(index, 1);
            FileUserClientRepository._writeFile(users);
            return deletedUser;
        } catch (error) {
            throw new UserCreateException('Failed to delete user.', UserCreateErrorCode.USER_DELETE_FAILED);
        }
    }

    findAll(): UserClient[] {
        try {
            return FileUserClientRepository._readFile();
        } catch (error) {
            throw new UserCreateException('Failed to find users.', UserCreateErrorCode.USER_FETCH_FAILED);
        }
    }

    update(id: string, body: UserClient): UserClient {
        try {
            const users = FileUserClientRepository._readFile();
            const index = users.findIndex(user => user.id === id);
            if (index === -1) {
                throw new UserCreateException('User not found.', UserCreateErrorCode.USER_NOT_FOUND);
            }
            users[index] = { ...users[index], ...body };
            FileUserClientRepository._writeFile(users);
            return users[index];
        } catch (error) {
            throw new UserCreateException('Failed to update user.', UserCreateErrorCode.USER_UPDATE_FAILED);
        }
    }
}

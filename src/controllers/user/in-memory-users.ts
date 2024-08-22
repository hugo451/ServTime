import { IUser } from "../../models/user";
import { LoginException, LoginStatus } from "../../models/exceptions";

import * as fs from 'fs';
import * as path from 'path';
import { LOADIPHLPAPI } from "dns";


export class UserList {
    private static _instance: UserList;
    list: IUser[];
    private saveToFile: boolean;
    private filePath: string;

    private constructor(){
        //his.saveToFile = process.env.SAVE_TO_FILE === 'true';
        this.saveToFile = false;
        this.filePath = path.join(__dirname, 'users.json');
        if (this.saveToFile) {
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, JSON.stringify([]));
            }
        } else {
            this.list = [];
        }

        this.list = [];
    }

    public static get instance(): UserList{
        if(!UserList._instance){
            UserList._instance = new UserList();
        }
        return UserList._instance;
    }

    public addUser(user: IUser): IUser[]{
        
        // Validating user
        try {
            this.validateUsername(user);
            this.validateUserMail(user);

            if (this.saveToFile) {
                const users = this.getUsersFromFile();
                users.push(user);
                fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
                return users;
            } else {
                this.list.push(user);
                console.log(this.list);
                return this.list;
            }
        } catch (ex) {
            if (ex instanceof LoginException) {
                throw ex;
            } else {
                throw new Error('An unexpected error occurred during user validation');
            }
        }
    }

    
    private validateUsername(user: IUser): void {
        if (!user.username || typeof user.username !== 'string') {
            console.log('Invalid user name');
            throw(new LoginException('Invalid user name', LoginStatus.USER_NAME_NOT_STRING));
        }
        if(user.username.length > 12 || user.username.length == 0){
            console.log('Invalid user name length');
            throw(new LoginException('Invalid user name length', LoginStatus.USER_NAME_LENGTH_INVALID));
        } 

        if(!this.stringHasNoNumber(user.username)){
            console.log('User name has numbers.');
            throw(new LoginException('Invalid user name length', LoginStatus.USER_NAME_HAS_NUMBER));
        }
    }

    private validateUserMail(user: IUser): void {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!user.mail || typeof user.mail !== 'string' || emailRegex.test(user.mail)) {
            console.log('Invalid user mail');
            throw(new LoginException('Invalid user mail', LoginStatus.USER_MAIL_INVALID));
      
        }

    }

    private stringHasNoNumber(username: string): boolean {
        const usernameRegex = /^[^\d]+$/;
        return usernameRegex.test(username);
    }

    public get users(): IUser[] {
        if (this.saveToFile) {
            return this.getUsersFromFile();
        } else {
            return this.list;
        }
    }

    private getUsersFromFile(): IUser[] {
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data) as IUser[];
    }     
}



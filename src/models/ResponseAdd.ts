import { IUserClient } from "./user-client";

export class ResponseAddUser {
    status: string;
    user: IUserClient;

    constructor(status: string, user: IUserClient) {
        this.status = status;
        this.user = user;
    }
}

import { UUID } from "crypto";

export interface IUser {
    id: UUID;
    username: string;
    password: string;
    name: string;
    adress: string;
    phone: string;
    mail: string;
}
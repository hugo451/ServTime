import { UUID } from "crypto";

export interface User {
    id: UUID;
    username: string;
    password: string;
    name: string;
    adress: string;
    phone: string;
    mail: string;
}
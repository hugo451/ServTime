import { Service } from "../../service/service";
import { User } from "../user";

export interface UserProvider extends User {
    services: Service[];
}
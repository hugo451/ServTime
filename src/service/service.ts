import { UUID } from "crypto";

export interface Service {
    serviceid: UUID;
    name: string;
    type: string;
    description: string;
    price: number;
}
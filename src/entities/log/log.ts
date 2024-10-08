import { UUID } from "crypto";

export interface Log {
    id: UUID;
    event: string;
    oldValue: string;
    newValue: string;
    timestamp: Date;
    //userId: UUID;
    entity: string;
}
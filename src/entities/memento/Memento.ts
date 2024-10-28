import { UUID } from "crypto";

export interface Memento <T> {
    id: UUID;
    currentState: T;
}
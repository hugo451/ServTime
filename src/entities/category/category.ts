import { UUID } from "crypto";

export interface Category {
    id: UUID;
    category: string;
    parent: Category | null;
    parentId: UUID | null;
}
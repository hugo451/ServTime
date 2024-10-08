import { UUID } from 'crypto';
import { Category } from '../category/category';

export interface Service {
    id: UUID;
    name: string;
    type: string;
    description: string;
    price: number;
    category: Category;
    categoryId: UUID;
}

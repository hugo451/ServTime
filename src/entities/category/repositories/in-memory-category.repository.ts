import { Repository } from '../../repository';
import { Category } from '../category';

export class CategoryList extends Repository<Category> {
    private static _instance: CategoryList;
    private list: Category[];

    private constructor(list?: Category[]) {
        super();
        this.list = list || [];
    }

    public static get instance(): CategoryList {
        if (!CategoryList._instance) {
            CategoryList._instance = new CategoryList();
        }
        return CategoryList._instance;
    }

    init(list: Category[]): Category[] {
        if (this.list.length === 0) {
            this.list = list;
        }
        return Array.from(this.list) as Category[];
    }

    create(body: Category): Category {
        this.list.push(body);
        return body;
    }

    delete(id: string): Category {
        const category = this.find(id);
        if (!category) {
            throw new Error('Category not found.');
        }
        const index = this.list.findIndex((category) => category.id === id);
        this.list.splice(index, 1);
        return category;
    }

    findAll(): Category[] {
        return Array.from(this.list) as Category[];
    }

    find(id: string): Category | undefined {
        return this.list.find((category) => category.id === id);
    }

    update(id: string, body: Category): Category {
        const category = this.find(id);
        if (!category) {
            throw new Error('Category not found.');
        }
        const index = this.list.findIndex((category) => category.id === id);
        this.list[index] = body;
        return body;
    }
}

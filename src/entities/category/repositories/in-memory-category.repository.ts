import { Repository } from "../../repository";
import { Category } from "../category";

export class CategoryList extends Repository<Category> {
    private static _instance: CategoryList;
    private list: Category[];
    
    private constructor(list?: Category[]) {
        super();
        this.list = list || [];
    }
    
    public static get instance(): CategoryList{
        if(!CategoryList._instance){
            CategoryList._instance = new CategoryList();
        }
        return CategoryList._instance;
    }

    public setList(list: Category[]): void{
        if(this.list.length === 0){
            this.list = list;
        }
    }
    
    create(body: Category): Category {
        this.list.push(body);
        return body;
    }

    delete(id: string): Category {
        throw new Error("Method not implemented.");
    }

    findAll(): Category[] {
        return Array.from(this.list) as Category[];
    }

    find(id: string): Category | undefined {
        return this.list.find(category => category.id === id);
    }

    update(id: string, body: Category): Category {
        throw new Error("Method not implemented.");
    }
}

import { Controller } from '../controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category';
import { CategoryFactory } from './repositories/factory/category.factory';
import { GetAllCategorysCommand } from './commands/get-all-category.command';
import { CreateCategoryCommand } from './commands/create-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { GetByIdCategoryCommand } from './commands/get-by-id-category.command';

export class CategoryController extends Controller<Category, CreateCategoryDto> {
    private getAllCategorysCommand: GetAllCategorysCommand;
    private createCategoryCommand: CreateCategoryCommand;
    private updateCategoryCommand: UpdateCategoryCommand;
    private deleteCategoryCommand: DeleteCategoryCommand;
    private getByIdCategoryCommand: GetByIdCategoryCommand;

    constructor() {
        super();
        const { memory, file } = CategoryFactory.createRepositories();
        this.getAllCategorysCommand = new GetAllCategorysCommand(memory, file);
        this.createCategoryCommand = new CreateCategoryCommand(memory, file);
        this.updateCategoryCommand = new UpdateCategoryCommand(memory, file);
        this.deleteCategoryCommand = new DeleteCategoryCommand(memory, file);
        this.getByIdCategoryCommand = new GetByIdCategoryCommand(memory, file);
    }

    protected get dto(): new () => CreateCategoryDto {
        return CreateCategoryDto;
    }

    protected get entity(): string {
        return 'category';
    }

    async handleGetAll(): Promise<Category[]> {
        return this.getAllCategorysCommand.execute();
    }

    async handleCreate(category: Category): Promise<Category> {
        return this.createCategoryCommand.execute(category);
    }

    async handleUpdate(category: Category): Promise<Category> {
        return this.updateCategoryCommand.execute(category);
    }

    async handleDelete(id: string): Promise<Category> {
        return this.deleteCategoryCommand.execute(id);
    }

    async findById(id: string): Promise<Category> {
        return this.getByIdCategoryCommand.execute(id);
    }
}

import { Command } from '../../../command';
import { Category } from '../category';
import { CategoryList } from '../repositories/in-memory-category.repository';
import { FileCategoryRepository } from '../repositories/file-category.repository';
import {
    CategoryCreateException,
    CategoryCreateErrorCode,
} from '../exceptions/category-create.exception';

export class GetByIdCategoryCommand implements Command<string, Category> {
    private memoryRepository: CategoryList;
    private fileRepository: FileCategoryRepository;

    constructor(
        memoryRepository: CategoryList,
        fileRepository: FileCategoryRepository,
    ) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
    }

    async execute(id: string): Promise<Category> {
        const category: Category | undefined = this.memoryRepository.find(id);
        if (category) {
            return category;
        }
        throw new CategoryCreateException(
            'This Category does not exists',
            CategoryCreateErrorCode.NOT_FOUND,
        );
    }
}

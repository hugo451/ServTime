
import { Command } from '../../../command';
import { Category } from '../category';
import { CategoryList } from '../repositories/in-memory-category.repository';
import { FileCategoryRepository } from '../repositories/file-category.repository';
import { CategoryCreateException, CategoryCreateErrorCode } from '../exceptions/category-create.exception';
import { GetByIdCategoryCommand } from './get-by-id-category.command';

export class CreateCategoryCommand implements Command<Category, Category> {
    private memoryRepository: CategoryList;
    private fileRepository: FileCategoryRepository;
    private getByIdCategoryCommand: GetByIdCategoryCommand;

    constructor(memoryRepository: CategoryList, fileRepository: FileCategoryRepository) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
        this.getByIdCategoryCommand = new GetByIdCategoryCommand(memoryRepository, fileRepository);
    }

    async execute(category: Category): Promise<Category> {
        try {
            if (category.parentId) {
                this.getByIdCategoryCommand.execute(category.parentId)
                    .then((parent) => (category.parent = parent))
                    .catch((error) => {
                        throw error;
                    });
            }
            this.memoryRepository.create(category);
            return this.fileRepository.create(category);
        } catch (error) {
            if (error instanceof CategoryCreateException) {
                throw error;
            }
            throw new CategoryCreateException(
                'Failed to create category.',
                CategoryCreateErrorCode.CREATE_FAILED,
            );
        }
    }
}

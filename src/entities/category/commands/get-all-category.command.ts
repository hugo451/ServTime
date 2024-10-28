
import { Command } from '../../../command';
import { Category } from '../category';
import { CategoryList } from '../repositories/in-memory-category.repository';
import { FileCategoryRepository } from '../repositories/file-category.repository';
import { CategoryCreateException, CategoryCreateErrorCode } from '../exceptions/category-create.exception';
import { GetByIdCategoryCommand } from './get-by-id-category.command';

export class GetAllCategorysCommand implements Command<void, Category[]> {
    private memoryRepository: CategoryList;
    private fileRepository: FileCategoryRepository;
    private getByIdCategoryCommand: GetByIdCategoryCommand;

    constructor(memoryRepository: CategoryList, fileRepository: FileCategoryRepository) {
        this.memoryRepository = memoryRepository;
        this.fileRepository = fileRepository;
        this.getByIdCategoryCommand = new GetByIdCategoryCommand(memoryRepository, fileRepository);
    }

    async execute(): Promise<Category[]> {
        try {
            const list = this.memoryRepository.findAll();

            const categories = await Promise.all(
                list.map(async (category) => {
                    if (category.parentId) {
                        const parent = await this.getByIdCategoryCommand.execute(category.parentId);
                        if (parent) {
                            category.parent = parent;
                        }
                    }
                    return category;
                }),
            );
            return categories;
        } catch (error) {
            if (error instanceof CategoryCreateException) {
                throw error;
            }
            throw new CategoryCreateException(
                'Failed to get all categories.',
                CategoryCreateErrorCode.FETCH_FAILED,
            );
        }
    }
}

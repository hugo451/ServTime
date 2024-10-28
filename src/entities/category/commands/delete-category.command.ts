import { Command } from '../../../command';
import { Category } from '../category';
import { CategoryList } from '../repositories/in-memory-category.repository';
import { FileCategoryRepository } from '../repositories/file-category.repository';
import {
    CategoryCreateException,
    CategoryCreateErrorCode,
} from '../exceptions/category-create.exception';

export class DeleteCategoryCommand implements Command<string, Category> {
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
        try {
            return this.fileRepository.delete(id);
        } catch (error) {
            if (error instanceof CategoryCreateException) {
                throw error;
            }
            throw new CategoryCreateException(
                'Failed to delete category.',
                CategoryCreateErrorCode.DELETE_FAILED,
            );
        }
    }
}

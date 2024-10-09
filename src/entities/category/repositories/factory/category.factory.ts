import { FileCategoryRepository } from '../file-category.repository';
import { CategoryList } from '../in-memory-category.repository';

export class CategoryFactory {
    static createRepositories() {
        return {
            memory: CategoryList.instance,
            file: FileCategoryRepository.instance,
        };
    }
}

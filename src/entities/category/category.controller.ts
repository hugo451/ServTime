import { Controller } from '../controller';
import { Category } from './category';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
    CategoryCreateErrorCode,
    CategoryCreateException,
} from './exceptions/category-create.exception';
import { FileCategoryRepository } from './repositories/file-category.repository';
import { CategoryList } from './repositories/in-memory-category.repository';

export class CategoryController extends Controller<
    Category,
    CreateCategoryDto
> {
    private categoryList: CategoryList;
    private categoryFileList: FileCategoryRepository;

    constructor() {
        super();
        this.categoryFileList = FileCategoryRepository.instance;
        this.categoryList = CategoryList.instance;

        const list = this.categoryFileList.findAll();
        this.categoryList.setList(list);
    }

    protected get entity(): string {
        return 'category';
    }

    protected get dto(): new () => CreateCategoryDto {
        return CreateCategoryDto;
    }

    async handleGetAll(): Promise<Category[]> {
        try {
            const list = this.categoryList.findAll();

            const categories = await Promise.all(
                list.map(async (category) => {
                    if (category.parentId) {
                        const parent = await this.findById(category.parentId);
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

    async handleUpdate(category: Category): Promise<Category> {
        try {
            return this.categoryFileList.update(category.id, category);
        } catch (error) {
            if (error instanceof CategoryCreateException) {
                throw error;
            }
            throw new CategoryCreateException(
                'Failed to update category.',
                CategoryCreateErrorCode.UPDATE_FAILED,
            );
        }
    }

    async handleDelete(id: string): Promise<Category> {
        try {
            return this.categoryFileList.delete(id);
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

    async handleCreate(category: Category): Promise<Category> {
        try {
            if (category.parentId) {
                this.findById(category.parentId)
                    .then((parent) => (category.parent = parent))
                    .catch((error) => {
                        throw error;
                    });
            }
            this.categoryList.create(category);
            return this.categoryFileList.create(category);
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

    async findById(id: string): Promise<Category> {
        const category: Category | undefined = this.categoryList.find(id);
        if (category) {
            return category;
        }
        throw new CategoryCreateException(
            'This Category does not exists',
            CategoryCreateErrorCode.NOT_FOUND,
        );
    }
}

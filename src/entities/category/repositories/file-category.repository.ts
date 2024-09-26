import * as path from 'path';
import * as fs from 'fs';
import { Category } from '../category';
import { Repository } from '../../repository';
import { CategoryCreateErrorCode, CategoryCreateException } from '../exceptions/category-create.exception';

export class FileCategoryRepository extends Repository<Category> {
    private static _path = path.join(__dirname, '../../../files/categories.json');
    private static _instance: FileCategoryRepository;

    private constructor(){
        super();
    }

    public static get instance(): FileCategoryRepository {
        if (!FileCategoryRepository._instance) {
            FileCategoryRepository._instance = new FileCategoryRepository();
        }
        return FileCategoryRepository._instance;
    }

    private static _readFile(): Category[] {
        try {
            if (!fs.existsSync(FileCategoryRepository._path)) {
                return [];
            }
            const data = fs.readFileSync(FileCategoryRepository._path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new CategoryCreateException('Failed to read file.', CategoryCreateErrorCode.FILE_READ_ERROR);
        }
    }

    private static _writeFile(categorys: Category[]): void {
        try {
            fs.writeFileSync(FileCategoryRepository._path, JSON.stringify(categorys, null, 2));
        } catch (error) {
            throw new CategoryCreateException('Failed to write file.', CategoryCreateErrorCode.FILE_WRITE_ERROR);
        }
    }

    create(body: Category): Category {
        try {
            const categorys = FileCategoryRepository._readFile();
            categorys.push(body);
            FileCategoryRepository._writeFile(categorys);
            return body;
        } catch (error) {
            throw new CategoryCreateException('Failed to create category.', CategoryCreateErrorCode.CREATE_FAILED);
        }
    }

    delete(id: string): Category {
        try {
            const categorys = FileCategoryRepository._readFile();
            const index = categorys.findIndex(category => category.id === id);
            if (index === -1) {
                throw new CategoryCreateException('Category not found.', CategoryCreateErrorCode.NOT_FOUND);
            }
            const [deletedCategory] = categorys.splice(index, 1);
            FileCategoryRepository._writeFile(categorys);
            return deletedCategory;
        } catch (error) {
            throw new CategoryCreateException('Failed to delete category.', CategoryCreateErrorCode.DELETE_FAILED);
        }
    }

    findAll(): Category[] {
        try {
            return FileCategoryRepository._readFile();
        } catch (error) {
            throw new CategoryCreateException('Failed to find categorys.', CategoryCreateErrorCode.FETCH_FAILED);
        }
    }

    update(id: string, body: Category): Category {
        try {
            const categorys = FileCategoryRepository._readFile();
            const index = categorys.findIndex(category => category.id === id);
            if (index === -1) {
                throw new CategoryCreateException('Category not found.', CategoryCreateErrorCode.NOT_FOUND);
            }
            categorys[index] = { ...categorys[index], ...body };
            FileCategoryRepository._writeFile(categorys);
            return categorys[index];
        } catch (error) {
            throw new CategoryCreateException('Failed to update category.', CategoryCreateErrorCode.UPDATE_FAILED);
        }
    }
}

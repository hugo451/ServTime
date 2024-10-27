import { stringCapitalize } from "../utils/string-capitalize";

export function controllerTemplate(entity: string): string { 
    return (
        `
        import { Controller } from '../controller';
        import { ${stringCapitalize(entity)} } from './${entity}';
        import { Create${stringCapitalize(entity)}Dto } from './dto/create-${entity}.dto';
        import {
            ${stringCapitalize(entity)}CreateErrorCode,
            ${stringCapitalize(entity)}CreateException,
        } from './exceptions/${entity}-create.exception';
        import { ${stringCapitalize(entity)}Factory } from './repositories/factory/${entity}.factory';
        import { File${stringCapitalize(entity)}Repository } from './repositories/file-${entity}.repository';
        import { ${stringCapitalize(entity)}List } from './repositories/in-memory-${entity}.repository';

        export class ${stringCapitalize(entity)}Controller extends Controller<
            ${stringCapitalize(entity)},
            Create${stringCapitalize(entity)}Dto
        > {
            private memoryRepository: ${stringCapitalize(entity)}List;
            private fileRepository: File${stringCapitalize(entity)}Repository;

            constructor() {
                super();
                const repositories = ${stringCapitalize(entity)}Factory.createRepositories();
                this.fileRepository = repositories.file;
                this.memoryRepository = repositories.memory;

                const list = this.fileRepository.findAll();
                this.memoryRepository.init(list);
            }

            protected get entity(): string {
                return '${entity}';
            }

            protected get dto(): new () => Create${stringCapitalize(entity)}Dto {
                return Create${stringCapitalize(entity)}Dto;
            }

            async handleGetAll(): Promise<${stringCapitalize(entity)}[]> {
                try {
                    let list = this.memoryRepository.findAll();
                    if (list.length === 0) {
                        list = this.fileRepository.findAll();
                        this.memoryRepository.init(list);
                    }
                    return list;
                } catch (error) {
                    if (error instanceof ${stringCapitalize(entity)}CreateException) {
                        throw error;
                    }
                    throw new ${stringCapitalize(entity)}CreateException(
                        'Failed to get all ${entity}s.',
                        ${stringCapitalize(entity)}CreateErrorCode.FETCH_FAILED,
                    );
                }
            }

            async handleUpdate(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
                try {
                    return this.fileRepository.update(${entity}.id, ${entity});
                } catch (error) {
                    if (error instanceof ${stringCapitalize(entity)}CreateException) {
                        throw error;
                    }
                    throw new ${stringCapitalize(entity)}CreateException(
                        'Failed to update ${entity}.',
                        ${stringCapitalize(entity)}CreateErrorCode.UPDATE_FAILED,
                    );
                }
            }

            async handleDelete(id: string): Promise<${stringCapitalize(entity)}> {
                try {
                    return this.fileRepository.delete(id);
                } catch (error) {
                    if (error instanceof ${stringCapitalize(entity)}CreateException) {
                        throw error;
                    }
                    throw new ${stringCapitalize(entity)}CreateException(
                        'Failed to delete ${entity}.',
                        ${stringCapitalize(entity)}CreateErrorCode.DELETE_FAILED,
                    );
                }
            }

            async handleCreate(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
                try {
                    this.memoryRepository.create(${entity});
                    return this.fileRepository.create(${entity});
                } catch (error) {
                    if (error instanceof ${stringCapitalize(entity)}CreateException) {
                        throw error;
                    }
                    throw new ${stringCapitalize(entity)}CreateException(
                        'Failed to create ${entity}.',
                        ${stringCapitalize(entity)}CreateErrorCode.CREATE_FAILED,
                    );
                }
            }

            async findById(id: string): Promise<${stringCapitalize(entity)}> {
                const ${entity}: ${stringCapitalize(entity)} | undefined = this.memoryRepository.find(id);
                if (${entity}) {
                    return ${entity};
                }
                throw new ${stringCapitalize(entity)}CreateException(
                    'This ${stringCapitalize(entity)} does not exists',
                    ${stringCapitalize(entity)}CreateErrorCode.NOT_FOUND,
                );
            }
        }
        `
    );
}


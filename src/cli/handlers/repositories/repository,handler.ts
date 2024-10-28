// src/cli/handlers/repository-handler.ts

import { BaseHandler } from '../base.handler';
import { createFileWithDirectory } from '../../utils/create-file-with-directory';
import {
    fileRepositoryTemplate,
    inMemoryRepositoryTemplate,
} from '../../templates/repository.template';

export class RepositoryHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'repository' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating repositories for ${entityName}...`);

        // Criando repositório in-memory
        const inMemoryContent = inMemoryRepositoryTemplate(entityName);
        const inMemoryFileName = `in-memory-${entityName}.repository.ts`;
        await createFileWithDirectory(
            `${entityName}/repositories`,
            inMemoryFileName,
            inMemoryContent,
        );

        // Criando repositório file
        const fileContent = fileRepositoryTemplate(entityName);
        const fileFileName = `file-${entityName}.repository.ts`;
        await createFileWithDirectory(
            `${entityName}/repositories`,
            fileFileName,
            fileContent,
        );
    }
}

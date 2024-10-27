// src/cli/handlers/entity-handler.ts

import { BaseHandler } from './base.handler';
import { createFileWithDirectory } from '../utils/create-file-with-directory';
import { entityTemplate } from '../templates/entity.template';

export class EntityHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'entity' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating entity for ${entityName}...`);

        // Gerando o conteúdo da entidade
        const entityContent = entityTemplate(entityName);

        // Nome do arquivo da entidade
        const entityFileName = `${entityName.toLowerCase()}.ts`;

        // Criando o arquivo da entidade usando o utilitário
        await createFileWithDirectory(entityName, entityFileName, entityContent);
    }
}

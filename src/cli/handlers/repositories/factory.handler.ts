// src/cli/handlers/factory-handler.ts

import { BaseHandler } from '../base.handler';
import { createFileWithDirectory } from '../../utils/create-file-with-directory';
import { factoryTemplate } from '../../templates/factory.template';

export class FactoryHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'repository' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating factory for ${entityName}...`);

        // Gerando o conteúdo da fábrica
        const factoryContent = factoryTemplate(entityName);

        // Nome do arquivo da fábrica
        const factoryFileName = `${entityName}.factory.ts`;

        // Criando o arquivo da fábrica na pasta correta
        await createFileWithDirectory(
            `${entityName}/repositories/factory`,
            factoryFileName,
            factoryContent,
        );
    }
}

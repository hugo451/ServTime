// src/cli/handlers/dto-handler.ts

import { BaseHandler } from './base.handler';
import { createFileWithDirectory } from '../utils/create-file-with-directory';
import { dtoTemplate } from '../templates/dto.template';

export class DtoHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'dto' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating DTO for ${entityName}...`);

        // Gerando o conteúdo do DTO
        const dtoContent = dtoTemplate(entityName);

        // Nome do arquivo do DTO
        const dtoFileName = `create-${entityName.toLowerCase()}.dto.ts`;

        // Criando o arquivo do DTO usando o utilitário
        await createFileWithDirectory(
            `${entityName}/dto`,
            dtoFileName,
            dtoContent,
        );
    }
}

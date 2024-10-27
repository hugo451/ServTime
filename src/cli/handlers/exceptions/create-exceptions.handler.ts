// src/cli/handlers/create-exception-handler.ts

import { BaseHandler } from '../base.handler';
import { createFileWithDirectory } from '../../utils/create-file-with-directory';
import { createExceptionTemplate } from '../../templates/create-exception.template';

export class CreateExceptionHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'create-exception' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating create exception for ${entityName}...`);

        // Gerando o conteúdo da exceção
        const exceptionContent = createExceptionTemplate(entityName);

        // Nome do arquivo da exceção
        const exceptionFileName = `${entityName}-create.exception.ts`;

        // Criando o arquivo da exceção na pasta correta
        await createFileWithDirectory(`${entityName}/exceptions`, exceptionFileName, exceptionContent);
    }
}

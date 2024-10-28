import { BaseHandler } from './base.handler';
import { controllerTemplate } from '../templates/controller.template';
import { createFileWithDirectory } from '../utils/create-file-with-directory';

export class ControllerHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'controller' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating controller for ${entityName}...`);

        // Gerando o conteúdo do controlador
        const controllerContent = controllerTemplate(entityName);

        // Nome do arquivo do controlador
        const controllerFileName = `${entityName}.controller.ts`;

        // Criando o arquivo do controlador usando o utilitário
        await createFileWithDirectory(
            entityName,
            controllerFileName,
            controllerContent,
        );
    }
}

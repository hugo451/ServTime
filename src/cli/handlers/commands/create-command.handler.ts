import { BaseHandler } from '../base.handler';
import { createFileWithDirectory } from '../../utils/create-file-with-directory';
import {
    createCommandTemplate,
    deleteCommandTemplate,
    getAllCommandTemplate,
    updateCommandTemplate
} from '../../templates/command.template';

export class CommandHandler extends BaseHandler {
    protected shouldHandle(command: string): boolean {
        return command === 'command' || command === 'module';
    }

    protected async execute(entityName: string): Promise<void> {
        console.log(`Creating commands for ${entityName}...`);

        const commands = [
            {
                template: createCommandTemplate,
                name: 'create'
            },
            {
                template: deleteCommandTemplate,
                name: 'delete'
            },
            {
                template: getAllCommandTemplate,
                name: 'get-all'
            },
            {
                template: updateCommandTemplate,
                name: 'update'
            }
        ];

        commands.forEach(async (command) => {

            const commandContent = command.template(entityName);
            const commandFileName = `${command.name}-${entityName}.command.ts`;
            await createFileWithDirectory(
                `${entityName}/commands`,
                commandFileName,
                commandContent,
            );
        });
    }
}

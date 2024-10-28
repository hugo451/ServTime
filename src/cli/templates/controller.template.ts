import { stringCapitalize } from '../utils/string-capitalize';

export function controllerTemplate(entity: string): string {
    return `
        import { Controller } from '../controller';
        import { Create${stringCapitalize(entity)}Dto } from './dto/create-${entity}.dto';
        import { ${stringCapitalize(entity)} } from './${entity}';
        import { ${stringCapitalize(entity)}Factory } from './repositories/factory/${entity}.factory';
        import { GetAll${stringCapitalize(entity)}sCommand } from './commands/get-all-${entity}.command';
        import { Create${stringCapitalize(entity)}Command } from './commands/create-${entity}.command';
        import { Update${stringCapitalize(entity)}Command } from './commands/update-${entity}.command';
        import { Delete${stringCapitalize(entity)}Command } from './commands/delete-${entity}.command';

        export class ${stringCapitalize(entity)}Controller extends Controller<${stringCapitalize(entity)}, Create${stringCapitalize(entity)}Dto> {
            private getAll${stringCapitalize(entity)}sCommand: GetAll${stringCapitalize(entity)}sCommand;
            private create${stringCapitalize(entity)}Command: Create${stringCapitalize(entity)}Command;
            private update${stringCapitalize(entity)}Command: Update${stringCapitalize(entity)}Command;
            private delete${stringCapitalize(entity)}Command: Delete${stringCapitalize(entity)}Command;

            constructor() {
                super();
                const { memory, file } = ${stringCapitalize(entity)}Factory.createRepositories();
                this.getAll${stringCapitalize(entity)}sCommand = new GetAll${stringCapitalize(entity)}sCommand(memory, file);
                this.create${stringCapitalize(entity)}Command = new Create${stringCapitalize(entity)}Command(memory, file);
                this.update${stringCapitalize(entity)}Command = new Update${stringCapitalize(entity)}Command(memory, file);
                this.delete${stringCapitalize(entity)}Command = new Delete${stringCapitalize(entity)}Command(memory, file);
            }

            protected get dto(): new () => Create${stringCapitalize(entity)}Dto {
                return Create${stringCapitalize(entity)}Dto;
            }

            protected get entity(): string {
                return '${entity}';
            }

            async handleGetAll(): Promise<${stringCapitalize(entity)}[]> {
                return this.getAll${stringCapitalize(entity)}sCommand.execute();
            }

            async handleCreate(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
                return this.create${stringCapitalize(entity)}Command.execute(${entity});
            }

            async handleUpdate(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
                return this.update${stringCapitalize(entity)}Command.execute(${entity});
            }

            async handleDelete(id: string): Promise<${stringCapitalize(entity)}> {
                return this.delete${stringCapitalize(entity)}Command.execute(id);
            }
        }
        `;
}

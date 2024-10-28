import { stringCapitalize } from '../../utils/string-capitalize';

export function updateCommandTemplate(entity: string): string {
    return `
        import { Command } from '../../../command';
        import { ${stringCapitalize(entity)} } from '../${entity}';
        import { ${stringCapitalize(entity)}List } from '../repositories/in-memory-${entity}.repository';
        import { File${stringCapitalize(entity)}Repository } from '../repositories/file-${entity}.repository';
        import { ${stringCapitalize(entity)}CreateException, ${stringCapitalize(entity)}CreateErrorCode } from '../exceptions/${entity}-create.exception';

        export class Update${stringCapitalize(entity)}Command implements Command<${stringCapitalize(entity)}, ${stringCapitalize(entity)}> {
            private memoryRepository: ${stringCapitalize(entity)}List;
            private fileRepository: File${stringCapitalize(entity)}Repository;

            constructor(memoryRepository: ${stringCapitalize(entity)}List, fileRepository: File${stringCapitalize(entity)}Repository) {
                this.memoryRepository = memoryRepository;
                this.fileRepository = fileRepository;
            }

            async execute(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
                try {
                    this.memoryRepository.update(${entity}.id, ${entity});
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
        }
        `;
}

import { stringCapitalize } from '../../utils/string-capitalize';

export function createCommandTemplate(entity: string): string {
    return `
        import { Command } from '../../../command';
        import { ${stringCapitalize(entity)} } from '../${entity}';
        import { ${stringCapitalize(entity)}List } from '../repositories/in-memory-${entity}.repository';
        import { File${stringCapitalize(entity)}Repository } from '../repositories/file-${entity}.repository';
        import { ${stringCapitalize(entity)}CreateException, ${stringCapitalize(entity)}CreateErrorCode } from '../exceptions/${entity}-create.exception';

        export class Create${stringCapitalize(entity)}Command implements Command<${stringCapitalize(entity)}, ${stringCapitalize(entity)}> {
            private memoryRepository: ${stringCapitalize(entity)}List;
            private fileRepository: File${stringCapitalize(entity)}Repository;

            constructor(memoryRepository: ${stringCapitalize(entity)}List, fileRepository: File${stringCapitalize(entity)}Repository) {
                this.memoryRepository = memoryRepository;
                this.fileRepository = fileRepository;
            }

            async execute(${entity}: ${stringCapitalize(entity)}): Promise<${stringCapitalize(entity)}> {
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
        }
        `;
}

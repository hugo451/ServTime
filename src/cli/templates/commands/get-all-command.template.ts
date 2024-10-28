import { stringCapitalize } from '../../utils/string-capitalize';

export function getAllCommandTemplate(entity: string): string {
    return `
        import { Command } from '../../../command';
        import { ${stringCapitalize(entity)} } from '../${entity}';
        import { ${stringCapitalize(entity)}List } from '../repositories/in-memory-${entity}.repository';
        import { File${stringCapitalize(entity)}Repository } from '../repositories/file-${entity}.repository';
        import { ${stringCapitalize(entity)}CreateException, ${stringCapitalize(entity)}CreateErrorCode } from '../exceptions/${entity}-create.exception';

        export class GetAll${stringCapitalize(entity)}sCommand implements Command<void, ${stringCapitalize(entity)}[]> {
            private memoryRepository: ${stringCapitalize(entity)}List;
            private fileRepository: File${stringCapitalize(entity)}Repository;

            constructor(memoryRepository: ${stringCapitalize(entity)}List, fileRepository: File${stringCapitalize(entity)}Repository) {
                this.memoryRepository = memoryRepository;
                this.fileRepository = fileRepository;
            }

            async execute(): Promise<${stringCapitalize(entity)}[]> {
                try {
                    let list = this.memoryRepository.findAll();
                    if (list.length === 0) {
                        list = this.fileRepository.findAll();
                        this.memoryRepository.init(list);
                    }
                    return list;
                } catch (error) {
                    if (error instanceof ${stringCapitalize(entity)}CreateException) {
                        throw error;
                    }
                    throw new ${stringCapitalize(entity)}CreateException(
                        'Failed to get all ${entity}s.',
                        ${stringCapitalize(entity)}CreateErrorCode.FETCH_FAILED,
                    );
                }
            }
        }
        `;
}

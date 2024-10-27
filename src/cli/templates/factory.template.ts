import { stringCapitalize } from '../utils/string-capitalize';

export function factoryTemplate(entity: string): string {
    return `
    import { File${stringCapitalize(entity)}Repository } from '../file-entity.repository';
    import { ${stringCapitalize(entity)}List } from '../in-memory-entity.repository';

    export class ${stringCapitalize(entity)}Factory {
        static createRepositories() {
            return {
                memory: ${stringCapitalize(entity)}List.instance,
                file: File${stringCapitalize(entity)}Repository.instance,
            };
        }
    }
    `;
}

import { stringCapitalize } from "../utils/string-capitalize";

export function entityTemplate(entity: string): string {
    return (
    `import { UUID } from 'crypto';

    export interface ${stringCapitalize(entity)} {
        id: UUID;
    }`
    );
}
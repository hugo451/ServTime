import { stringCapitalize } from '../utils/string-capitalize';

export function dtoTemplate(entity: string): string {
    return `
        import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
        import { UUID } from 'crypto';

        export class Create${stringCapitalize(entity)}Dto {
            @IsUUID()
            id!: UUID;
        }
        `;
}

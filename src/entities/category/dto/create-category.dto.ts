import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { UUID } from 'crypto';

export class CreateCategoryDto {
    @IsUUID()
    id!: UUID;

    @IsString()
    @Length(3, 50)
    category!: string;

    @IsUUID()
    @IsOptional()
    parentId?: UUID;
}

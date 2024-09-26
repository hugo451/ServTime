import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
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

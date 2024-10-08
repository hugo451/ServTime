import { IsString, IsUUID, Length, Matches } from 'class-validator';
import { UUID } from 'crypto';

export class CreateServiceDto {
    @IsUUID()
    serviceid!: UUID;

    @IsString()
    @Length(3, 50)
    name!: string;

    @IsString()
    type!: string;

    @IsString()
    description!: string;

    // verifica se o preço é um número e se é maior que 0
    @Matches(/^[0-9]*$/)
    price!: number;

    @IsUUID()
    category!: UUID;
}

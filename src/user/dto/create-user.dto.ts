import { IsString, IsUUID, IsEmail, Length, Matches } from 'class-validator';
import { UUID } from 'crypto';

const loginRegex = /^[a-zA-Z]*$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

export class CreateUserDto {
    @IsUUID()
    id!: UUID;

    @IsString()
    @Length(1, 12)
    @Matches(loginRegex, { message: 'Username cannot contain numbers and must be less than 13 characters.' })
    username!: string;

    @IsString()
    @Length(8, 64)
    @Matches(passwordRegex, { message: 'Password must be between 8 and 64 characters long and include at least one uppercase letter, one lowercase letter, and one digit.' })
    password!: string;

    @IsString()
    name!: string;

    @IsString()
    adress!: string;

    @IsString()
    phone!: string;

    @IsEmail()
    mail!: string;
}

import { IsEmail, IsString } from 'class-validator';

export class signinUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

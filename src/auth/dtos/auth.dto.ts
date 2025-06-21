import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SigninDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SentEmailDTO {
  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  sender?: string | Address;

  @IsNotEmpty()
  recepients: (string | Address)[];

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  hr?: string;

  @IsOptional()
  @IsString()
  closure?: string;
}

import {
  IsString,
  IsEnum,
  IsNotEmpty,
  Matches,
  IsOptional,
} from 'class-validator';
import { Role } from '../schemas/user.schema';
import { ObjectId, Types } from 'mongoose';

export class CreateUserDto {
  employID: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsString()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'nID must be exactly 10 digits',
  })
  email: string;

  isDeleted: boolean;

  deleteDate?: Date;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

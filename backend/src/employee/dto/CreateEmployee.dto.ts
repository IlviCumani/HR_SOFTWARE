import {
  IsNotEmpty,
  IsString,
  IsEnum,
  Matches,
  IsArray,
  IsOptional,
  IsDate,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { EmploymentStatus, Position } from '../schema/employe.schema';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]\d{8}[A-Z]$/, { message: 'nID must be exactly 10 digits' })
  nID: string;

  @IsEnum(Position)
  position: Position;

  @IsEnum(EmploymentStatus)
  status: EmploymentStatus;

  @Type(() => Date)
  @IsDate()
  startingDate?: Date;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  salary: number;

  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @IsOptional()
  birthDay: Date;

  fullName: string;

  @IsEnum(['Female', 'Male'], {
    message: 'Must be one of the following gender',
  })
  gender?: string;

  @IsArray()
  @IsOptional()
  teamLeaders?: Types.ObjectId[];

  @IsOptional()
  @IsString()
  contract?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;
}

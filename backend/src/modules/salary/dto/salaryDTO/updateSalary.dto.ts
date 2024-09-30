import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { UpdateBonusDTO } from '../bonusDTO/updateBonus.dto';
import { Types } from 'mongoose';

export class UpdateSalaryDTO {
  @IsOptional()
  @Type(() => Types.ObjectId)
  employeeID: Types.ObjectId;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTaken?: Date;

  @IsOptional()
  @IsNumber()
  netSalary: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(30)
  workDays: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateBonusDTO)
  bonuses: UpdateBonusDTO[];

  @IsOptional()
  @IsNumber()
  socialSecurityContributions: number;

  @IsOptional()
  @IsNumber()
  healthInsurance: number;

  @IsOptional()
  @IsNumber()
  grossSalary: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  healthInsuranceCompany: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  socialInsuranceCompany: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly incomeTax: number;

  @IsOptional()
  @IsBoolean()
  paid: boolean;
}

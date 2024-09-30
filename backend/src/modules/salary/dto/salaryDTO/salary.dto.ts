import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { BonusDTO } from '../bonusDTO/createBonus.dto';
import { Types } from 'mongoose';

export class SalaryDTO {
  @IsNotEmpty()
  @IsMongoId()
  readonly employeeID: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly dateTaken: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly netSalary: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(22)
  readonly workDays: number;

  @ValidateNested({ each: true })
  @Type(() => BonusDTO)
  readonly bonuses?: BonusDTO[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly incomeTax: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly socialSecurityContributions: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly healthInsurance: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly healthInsuranceCompany: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly socialInsuranceCompany: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly grossSalary: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly total: number;

  @IsBoolean()
  readonly paid?: boolean;

  isDeleted: boolean;
  deleteDate?: Date;
}

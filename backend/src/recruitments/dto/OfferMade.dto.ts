import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ContractTypes } from '../schemas/recruitment.schema';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

export class OfferMadeDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly offeredSalary: number;

  @IsNotEmpty()
  @IsEnum(ContractTypes, {
    message: 'Contract type must be one of the defined enum values.',
  })
  readonly contractType: ContractTypes;

  @Expose()
  @IsNotEmpty()
  @Type(() => Date)
  readonly startDate: Date;
}

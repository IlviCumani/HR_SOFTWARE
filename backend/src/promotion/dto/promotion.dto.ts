import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import { Position } from 'src/employee/schema/employe.schema';

export class PromotionDto {
  @IsNotEmpty()
  @IsString()
  trainedBy: string;

  @IsNotEmpty()
  @IsDateString()
  promotionDate: string;
  @IsNotEmpty()
  @IsNumber()
  newWage: number;

  @IsNotEmpty()
  @IsEnum(Position)
  newPosition: Position;
}

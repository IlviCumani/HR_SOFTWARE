import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { InventoryStatus } from '../schemas/Inventory.schema';

export class CreateInventoryDto {
  @IsString()
  assetName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  assetCodes: string[];

  @IsEnum(InventoryStatus)
  @IsOptional()
  status?: InventoryStatus;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  deleteDate?: Date;
}

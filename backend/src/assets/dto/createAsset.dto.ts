import { IsString, IsNotEmpty, IsBoolean, IsOptional, ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateAssetDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  assetName: string[];

  quantity?: number;
  reserved?: number;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  deleteDate?: Date;
}

import { IsString } from 'class-validator';

export class UpdateAssetDto {
  @IsString()
  assetType?: string;
}

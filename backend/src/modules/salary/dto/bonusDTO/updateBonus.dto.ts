import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateBonusDTO {
  @IsOptional()
  @IsString()
  readonly desc: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly amount: number;
}

import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class BonusDTO {
  @IsNotEmpty()
  @IsString()
  readonly desc: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly amount: number;
}

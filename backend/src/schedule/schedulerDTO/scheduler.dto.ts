import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class SchedulerDTO {
  @Type(() => Date)
  @IsDate()
  readonly startDate: Date;
  @Type(() => Date)
  @IsDate()
  readonly endDate: Date;
  @IsString()
  readonly step: string;
  @IsOptional()
  @IsString()
  readonly jobName?: string;
  readonly task?: () => void;
}

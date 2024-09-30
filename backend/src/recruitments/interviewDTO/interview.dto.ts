import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecruitmentStage } from '../schemas/recruitment.schema';
export enum Evaluation {
  Negative = 'Negative',
  NotSure = 'Not Sure',
  OK = 'OK',
  Positive = 'Positive',
}

export class InterviewDTO {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(RecruitmentStage)
  stage: RecruitmentStage;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  evaluation?: Evaluation;

  @IsOptional()
  @IsMongoId({ each: true })
  interviewers?: string[];

  @IsOptional()
  @IsBoolean()
  notified?: boolean;
}

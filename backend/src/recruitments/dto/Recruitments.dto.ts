import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { RecruitmentStage } from '../schemas/recruitment.schema';
import { InterviewDTO } from '../interviewDTO/interview.dto';
import { Type } from 'class-transformer';
import { OfferMadeDTO } from './OfferMade.dto';
import { Types } from 'mongoose';

export class CreateRecruitmentDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly position: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  readonly surname: string;

  @IsNotEmpty()
  @IsEnum(RecruitmentStage, {
    message:
      'Stage must be one of the following: Applied, Rejected, 1st Interview, 2nd Interview, Offer Made',
  })
  readonly stage: RecruitmentStage;

  @IsOptional()
  @Type(() => InterviewDTO)
  readonly firstInterview?: InterviewDTO;

  @IsOptional()
  @Type(() => InterviewDTO)
  readonly secondInterview?: InterviewDTO;

  @IsOptional()
  @Type(() => OfferMadeDTO)
  readonly offerMade?: OfferMadeDTO;

  @IsOptional()
  @IsString()
  readonly reference?: string;

  @IsOptional()
  @IsString()
  readonly cv?: string;

  @IsOptional()
  @Type(() => Date)
  readonly submittedDate?: Date;

  @IsOptional()
  @IsBoolean()
  readonly isDeleted?: boolean;

  @IsOptional()
  @IsString()
  readonly rejectReason?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly deleteDate?: Date;

  @IsOptional()
  @IsMongoId({ message: 'Invalid MongoDB ObjectId format' })
  readonly eventID?: Types.ObjectId;
}

export class RecruitmentWithFileDto extends CreateRecruitmentDto {
  file?: {
    filename: string;
    data: string;
  };
}

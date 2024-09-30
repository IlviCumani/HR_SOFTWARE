import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AssignEmployeeDto {
  @IsString()
  joinEmployee: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  eventParticipants?: Types.ObjectId[];
}

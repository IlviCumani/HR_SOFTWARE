import { IsArray, IsOptional } from 'class-validator';
import { Status } from '../schema/events.schema';

export class UpdateEventDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  startTime: Date;

  @IsOptional()
  endTime: Date;

  @IsOptional()
  location: string;

  @IsOptional()
  progress: string;

  @IsOptional()
  status: Status;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;

  @IsOptional()
  locationId: string;

  @IsOptional()
  creatorId: string;

  @IsOptional()
  @IsArray()
  invitees: string[];
}

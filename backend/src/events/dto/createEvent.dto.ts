import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsOptional()
  eventDescription?: string;

  @IsDateString()
  eventDate: Date;

  @IsDateString()
  @IsOptional()
  eventEndDate?: Date;

  @IsString()
  @IsNotEmpty()
  eventStartTime: string;

  @IsString()
  @IsOptional()
  eventEndTime?: string;

  @IsOptional()
  location?: {
    position?: {
      lat?: number;
      lng?: number;
    };

    address?: string;
    name?: string;
  };

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @IsDateString()
  @IsOptional()
  deleteDate?: Date;
}

import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';
import { NotificationStatus } from '../notification.schema';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  reminderTitle?: string;

  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  userId: Types.ObjectId;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  path: string;
}

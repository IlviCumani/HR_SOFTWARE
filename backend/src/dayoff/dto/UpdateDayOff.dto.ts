import { IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class UpdateDayOffDto {
  @IsNotEmpty()
  employeeId?: string;

  @IsNotEmpty()
  @IsDateString()
  StartTime?: Date;

  @IsDateString()
  EndTime?: Date;

  @IsEnum(['annual', 'sick', 'other'], {
    message: 'Leave type must be one of the following: annual,sick,other',
  })
  leaveType?: string;

  description?: string;
}

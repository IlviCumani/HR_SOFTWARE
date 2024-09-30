import { IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateDayOffDto {
  @IsNotEmpty()
  employeeId: string;

  EmployeeName: string;

  @IsNotEmpty()
  @IsDateString()
  StartTime: Date;

  @IsOptional()
  @IsDateString()
  EndTime?: Date;

  @IsEnum(['annual', 'sick', 'other'], {
    message: 'Leave type must be one of the following: annual,sick,other',
  })
  leaveType: string;

  description: string;

  @IsOptional()
  totalDays?: number;

  isDeleted: boolean;
  deleteDate?: Date;

  isApproved: boolean;
  approvedDate?: Date;
}

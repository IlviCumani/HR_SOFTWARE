import { IsEnum, IsOptional, IsString } from 'class-validator';
import { InventoryStatus } from '../schemas/Inventory.schema';

export class AssignEmployeeDto {
  @IsString()
  employeeDetails?: string;

  @IsString()
  assignDate?: string;

  @IsEnum(InventoryStatus)
  @IsOptional()
  status: InventoryStatus.Assigned;
}

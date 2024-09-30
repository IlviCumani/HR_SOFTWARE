import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SalaryDTO } from './salary.dto';

export class EmployeeDetailsDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly surname: string;
}

export class ExportSalaryDTO extends SalaryDTO {
  @ValidateNested()
  @Type(() => EmployeeDetailsDTO)
  readonly employeeDetails: EmployeeDetailsDTO;
}

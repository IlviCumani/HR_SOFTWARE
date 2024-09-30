import { Employee } from 'src/employee/schema/employe.schema';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ValidationPipe,
  UsePipes,
  HttpException,
  Patch,
  Query,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EmployeeService } from './employe.service';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import mongoose from 'mongoose';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}
  private readonly logger = new Logger(EmployeeController.name);

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('team-leaders')
  async getTeamLeaders(): Promise<Employee[]> {
    return this.employeeService.getTeamLeaders();
  }

  @Get('/status-length')
  async findStatusLength(): Promise<Employee[]> {
    return this.employeeService.findStatusLength();
  }

  @Get('organizational-tree')
  async getEmployeesAndTeamLeaders(): Promise<Employee[]> {
    return this.employeeService.getEmployeesAndTeamLeaders();
  }

  @Get('/search')
  async search(
    @Query('name') name?: string,
    @Query('surname') surname?: string,
  ) {
    try {
      const result = await this.employeeService.searchEmployee(name, surname);
      if (!result) {
        throw new NotFoundException(
          'No employees found matching the given criteria.',
        );
      }
      return result;
    } catch (error) {
      throw new NotFoundException(
        error.message || 'An error occurred while searching for employees.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const employee = this.employeeService.findOne(id);
    return employee;
  }

  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: any,
  ): Promise<Employee | null> {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  async softDeleteEmployById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Invalid ID', 404);
    const result = await this.employeeService.delete(id);
    if (!result) {
      throw new HttpException('No employe found for the given ID', 404);
    }

    return result;
  }

  @Post('interviewers')
  findByIds(@Body('ids') ids: string[]) {
    console.log('Raw query parameter ids:');
    this.logger.log('Entering findByIds method');
    if (!ids) {
      throw new BadRequestException('No IDs provided');
    }
    const idList = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    console.log('Processed idList:', idList);
    return this.employeeService.findByIds(idList);
  }
}

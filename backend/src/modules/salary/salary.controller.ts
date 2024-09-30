import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  Patch,
  NotFoundException,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { SalaryService } from './services/salary.service';
import { SalaryDTO } from './dto/salaryDTO/salary.dto';
import { UpdateSalaryDTO } from './dto/salaryDTO/updateSalary.dto';
import { Types } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PayrollService } from './services/payroll.service';
import { Payroll } from './dto/PayrollDTO/payroll.dto';
import { SchedulerService } from 'src/schedule/scheduler.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Controller('salary')
export class SalaryController {
  constructor(
    private readonly salaryService: SalaryService,
    private readonly payrollService: PayrollService,
    private readonly scheduler: SchedulerService,
  ) {}
  @Post()
  async create(@Body() salaryDTO: SalaryDTO) {
    const dto = plainToClass(SalaryDTO, salaryDTO);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return await this.salaryService.create(dto);
  }

  @Get()
  async getAllNew(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('employeeID') employeeID: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('name') name?: string,
  ) {
    const pageNumber = parseInt(page.toString(), 10);
    const limitNumber = parseInt(limit.toString(), 10);
    const filter = { startDate, endDate, name };
    return await this.salaryService.getSalariesWithEmployeeInfo(
      pageNumber,
      limitNumber,
      employeeID,
      req.user.role,
      filter,
    );
  }
  @Patch(':salaryID')
  async updateSalary(
    @Param('salaryID') salaryID: Types.ObjectId,
    @Body() updateSalaryDto: UpdateSalaryDTO,
  ) {
    const dto = plainToClass(UpdateSalaryDTO, updateSalaryDto);
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return await this.salaryService.updateSalary(salaryID, dto);
  }
  @Delete(':userId')
  async deleteSalary(@Param('userId') userId: string) {
    return await this.salaryService.softDeleteSalaryById(userId);
  }
  @Get('net-salary')
  async netSalary(
    @Query('grossSalary') grossSalary: number,
    @Query('workDays') workDays: number = 22,
  ): Promise<Payroll> {
    const res = this.payrollService.calculateNetSalary(grossSalary, workDays);
    return res;
  }
  @Post('schedule')
  async handleCron(
    @Body('startDate') startDateStr: string,
    @Body('endDate') endDateStr: string,
    @Body('step') step: string,
  ) {
    try {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format.');
      }

      if (startDate >= endDate) {
        throw new Error('Start date must be before end date.');
      }

      const task = async () => this.salaryService.createSalariesPerMonth();
      const jobName = 'salary-job';

      this.scheduler.scheduleJob({
        startDate,
        endDate,
        step,
        jobName,
        task,
      });

      return { message: `Job '${jobName}' scheduled successfully.` };
    } catch (error) {
      return { message: `Error scheduling job: ${error.message}` };
    }
  }
  @Get('chart')
  async getChartData(@Query('id') id: string) {
    try {
      const objectId = new Types.ObjectId(id);
      const data = await this.salaryService.getTotalBonusesPerMonth(objectId);
      return data;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Invalid ID format');
      }
      throw new NotFoundException('Data not found or an error occurred');
    }
  }
  @Post('compensate')
  async compensateEmployees() {
    try {
      await this.salaryService.compensateEmployees();
      return {
        message: 'Employees compensated successfully for the current month.',
      };
    } catch (error) {
      throw new HttpException(
        'Failed to compensate employees',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

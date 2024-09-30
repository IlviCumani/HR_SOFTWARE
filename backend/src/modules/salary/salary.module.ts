import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './services/salary.service';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Salary, SalarySchema } from './schema/salary.schema';
import { ScheduleService } from './services/shedule.service';
import { EmployeeModule } from 'src/employee/employe.module';
import { PayrollService } from './services/payroll.service';
import { SchedulerModule } from 'src/schedule/scheduler.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    EmployeeModule,
    SchedulerModule,
  ],
  controllers: [SalaryController],
  providers: [SalaryService, ScheduleService, PayrollService],
})
export class SalaryModule {}

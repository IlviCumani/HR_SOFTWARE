import { Injectable, Logger } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { SchedulerService } from 'src/schedule/scheduler.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly salaryService: SalaryService) {}

  //  @Cron(CronExpression.EVERY_5_MINUTES, {name : "Salary CronS"})
  // async handleCron() {
  //   this.logger.debug('Clearing bonuses for testing');
  //   await this.salaryService.createSalariesPerMonth();
  // }
}

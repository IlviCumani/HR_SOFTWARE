import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Cron } from '@nestjs/schedule';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}
  private readonly logger = new Logger(SchedulerController.name);
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

      // const task = async () => this.schedulerService.devLog();
      const jobName = 'devLog-job';

      // this.schedulerService.scheduleJob({
      //   startDate,
      //   endDate,
      //   step,
      //   jobName,
      //   // task,
      // });

      return { message: `Job '${jobName}' scheduled successfully.` };
    } catch (error) {
      return { message: `Error scheduling job: ${error.message}` };
    }
  }

  @Post('stop/:jobName')
  stopJob(@Param('jobName') jobName: string): string {
    this.schedulerService.stopJob(jobName);
    return `Job ${jobName} stopped successfully.`;
  }

  @Post('reschedule/:jobName')
  rescheduleJob(
    @Param('jobName') jobName: string,
    @Body('newCronExpression') newCronExpression: string,
  ): string {
    this.schedulerService.rescheduleJob(jobName, newCronExpression);
    return `Job ${jobName} rescheduled to "${newCronExpression}" successfully.`;
  }

  // @Get('jobs')
  // getAllJobs() {
  //   return this.schedulerService.getCrons();
  // }

  // @Get('job/:jobName')
  // getJob(@Param('jobName') jobName: string) {
  //   return this.schedulerService.getJob(jobName);
  // }

  // @Cron('45 * * * * *')
  // handleCroner() {
  //   this.logger.debug('Called when the current second is 45');
  // }
}

import {
  BadRequestException,
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { GmailApiService } from './gmail-api.service';
import { SchedulerDTO } from 'src/schedule/schedulerDTO/scheduler.dto';
import { SchedulerService } from 'src/schedule/scheduler.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/users/schemas/user.schema';

@Roles([Role.HR, Role.CEO])
@Controller('gmail-api')
export class GmailApiController {
  constructor(
    private readonly gmailService: GmailApiService,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Post('schedule-fetch')
  async scheduleEmailFetch(
    @Body() schedulerDTO: SchedulerDTO,
    @Body('subjectFilter') subjectFilter: string | null,
  ) {
    try {
      if (
        !schedulerDTO.startDate ||
        !schedulerDTO.endDate ||
        !schedulerDTO.step
      ) {
        throw new BadRequestException(
          'startDate, endDate, and step are required.',
        );
      }

      const startDateObj = new Date(schedulerDTO.startDate);
      const endDateObj = new Date(schedulerDTO.endDate);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new BadRequestException('Invalid date format.');
      }

      const task = async () => {
        console.log('test');
      };
      // this.gmailService.fetchAndSaveEmails(
      //   subjectFilter,
      //   startDateObj.toISOString(),
      // );

      const jobName = `gmail-fetch`;

      await this.schedulerService.scheduleJob({
        ...schedulerDTO,
        startDate: startDateObj,
        endDate: endDateObj,
        jobName,
        task,
      });

      return { message: `Scheduled job "${jobName}" successfully.` };
    } catch (error) {
      throw new HttpException(
        `Failed to schedule email fetch: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('stop-job')
  async stopJob(@Body('jobName') jobName: string) {
    try {
      await this.schedulerService.stopJob(jobName);
      return { message: `Job "${jobName}" stopped successfully.` };
    } catch (error) {
      throw new HttpException(
        `Failed to stop job: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('resume-job')
  async resumeJob(@Body('jobName') jobName: string) {
    try {
      await this.schedulerService.resumeJob(jobName);
      return { message: `Job "${jobName}" resumed successfully.` };
    } catch (error) {
      throw new HttpException(
        `Failed to resume job: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('delete-job')
  async deleteJob(@Body('jobName') jobName: string) {
    try {
      await this.schedulerService.deleteJob(jobName);
      return { message: `Job "${jobName}" deleted successfully.` };
    } catch (error) {
      throw new HttpException(
        `Failed to delete job: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

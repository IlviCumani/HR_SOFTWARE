import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CronService } from './cron/cron.service';
import { SchedulerDTO } from './schedulerDTO/scheduler.dto';
import { ScheduleJob } from './schema/job.schema';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly cronService: CronService,
    @InjectModel(ScheduleJob.name) private scheduleJobModel: Model<ScheduleJob>,
  ) {}

  async onModuleInit() {
    await this.restoreJobs();
  }

  async restoreJobs() {
    const jobs = await this.scheduleJobModel.find({ status: 'active' });
    for (const job of jobs) {
      await this.scheduleJob({
        startDate: job.startDate,
        endDate: job.endDate,
        step: job.step,
        jobName: job.name,
        task: () => this.executeJob(job.name),
      });
    }
  }

  async scheduleJob(dto: SchedulerDTO & { task: () => void }): Promise<void> {
    try {
      const cronExpression = this.cronService.getCronExpressions(
        dto.startDate,
        dto.step,
      );

      const job = new CronJob(cronExpression, dto.task);

      await this.scheduleJobModel.findOneAndUpdate(
        { name: dto.jobName },
        {
          name: dto.jobName,
          startDate: dto.startDate,
          endDate: dto.endDate,
          step: dto.step,
          status: 'active',
        },
        { upsert: true, new: true },
      );

      this.schedulerRegistry.addCronJob(dto.jobName, job);
      job.start();

      this.logger.log(
        `Job ${dto.jobName} scheduled with cron expression "${cronExpression}".`,
      );
    } catch (error) {
      this.logger.error(`Failed to schedule job ${dto.jobName}`, error.stack);
      throw error;
    }
  }

  addCronJobWithTask(name: string, seconds: string, task: () => void) {
    const job = new CronJob(`${seconds} * * * * *`, task); 

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `Job ${name} added to run every minute at ${seconds} seconds.`,
    );
  }

  async executeJob(jobName: string): Promise<void> {
    try {
      const job = await this.scheduleJobModel.findOne({ name: jobName });
      if (!job) {
        throw new Error(`Job ${jobName} not found`);
      }

      const currentDate = new Date();
      if (currentDate >= job.startDate && currentDate <= job.endDate) {
        this.logger.log(`Executing job ${jobName}`);

        await this.scheduleJobModel.findOneAndUpdate(
          { name: jobName },
          { $push: { executionHistory: new Date() } },
        );
      }
    } catch (error) {
      this.logger.error(`Failed to execute job ${jobName}`, error.stack);
    }
  }

  async stopJob(jobName: string): Promise<void> {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.stop();

      await this.scheduleJobModel.findOneAndUpdate(
        { name: jobName },
        { status: 'paused' },
      );

      this.logger.log(`Job ${jobName} stopped.`);
    } catch (error) {
      this.logger.error(`Failed to stop job ${jobName}`, error.stack);
      throw error;
    }
  }

  async resumeJob(jobName: string): Promise<void> {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.start();

      await this.scheduleJobModel.findOneAndUpdate(
        { name: jobName },
        { status: 'active' },
      );

      this.logger.log(`Job ${jobName} resumed.`);
    } catch (error) {
      this.logger.error(`Failed to resume job ${jobName}`, error.stack);
      throw error;
    }
  }

  async rescheduleJob(
    jobName: string,
    newCronExpression: string,
  ): Promise<void> {
    try {
      const job = this.schedulerRegistry.getCronJob(jobName);
      job.setTime(new CronTime(newCronExpression));
      job.start();

      await this.scheduleJobModel.findOneAndUpdate(
        { name: jobName },
        { step: newCronExpression },
      );

      this.logger.log(
        `Job ${jobName} rescheduled with new cron expression "${newCronExpression}".`,
      );
    } catch (error) {
      this.logger.error(`Failed to reschedule job ${jobName}`, error.stack);
      throw error;
    }
  }

  async deleteJob(jobName: string): Promise<void> {
    try {
      this.schedulerRegistry.deleteCronJob(jobName);
      await this.scheduleJobModel.findOneAndDelete({ name: jobName });
      this.logger.log(`Job ${jobName} deleted.`);
    } catch (error) {
      this.logger.error(`Failed to delete job ${jobName}`, error.stack);
      throw error;
    }
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDate().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`Job: ${key} -> next: ${next}`);
    });
  }
}

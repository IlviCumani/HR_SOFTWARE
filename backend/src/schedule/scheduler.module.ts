import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleJob, ScheduleJobSchema } from './schema/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ScheduleJob.name,
        schema: ScheduleJobSchema,
      },
    ]),
    NestScheduleModule.forRoot(),
  ],
  providers: [CronService, SchedulerService],
  exports: [SchedulerService],
  controllers: [SchedulerController],
})
export class SchedulerModule {}

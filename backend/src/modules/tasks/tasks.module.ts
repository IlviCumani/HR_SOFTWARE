import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/tasks.schema';
import { Controller, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { NotificationsGateway } from 'src/notificationsGateway/notifications.gateway';
import { NotificationsGatewayModule } from 'src/notificationsGateway/notificationgateAway.module';
import { NotificationsService } from 'src/notificationsGateway/notifications.service';
import { NotificationsModule } from 'src/notificationsGateway/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    NotificationsGatewayModule,
    NotificationsModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}

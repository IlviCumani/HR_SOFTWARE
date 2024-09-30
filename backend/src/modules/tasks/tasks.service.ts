import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './tasksDTO/tasks.dto';
import { Task } from './schema/tasks.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationsGateway } from 'src/notificationsGateway/notifications.gateway';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateNotificationDto } from 'src/notificationsGateway/dto/CreateNotificationDto';
import { NotificationsService } from 'src/notificationsGateway/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly notificationService: NotificationsService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const createdTask = new this.taskModel(createTaskDto);
      return await createdTask.save();
    } catch (error) {
      console.log(error);
    }
  }

  @Cron(CronExpression.EVERY_12_HOURS, { name: 'Task Notification' })
  async handleCron() {
    await this.notifyTasksDueInOneDay();
  }

  async notifyTasksDueInOneDay(): Promise<Task[] | void> {
    const oneDayBefore = new Date();
    oneDayBefore.setDate(oneDayBefore.getDate() + 1);
    oneDayBefore.setHours(0, 0, 0, 0);

    const endOfTwoDaysBefore = new Date(oneDayBefore);
    endOfTwoDaysBefore.setHours(23, 59, 59, 999);

    const tasksDueInTwoDays = await this.taskModel
      .find({
        due_date: {
          $gte: oneDayBefore,
          $lte: endOfTwoDaysBefore,
        },
      })
      .exec();

    tasksDueInTwoDays.forEach((task) => {
      this.notificationsGateway.notifyDueDayTask(
        `Task ${task.title} Due in 1 Day`,
        {
          title: task.title,
          description: task.description,
        },
      );
    });
    const createNotificationDto: CreateNotificationDto = {
      message: `Your task is due tommorow`,
      isRead: false,
      userId: null,
      path: `/dashboard`,
    };
    await this.notificationService.createNotification(createNotificationDto);
  }

  findAllTasks(): Promise<Task[]> {
    return this.taskModel.find({ isDeleted: false }).exec();
  }

  findTaskById(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  softDeleteTaskById(id: string): Promise<Task> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return this.taskModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deleteDate: currentDate },
      { new: true },
    );
  }

  editTask(id: string, updateTaskDto: CreateTaskDto): Promise<Task | null> {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }
}
